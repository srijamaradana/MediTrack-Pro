const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendAppointmentConfirmation, sendAppointmentReminder } = require('../config/nodemailer');

// @desc    Get all appointments for a user
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { patient: req.user.id };

    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('doctor', 'user specialization hospital')
        .populate('patient', 'name email')
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
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
    });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'user specialization hospital')
      .populate('patient', 'name email profile')
      .populate('prescription')
      .populate('medicalReports');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check authorization
    if (appointment.patient._id.toString() !== req.user.id && req.user.role !== 'admin') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor || appointment.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this appointment',
        });
      }
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment',
    });
  }
};

// @desc    Book new appointment
// @route   POST /api/appointments
// @access  Private
exports.bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      time,
      duration,
      type,
      symptoms,
      notes,
      isVirtual,
    } = req.body;

    // Check if doctor exists and is available
    const doctor = await Doctor.findById(doctorId).populate('user', 'name email');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    if (!doctor.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available at the moment',
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time: time,
      status: { $in: ['scheduled', 'confirmed'] },
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked',
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      time,
      duration: duration || 30,
      type: type || 'consultation',
      symptoms: symptoms || [],
      notes,
      isVirtual: isVirtual || false,
    });

    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'appointment',
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctor.user.name} has been booked for ${new Date(date).toLocaleDateString()} at ${time}`,
      priority: 'high',
      actionUrl: `/appointments/${appointment._id}`,
      relatedId: appointment._id,
      relatedModel: 'Appointment',
    });

    // Send confirmation email
    try {
      const patient = await User.findById(req.user.id);
      await sendAppointmentConfirmation(appointment, patient, doctor);
    } catch (emailError) {
      console.error('Appointment confirmation email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findById(id).populate('doctor', 'user');
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check authorization
    if (appointment.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor || appointment.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this appointment',
        });
      }
    }

    const result = await appointment.cancel(reason || 'Cancelled by user', req.user.role);

    // Create notification
    await Notification.create({
      user: appointment.patient,
      type: 'appointment',
      title: 'Appointment Cancelled',
      message: `Your appointment with Dr. ${appointment.doctor.user.name} has been cancelled`,
      priority: 'medium',
      actionUrl: `/appointments/${appointment._id}`,
      relatedId: appointment._id,
      relatedModel: 'Appointment',
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment: result,
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
    });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTime, reason } = req.body;

    const appointment = await Appointment.findById(id).populate('doctor', 'user');
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check authorization
    if (appointment.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor || appointment.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to reschedule this appointment',
        });
      }
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctor: appointment.doctor._id,
      date: new Date(newDate),
      time: newTime,
      status: { $in: ['scheduled', 'confirmed'] },
      _id: { $ne: id },
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked',
      });
    }

    const result = await appointment.reschedule(
      new Date(newDate),
      newTime,
      reason || 'Rescheduled by user',
      req.user.role
    );

    // Create notification
    await Notification.create({
      user: appointment.patient,
      type: 'appointment',
      title: 'Appointment Rescheduled',
      message: `Your appointment has been rescheduled to ${new Date(newDate).toLocaleDateString()} at ${newTime}`,
      priority: 'medium',
      actionUrl: `/appointments/${appointment._id}`,
      relatedId: appointment._id,
      relatedModel: 'Appointment',
    });

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment: result,
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reschedule appointment',
    });
  }
};

// @desc    Get available time slots for a doctor
// @route   GET /api/appointments/available-slots/:doctorId
// @access  Private
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Check if doctor works on this day
    if (!doctor.availability.days.includes(dayOfWeek)) {
      return res.status(200).json({
        success: true,
        slots: [],
        message: 'Doctor is not available on this day',
      });
    }

    // Get doctor's time slots for this day
    const daySlots = doctor.availability.timeSlots;

    // Get booked appointments for this day
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999),
      },
      status: { $in: ['scheduled', 'confirmed'] },
    });

    const bookedTimes = bookedAppointments.map((a) => a.time);

    // Generate available slots
    const availableSlots = [];
    daySlots.forEach((slot) => {
      const startTime = slot.start;
      const endTime = slot.end;
      
      // Generate 30-minute slots
      let currentTime = startTime;
      while (currentTime < endTime) {
        if (!bookedTimes.includes(currentTime)) {
          availableSlots.push(currentTime);
        }
        // Add 30 minutes
        const [hours, minutes] = currentTime.split(':').map(Number);
        const newMinutes = minutes + 30;
        const newHours = hours + Math.floor(newMinutes / 60);
        currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes % 60).padStart(2, '0')}`;
      }
    });

    res.status(200).json({
      success: true,
      slots: availableSlots,
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available slots',
    });
  }
};