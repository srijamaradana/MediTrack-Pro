const cron = require('node-cron');
const Medication = require('../models/Medication');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendMedicationReminder, sendAppointmentReminder } = require('../config/nodemailer');

// Check for medication reminders every 15 minutes
const startMedicationReminderScheduler = () => {
  cron.schedule('*/15 * * * *', async () => {
    console.log('🔄 Running medication reminder check...');
    
    try {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      // Find medications that need reminders
      const medications = await Medication.find({
        status: 'active',
        times: { $in: [currentTime] },
      }).populate('patient', 'name email preferences');

      for (const medication of medications) {
        // Check if reminder was already sent for this time
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const existingNotification = await Notification.findOne({
          relatedId: medication._id,
          relatedModel: 'Medication',
          type: 'medication',
          createdAt: { $gte: today },
          scheduledTime: { $lte: now },
        });

        // Skip if reminder already sent today
        if (existingNotification) continue;

        // Create in-app notification
        await Notification.create({
          user: medication.patient._id,
          type: 'medication',
          title: `💊 Time to take ${medication.name}`,
          message: `Don't forget to take your ${medication.dosage} of ${medication.name}`,
          priority: 'high',
          scheduledTime: new Date(),
          deliveryMethod: ['in-app', 'email'],
          actionUrl: `/medications/${medication._id}`,
          relatedId: medication._id,
          relatedModel: 'Medication',
          metadata: {
            medicationName: medication.name,
            dosage: medication.dosage,
            frequency: medication.frequency,
          },
        });

        // Send email reminder if enabled
        if (medication.patient.preferences?.notifications?.email !== false) {
          try {
            await sendMedicationReminder(medication, medication.patient);
            console.log(`📧 Medication reminder sent to ${medication.patient.email}`);
          } catch (emailError) {
            console.error('❌ Failed to send medication reminder email:', emailError);
          }
        }
      }
    } catch (error) {
      console.error('❌ Medication reminder scheduler error:', error);
    }
  });
};

// Check for appointment reminders every hour
const startAppointmentReminderScheduler = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('🔄 Running appointment reminder check...');
    
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Find appointments scheduled for tomorrow
      const appointments = await Appointment.find({
        date: { $gte: tomorrow, $lt: dayAfterTomorrow },
        status: { $in: ['scheduled', 'confirmed'] },
        'reminders.sent': false,
      }).populate('patient', 'name email preferences')
        .populate('doctor', 'user hospital');

      for (const appointment of appointments) {
        // Create in-app notification
        await Notification.create({
          user: appointment.patient._id,
          type: 'appointment',
          title: '📅 Appointment Reminder',
          message: `You have an appointment with Dr. ${appointment.doctor.user.name} tomorrow at ${appointment.time}`,
          priority: 'high',
          scheduledTime: new Date(),
          deliveryMethod: ['in-app', 'email'],
          actionUrl: `/appointments/${appointment._id}`,
          relatedId: appointment._id,
          relatedModel: 'Appointment',
          metadata: {
            doctorName: appointment.doctor.user.name,
            hospital: appointment.doctor.hospital.name,
            date: appointment.date,
            time: appointment.time,
          },
        });

        // Send email reminder
        if (appointment.patient.preferences?.notifications?.email !== false) {
          try {
            await sendAppointmentReminder(appointment, appointment.patient, appointment.doctor);
            console.log(`📧 Appointment reminder sent to ${appointment.patient.email}`);
          } catch (emailError) {
            console.error('❌ Failed to send appointment reminder email:', emailError);
          }
        }

        // Mark reminder as sent
        appointment.reminders.sent = true;
        appointment.reminders.sentAt = new Date();
        appointment.reminders.reminderCount = (appointment.reminders.reminderCount || 0) + 1;
        appointment.reminders.lastReminderSent = new Date();
        await appointment.save();
      }
    } catch (error) {
      console.error('❌ Appointment reminder scheduler error:', error);
    }
  });
};

// Clean up old notifications (keep last 30 days)
const startNotificationCleanupScheduler = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log('🔄 Running notification cleanup...');
    
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Notification.deleteMany({
        read: true,
        createdAt: { $lt: thirtyDaysAgo },
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} old notifications`);
    } catch (error) {
      console.error('❌ Notification cleanup error:', error);
    }
  });
};

// Mark missed appointments
const startMissedAppointmentScheduler = () => {
  cron.schedule('30 23 * * *', async () => {
    console.log('🔄 Running missed appointment check...');
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find appointments that were scheduled for today but not completed
      const missedAppointments = await Appointment.find({
        date: { $gte: today, $lt: tomorrow },
        status: { $in: ['scheduled', 'confirmed'] },
      }).populate('patient', 'name email');

      for (const appointment of missedAppointments) {
        appointment.status = 'missed';
        await appointment.save();

        // Create notification
        await Notification.create({
          user: appointment.patient._id,
          type: 'appointment',
          title: '⚠️ Missed Appointment',
          message: `You missed your appointment scheduled for today at ${appointment.time}`,
          priority: 'high',
          actionUrl: `/appointments/${appointment._id}`,
          relatedId: appointment._id,
          relatedModel: 'Appointment',
        });
      }

      console.log(`✅ Marked ${missedAppointments.length} missed appointments`);
    } catch (error) {
      console.error('❌ Missed appointment scheduler error:', error);
    }
  });
};

// Start all schedulers
const startAllSchedulers = () => {
  console.log('🚀 Starting reminder schedulers...');
  
  startMedicationReminderScheduler();
  startAppointmentReminderScheduler();
  startNotificationCleanupScheduler();
  startMissedAppointmentScheduler();
  
  console.log('✅ All schedulers started successfully');
};

module.exports = {
  startMedicationReminderScheduler,
  startAppointmentReminderScheduler,
  startNotificationCleanupScheduler,
  startMissedAppointmentScheduler,
  startAllSchedulers,
};