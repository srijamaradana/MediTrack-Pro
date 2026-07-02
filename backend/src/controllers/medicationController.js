const Medication = require('../models/Medication');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all medications for a patient
// @route   GET /api/medications
// @access  Private
exports.getMedications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = { patient: req.user.id };
    if (status) query.status = status;

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [medications, total] = await Promise.all([
      Medication.find(query)
        .populate('prescribedBy', 'user')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Medication.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: medications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medications',
    });
  }
};

// @desc    Get medication by ID
// @route   GET /api/medications/:id
// @access  Private
exports.getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id)
      .populate('prescribedBy', 'user')
      .populate('patient', 'name email');

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found',
      });
    }

    // Check if user owns this medication
    if (medication.patient._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this medication',
      });
    }

    res.status(200).json({
      success: true,
      medication,
    });
  } catch (error) {
    console.error('Get medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medication',
    });
  }
};

// @desc    Add new medication
// @route   POST /api/medications
// @access  Private
exports.addMedication = async (req, res) => {
  try {
    const {
      name,
      genericName,
      dosage,
      frequency,
      times,
      startDate,
      endDate,
      duration,
      instructions,
      prescribedBy,
      prescription,
      category,
      stock,
      refillReminder,
    } = req.body;

    const medication = await Medication.create({
      patient: req.user.id,
      name,
      genericName,
      dosage,
      frequency,
      times,
      startDate,
      endDate,
      duration,
      instructions,
      prescribedBy,
      prescription,
      category: category || 'prescription',
      stock,
      refillReminder,
      createdBy: req.user.id,
    });

    // Create notification for new medication
    await Notification.create({
      user: req.user.id,
      type: 'medication',
      title: 'New Medication Added',
      message: `You have been prescribed ${name}. Please follow the schedule.`,
      priority: 'medium',
      actionUrl: `/medications/${medication._id}`,
      relatedId: medication._id,
      relatedModel: 'Medication',
    });

    res.status(201).json({
      success: true,
      message: 'Medication added successfully',
      medication,
    });
  } catch (error) {
    console.error('Add medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add medication',
    });
  }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private
exports.updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const medication = await Medication.findById(id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found',
      });
    }

    // Check ownership
    if (medication.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this medication',
      });
    }

    // Update fields
    Object.keys(updates).forEach((key) => {
      if (key !== 'patient' && key !== '_id' && key !== 'createdAt') {
        medication[key] = updates[key];
      }
    });

    await medication.save();

    res.status(200).json({
      success: true,
      message: 'Medication updated successfully',
      medication,
    });
  } catch (error) {
    console.error('Update medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update medication',
    });
  }
};

// @desc    Delete medication
// @route   DELETE /api/medications/:id
// @access  Private
exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const medication = await Medication.findById(id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found',
      });
    }

    // Check ownership
    if (medication.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this medication',
      });
    }

    await medication.remove();

    res.status(200).json({
      success: true,
      message: 'Medication deleted successfully',
    });
  } catch (error) {
    console.error('Delete medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete medication',
    });
  }
};

// @desc    Mark medication as taken
// @route   POST /api/medications/:id/take
// @access  Private
exports.markAsTaken = async (req, res) => {
  try {
    const { id } = req.params;
    const { time, notes } = req.body;

    const medication = await Medication.findById(id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found',
      });
    }

    if (medication.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this medication',
      });
    }

    const result = await medication.markTaken(time || new Date().toLocaleTimeString());

    if (notes) {
      const adherenceEntry = result.adherence[result.adherence.length - 1];
      if (adherenceEntry) {
        adherenceEntry.notes = notes;
        await result.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Medication marked as taken',
      medication: result,
    });
  } catch (error) {
    console.error('Mark as taken error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark medication as taken',
    });
  }
};

// @desc    Get medication adherence stats
// @route   GET /api/medications/adherence
// @access  Private
exports.getAdherenceStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const medications = await Medication.find({
      patient: req.user.id,
      status: 'active',
    });

    let totalDoses = 0;
    let takenDoses = 0;
    const dailyStats = {};

    medications.forEach((med) => {
      med.adherence.forEach((entry) => {
        if (entry.date >= startDate) {
          totalDoses++;
          if (entry.taken) takenDoses++;
          
          const dateKey = entry.date.toISOString().split('T')[0];
          if (!dailyStats[dateKey]) {
            dailyStats[dateKey] = { total: 0, taken: 0 };
          }
          dailyStats[dateKey].total++;
          if (entry.taken) dailyStats[dateKey].taken++;
        }
      });
    });

    const chartData = Object.keys(dailyStats).map((date) => ({
      date,
      adherence: Math.round((dailyStats[date].taken / dailyStats[date].total) * 100),
      total: dailyStats[date].total,
      taken: dailyStats[date].taken,
    }));

    res.status(200).json({
      success: true,
      stats: {
        overallAdherence: totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0,
        totalDoses,
        takenDoses,
        missedDoses: totalDoses - takenDoses,
        chartData,
      },
    });
  } catch (error) {
    console.error('Get adherence stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get adherence stats',
    });
  }
};