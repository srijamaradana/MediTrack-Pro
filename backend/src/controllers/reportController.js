const MedicalReport = require('../models/MedicalReport');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

// @desc    Get all reports for a user
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;

    const query = { patient: req.user.id };
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
      MedicalReport.find(query)
        .populate('doctor', 'user')
        .populate('uploadedBy', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      MedicalReport.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reports',
    });
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
exports.getReportById = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'user')
      .populate('uploadedBy', 'name')
      .populate('sharedWith.doctor', 'user');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Check authorization
    const isOwner = report.patient._id.toString() === req.user.id;
    const isDoctor = await Doctor.findOne({ user: req.user.id });
    const isShared = report.sharedWith.some(
      (s) => s.doctor && s.doctor._id.toString() === isDoctor?._id.toString()
    );

    if (!isOwner && !isDoctor && req.user.role !== 'admin' && !isShared) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this report',
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report',
    });
  }
};

// @desc    Upload new medical report
// @route   POST /api/reports
// @access  Private
exports.uploadReport = async (req, res) => {
  try {
    const { title, type, description, tags, doctorId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file, {
      folder: `meditrack/reports/${req.user.id}`,
    });

    const report = await MedicalReport.create({
      patient: req.user.id,
      doctor: doctorId,
      title,
      type,
      description,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      fileUrl: uploadResult.fileUrl,
      filePublicId: uploadResult.filePublicId,
      fileType: uploadResult.fileType,
      fileSize: uploadResult.fileSize,
      fileName: req.file.originalname,
      uploadedBy: req.user.id,
      uploadedByRole: req.user.role,
    });

    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'report',
      title: 'Report Uploaded',
      message: `Your medical report "${title}" has been uploaded successfully`,
      priority: 'medium',
      actionUrl: `/reports/${report._id}`,
      relatedId: report._id,
      relatedModel: 'MedicalReport',
    });

    // If doctor is specified, notify them
    if (doctorId) {
      await Notification.create({
        user: doctorId,
        type: 'report',
        title: 'New Medical Report',
        message: `New medical report "${title}" has been uploaded for review`,
        priority: 'high',
        actionUrl: `/reports/${report._id}`,
        relatedId: report._id,
        relatedModel: 'MedicalReport',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Report uploaded successfully',
      report,
    });
  } catch (error) {
    console.error('Upload report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload report',
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await MedicalReport.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Check authorization
    if (report.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report',
      });
    }

    // Delete from Cloudinary
    if (report.filePublicId) {
      await deleteFromCloudinary(report.filePublicId);
    }

    await report.remove();

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
    });
  }
};

// @desc    Share report with doctor
// @route   POST /api/reports/:id/share
// @access  Private
exports.shareReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorId, permission } = req.body;

    const report = await MedicalReport.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Check ownership
    if (report.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to share this report',
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    await report.shareWith(doctorId, permission || 'view');

    // Notify doctor
    await Notification.create({
      user: doctor.user,
      type: 'report',
      title: 'Report Shared with You',
      message: `A new medical report "${report.title}" has been shared with you`,
      priority: 'high',
      actionUrl: `/reports/${report._id}`,
      relatedId: report._id,
      relatedModel: 'MedicalReport',
    });

    res.status(200).json({
      success: true,
      message: 'Report shared successfully',
      report,
    });
  } catch (error) {
    console.error('Share report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share report',
    });
  }
};

// @desc    Review report (doctor)
// @route   PUT /api/reports/:id/review
// @access  Private (Doctor only)
exports.reviewReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewNotes } = req.body;

    const report = await MedicalReport.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Check if doctor is authorized
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can review reports',
      });
    }

    // Check if doctor has access to this report
    const hasAccess = report.sharedWith.some(
      (s) => s.doctor.toString() === doctor._id.toString()
    );

    if (!hasAccess && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this report',
      });
    }

    report.reviewed = true;
    report.reviewedAt = new Date();
    report.reviewedBy = doctor._id;
    report.reviewNotes = reviewNotes;
    await report.save();

    // Notify patient
    await Notification.create({
      user: report.patient,
      type: 'report',
      title: 'Report Reviewed',
      message: `Your report "${report.title}" has been reviewed by Dr. ${doctor.user.name}`,
      priority: 'medium',
      actionUrl: `/reports/${report._id}`,
      relatedId: report._id,
      relatedModel: 'MedicalReport',
    });

    res.status(200).json({
      success: true,
      message: 'Report reviewed successfully',
      report,
    });
  } catch (error) {
    console.error('Review report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review report',
    });
  }
};