const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const MedicalReport = require('../models/MedicalReport');
const Medication = require('../models/Medication');

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private (Doctor only)
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'name email profile');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor profile',
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
exports.updateDoctorProfile = async (req, res) => {
  try {
    const {
      specialization,
      licenseNumber,
      experience,
      education,
      certifications,
      hospital,
      consultationFee,
      availability,
      about,
      languages,
    } = req.body;

    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    if (specialization) doctor.specialization = specialization;
    if (licenseNumber) doctor.licenseNumber = licenseNumber;
    if (experience) doctor.experience = experience;
    if (education) doctor.education = education;
    if (certifications) doctor.certifications = certifications;
    if (hospital) doctor.hospital = hospital;
    if (consultationFee) doctor.consultationFee = consultationFee;
    if (availability) doctor.availability = availability;
    if (about) doctor.about = about;
    if (languages) doctor.languages = languages;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      doctor,
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor profile',
    });
  }
};

// @desc    Get all doctors (with filters)
// @route   GET /api/doctors
// @access  Public
exports.getAllDoctors = async (req, res) => {
  try {
    const { specialization, isAvailable, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (specialization) query.specialization = specialization;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

    if (search) {
      query.$or = [
        { 'hospital.name': { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [doctors, total] = await Promise.all([
      Doctor.find(query)
        .populate('user', 'name email profile')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ rating: -1 }),
      Doctor.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: doctors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctors',
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email profile')
      .populate('patients.patient', 'name email profile');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor',
    });
  }
};

// @desc    Get doctor's patients
// @route   GET /api/doctors/patients
// @access  Private (Doctor only)
exports.getPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id })
      .populate('patients.patient', 'name email profile');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    res.status(200).json({
      success: true,
      patients: doctor.patients,
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patients',
    });
  }
};

// @desc    Get patient details for doctor
// @route   GET /api/doctors/patients/:patientId
// @access  Private (Doctor only)
exports.getPatientDetails = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await User.findById(patientId).select('-password');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Get patient's medical data
    const [medications, appointments, reports, healthLogs, prescriptions] = await Promise.all([
      Medication.find({ patient: patientId }),
      Appointment.find({ patient: patientId }).populate('doctor', 'user'),
      MedicalReport.find({ patient: patientId }),
      HealthLog.find({ patient: patientId }).sort({ date: -1 }).limit(30),
      Prescription.find({ patient: patientId }).populate('doctor', 'user'),
    ]);

    res.status(200).json({
      success: true,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        profile: patient.profile,
      },
      medicalData: {
        medications,
        appointments,
        reports,
        healthLogs,
        prescriptions,
      },
    });
  } catch (error) {
    console.error('Get patient details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patient details',
    });
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/doctors/appointments
// @access  Private (Doctor only)
exports.getAppointments = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;

    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const query = { doctor: doctor._id };
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('patient', 'name email profile')
        .populate('doctor', 'user')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ date: 1 }),
      Appointment.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
    });
  }
};

// @desc    Update appointment status (doctor)
// @route   PUT /api/doctors/appointments/:id
// @access  Private (Doctor only)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, vitals, diagnosis, treatmentPlan, notes } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if this doctor owns the appointment
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment',
      });
    }

    appointment.status = status;
    if (vitals) appointment.vitals = vitals;
    if (diagnosis) appointment.diagnosis = diagnosis;
    if (treatmentPlan) appointment.treatmentPlan = treatmentPlan;
    if (notes) appointment.notes = notes;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
    });
  }
};

// @desc    Get doctor statistics
// @route   GET /api/doctors/stats
// @access  Private (Doctor only)
exports.getStats = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const [totalAppointments, completedAppointments, upcomingAppointments, totalPatients] = await Promise.all([
      Appointment.countDocuments({ doctor: doctor._id }),
      Appointment.countDocuments({ doctor: doctor._id, status: 'completed' }),
      Appointment.countDocuments({
        doctor: doctor._id,
        status: { $in: ['scheduled', 'confirmed'] },
        date: { $gte: new Date() },
      }),
      doctor.patients.length,
    ]);

    // Calculate rating
    const rating = doctor.rating || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        totalPatients,
        rating,
        totalReviews: doctor.totalReviews || 0,
      },
    });
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor statistics',
    });
  }
};