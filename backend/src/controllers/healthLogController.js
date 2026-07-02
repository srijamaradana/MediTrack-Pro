const HealthLog = require('../models/HealthLog');
const User = require('../models/User');

// @desc    Get health logs for a user
// @route   GET /api/health-logs
// @access  Private
exports.getHealthLogs = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { patient: req.user.id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      HealthLog.find(query)
        .populate('patient', 'name email')
        .populate('medications.medication', 'name dosage')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ date: -1 }),
      HealthLog.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get health logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get health logs',
    });
  }
};

// @desc    Get health log by ID
// @route   GET /api/health-logs/:id
// @access  Private
exports.getHealthLogById = async (req, res) => {
  try {
    const log = await HealthLog.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('medications.medication', 'name dosage');

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Health log not found',
      });
    }

    if (log.patient._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this log',
      });
    }

    res.status(200).json({
      success: true,
      log,
    });
  } catch (error) {
    console.error('Get health log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get health log',
    });
  }
};

// @desc    Add new health log
// @route   POST /api/health-logs
// @access  Private
exports.addHealthLog = async (req, res) => {
  try {
    const {
      symptoms,
      medications,
      vitals,
      mood,
      sleep,
      exercise,
      diet,
      painLevel,
      stressLevel,
      energyLevel,
      notes,
    } = req.body;

    const log = await HealthLog.create({
      patient: req.user.id,
      symptoms,
      medications,
      vitals,
      mood,
      sleep,
      exercise,
      diet,
      painLevel,
      stressLevel,
      energyLevel,
      notes,
      reportedBy: req.user.id,
    });

    // Check for high risk vitals
    if (log.isHighRisk) {
      // Create alert notification
      await Notification.create({
        user: req.user.id,
        type: 'alert',
        title: '⚠️ Health Alert',
        message: 'Your recent vital signs indicate a potential health risk. Please consult a doctor immediately.',
        priority: 'urgent',
        actionUrl: `/health-log/${log._id}`,
        relatedId: log._id,
        relatedModel: 'HealthLog',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Health log added successfully',
      log,
    });
  } catch (error) {
    console.error('Add health log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add health log',
    });
  }
};

// @desc    Update health log
// @route   PUT /api/health-logs/:id
// @access  Private
exports.updateHealthLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const log = await HealthLog.findById(id);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Health log not found',
      });
    }

    if (log.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this log',
      });
    }

    Object.keys(updates).forEach((key) => {
      if (key !== 'patient' && key !== '_id' && key !== 'createdAt') {
        log[key] = updates[key];
      }
    });

    await log.save();

    res.status(200).json({
      success: true,
      message: 'Health log updated successfully',
      log,
    });
  } catch (error) {
    console.error('Update health log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update health log',
    });
  }
};

// @desc    Delete health log
// @route   DELETE /api/health-logs/:id
// @access  Private
exports.deleteHealthLog = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await HealthLog.findById(id);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Health log not found',
      });
    }

    if (log.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this log',
      });
    }

    await log.remove();

    res.status(200).json({
      success: true,
      message: 'Health log deleted successfully',
    });
  } catch (error) {
    console.error('Delete health log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete health log',
    });
  }
};

// @desc    Get health trends
// @route   GET /api/health-logs/trends
// @access  Private
exports.getHealthTrends = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    let startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
    else if (period === 'year') startDate.setFullYear(startDate.getFullYear() - 1);

    const logs = await HealthLog.find({
      patient: req.user.id,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Calculate trends
    const trends = {
      vitals: {
        bloodPressure: [],
        heartRate: [],
        temperature: [],
        weight: [],
        bloodSugar: [],
      },
      mood: [],
      sleep: [],
      painLevel: [],
      stressLevel: [],
      energyLevel: [],
    };

    logs.forEach((log) => {
      if (log.vitals) {
        if (log.vitals.bloodPressureSystolic && log.vitals.bloodPressureDiastolic) {
          trends.vitals.bloodPressure.push({
            date: log.date,
            systolic: log.vitals.bloodPressureSystolic,
            diastolic: log.vitals.bloodPressureDiastolic,
          });
        }
        if (log.vitals.heartRate) {
          trends.vitals.heartRate.push({
            date: log.date,
            value: log.vitals.heartRate,
          });
        }
        if (log.vitals.temperature) {
          trends.vitals.temperature.push({
            date: log.date,
            value: log.vitals.temperature,
          });
        }
        if (log.vitals.weight) {
          trends.vitals.weight.push({
            date: log.date,
            value: log.vitals.weight,
          });
        }
        if (log.vitals.bloodSugar) {
          trends.vitals.bloodSugar.push({
            date: log.date,
            value: log.vitals.bloodSugar,
          });
        }
      }

      if (log.mood) {
        trends.mood.push({
          date: log.date,
          value: log.mood,
        });
      }

      if (log.sleep) {
        trends.sleep.push({
          date: log.date,
          hours: log.sleep.hours,
          quality: log.sleep.quality,
        });
      }

      if (log.painLevel !== undefined) {
        trends.painLevel.push({
          date: log.date,
          value: log.painLevel,
        });
      }

      if (log.stressLevel !== undefined) {
        trends.stressLevel.push({
          date: log.date,
          value: log.stressLevel,
        });
      }

      if (log.energyLevel !== undefined) {
        trends.energyLevel.push({
          date: log.date,
          value: log.energyLevel,
        });
      }
    });

    res.status(200).json({
      success: true,
      trends,
    });
  } catch (error) {
    console.error('Get health trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get health trends',
    });
  }
};