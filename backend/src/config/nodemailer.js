const nodemailer = require('nodemailer');
const { emailTemplates } = require('../utils/emailTemplates');

let transporter;

const createTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
    });

    // Verify transporter
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:', error);
      } else {
        console.log('✅ Email transporter ready');
      }
    });
  }
  return transporter;
};

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"MediTrack Pro" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text || null,
      attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${options.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

// Pre-built email functions
const sendWelcomeEmail = async (user) => {
  const html = emailTemplates.welcomeEmail(user);
  return sendEmail({
    email: user.email,
    subject: `🏥 Welcome to MediTrack Pro, ${user.name}!`,
    html,
  });
};

const sendAppointmentConfirmation = async (appointment, patient, doctor) => {
  const html = emailTemplates.appointmentConfirmation(appointment, patient, doctor);
  return sendEmail({
    email: patient.email,
    subject: `📅 Appointment Confirmed - ${appointment.date}`,
    html,
  });
};

const sendAppointmentReminder = async (appointment, patient, doctor) => {
  const html = emailTemplates.appointmentReminder(appointment, patient, doctor);
  return sendEmail({
    email: patient.email,
    subject: `⏰ Reminder: Your Appointment Tomorrow`,
    html,
  });
};

const sendMedicationReminder = async (medication, patient) => {
  const html = emailTemplates.medicationReminder(medication, patient);
  return sendEmail({
    email: patient.email,
    subject: `💊 Time to take your medication - ${medication.name}`,
    html,
  });
};

const sendPasswordReset = async (user, resetToken) => {
  const html = emailTemplates.passwordReset(user, resetToken);
  return sendEmail({
    email: user.email,
    subject: '🔐 Reset Your Password - MediTrack Pro',
    html,
  });
};

const sendReportUploaded = async (report, patient) => {
  const html = emailTemplates.reportUploaded(report, patient);
  return sendEmail({
    email: patient.email,
    subject: `📄 New Medical Report: ${report.title}`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendMedicationReminder,
  sendPasswordReset,
  sendReportUploaded,
};