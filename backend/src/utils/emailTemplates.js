// Email templates for different notifications

const welcomeEmail = (user, verifyUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1A202C;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F8FAFC;
        }
        .container {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #E2E8F0;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #0A6E79;
        }
        .logo span {
          color: #2D9CDB;
        }
        .content {
          padding: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 32px;
          background-color: #0A6E79;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #064A52;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #E2E8F0;
          font-size: 14px;
          color: #718096;
        }
        .highlight {
          color: #0A6E79;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏥 MediTrack <span>Pro</span></div>
        </div>
        <div class="content">
          <h1>Welcome to MediTrack Pro, ${user.name}! 👋</h1>
          <p>We're thrilled to have you on board. Your health journey starts here!</p>
          <p>With MediTrack Pro, you can:</p>
          <ul>
            <li>📅 Book and manage appointments</li>
            <li>💊 Track your medications</li>
            <li>📄 Upload and share medical reports</li>
            <li>📊 Monitor your health trends</li>
          </ul>
          <p>To get started, please verify your email address:</p>
          <div style="text-align: center;">
            <a href="${verifyUrl}" class="button">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; color: #718096;">This link will expire in 24 hours.</p>
          <p>Need help? Contact us at <a href="mailto:support@meditrack.com">support@meditrack.com</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MediTrack Pro. All rights reserved.</p>
          <p>Stay healthy, stay happy! ❤️</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const appointmentConfirmation = (appointment, patient, doctor) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1A202C;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F8FAFC;
        }
        .container {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #E2E8F0;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #0A6E79;
        }
        .appointment-details {
          background-color: #F8FAFC;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #E2E8F0;
        }
        .detail-label {
          font-weight: 600;
          color: #4A5568;
        }
        .detail-value {
          color: #1A202C;
        }
        .button {
          display: inline-block;
          padding: 12px 32px;
          background-color: #0A6E79;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #064A52;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #E2E8F0;
          font-size: 14px;
          color: #718096;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          background-color: #F0F9FA;
          color: #0A6E79;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏥 MediTrack Pro</div>
        </div>
        <div class="content">
          <h2>Appointment Confirmed! ✅</h2>
          <p>Dear <strong>${patient.name}</strong>,</p>
          <p>Your appointment has been confirmed. Here are the details:</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">👨‍⚕️ Doctor</span>
              <span class="detail-value">Dr. ${doctor.user.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🏥 Hospital</span>
              <span class="detail-value">${doctor.hospital.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📍 Location</span>
              <span class="detail-value">${doctor.hospital.address || 'To be confirmed'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Date</span>
              <span class="detail-value">${new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">⏰ Time</span>
              <span class="detail-value">${appointment.time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">⏱️ Duration</span>
              <span class="detail-value">${appointment.duration} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📋 Type</span>
              <span class="detail-value">${appointment.type.replace('-', ' ').toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📌 Status</span>
              <span class="detail-value"><span class="status-badge">${appointment.status.toUpperCase()}</span></span>
            </div>
          </div>

          ${appointment.isVirtual ? `
            <p>💻 This is a <strong>virtual consultation</strong>. You'll receive the meeting link 15 minutes before the appointment.</p>
          ` : `
            <p>📍 Please arrive <strong>15 minutes early</strong> for check-in.</p>
          `}

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/appointments/${appointment._id}" class="button">View Appointment Details</a>
          </div>

          <p style="font-size: 14px; color: #718096;">Need to reschedule? You can do so up to 24 hours in advance.</p>
          <p>Questions? Contact us at <a href="mailto:support@meditrack.com">support@meditrack.com</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MediTrack Pro. All rights reserved.</p>
          <p>Stay healthy, stay happy! ❤️</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const appointmentReminder = (appointment, patient, doctor) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1A202C;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F8FAFC;
        }
        .container {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #E2E8F0;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #0A6E79;
        }
        .reminder-box {
          background-color: #FEF3C7;
          border-left: 4px solid #F59E0B;
          padding: 16px 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 32px;
          background-color: #0A6E79;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #E2E8F0;
          font-size: 14px;
          color: #718096;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⏰ MediTrack Pro</div>
        </div>
        <div class="content">
          <div class="reminder-box">
            <h3>📅 Reminder: You have an appointment tomorrow!</h3>
          </div>
          
          <p>Dear <strong>${patient.name}</strong>,</p>
          <p>This is a friendly reminder about your upcoming appointment:</p>
          
          <div style="padding: 16px; background-color: #F8FAFC; border-radius: 8px; margin: 16px 0;">
            <p><strong>👨‍⚕️ Doctor:</strong> Dr. ${doctor.user.name}</p>
            <p><strong>📅 Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>⏰ Time:</strong> ${appointment.time}</p>
            <p><strong>📍 Location:</strong> ${doctor.hospital.name}</p>
          </div>

          ${appointment.isVirtual ? `
            <p>💻 This is a <strong>virtual consultation</strong>. You'll receive the meeting link 15 minutes before the appointment.</p>
          ` : `
            <p>📍 Please arrive <strong>15 minutes early</strong> for check-in.</p>
          `}

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/appointments/${appointment._id}" class="button">View Appointment</a>
          </div>

          <p style="font-size: 14px; color: #718096;">Need to reschedule? Contact us at <a href="mailto:support@meditrack.com">support@meditrack.com</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MediTrack Pro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const medicationReminder = (medication, patient) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1A202C;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F8FAFC;
        }
        .container {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #E2E8F0;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #0A6E79;
        }
        .medication-box {
          background-color: #F0F9FA;
          border: 2px solid #0A6E79;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 32px;
          background-color: #0A6E79;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #E2E8F0;
          font-size: 14px;
          color: #718096;
        }
        .time-badge {
          display: inline-block;
          padding: 4px 12px;
          background-color: #FEF3C7;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">💊 MediTrack Pro</div>
        </div>
        <div class="content">
          <h2>Time to take your medication! ⏰</h2>
          <p>Dear <strong>${patient.name}</strong>,</p>
          <p>This is a reminder to take your prescribed medication:</p>
          
          <div class="medication-box">
            <h3 style="color: #0A6E79; margin-top: 0;">${medication.name}</h3>
            <p><strong>💊 Dosage:</strong> ${medication.dosage}</p>
            <p><strong>📋 Frequency:</strong> ${medication.frequency}</p>
            <p><strong>⏰ Time:</strong> ${medication.times.join(', ')}</p>
            ${medication.instructions ? `<p><strong>📝 Instructions:</strong> ${medication.instructions}</p>` : ''}
            <p><span class="time-badge">⏰ Take now</span></p>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/medications/${medication._id}" class="button">View Medication</a>
          </div>

          <p style="font-size: 14px; color: #718096;">Don't forget to mark it as taken in the app!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MediTrack Pro. All rights reserved.</p>
          <p>Stay healthy, stay happy! ❤️</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const passwordReset = (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1A202C;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F8FAFC;
        }
        .container {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #E2E8F0;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #0A6E79;
        }
        .warning-box {
          background-color: #FEF3C7;
          border-left: 4px solid #F59E0B;
          padding: 16px 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 32px;
          background-color: #0A6E79;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #064A52;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #E2E8F0;
          font-size: 14px;
          color: #718096;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔐 MediTrack Pro</div>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>

          <div class="warning-box">
            <p>⚠️ This link will expire in <strong>10 minutes</strong>.</p>
          </div>

          <p style="font-size: 14px; color: #718096;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
          <p>Questions? Contact us at <a href="mailto:support@meditrack.com">support@meditrack.com</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MediTrack Pro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const reportUploaded = (report, patient) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1A202C;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F8FAFC;
        }
        .container {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #E2E8F0;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #0A6E79;
        }
        .report-box {
          background-color: #F8FAFC;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 32px;
          background-color: #0A6E79;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #E2E8F0;
          font-size: 14px;
          color: #718096;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📄 MediTrack Pro</div>
        </div>
        <div class="content">
          <h2>Medical Report Uploaded ✅</h2>
          <p>Dear <strong>${patient.name}</strong>,</p>
          <p>Your medical report has been successfully uploaded to your account.</p>
          
          <div class="report-box">
            <h3 style="color: #0A6E79; margin-top: 0;">${report.title}</h3>
            <p><strong>📋 Type:</strong> ${report.type}</p>
            <p><strong>📅 Uploaded:</strong> ${new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            ${report.description ? `<p><strong>📝 Description:</strong> ${report.description}</p>` : ''}
            <p><strong>📂 File:</strong> ${report.fileName || 'Document'}</p>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/reports/${report._id}" class="button">View Report</a>
          </div>

          <p style="font-size: 14px; color: #718096;">You can share this report with your doctor for review.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MediTrack Pro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendOtp = (otp, user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1A202C;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F8FAFC;
        }
        .container {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .otp-box {
          background-color: #F0F9FA;
          border: 2px solid #0A6E79;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 20px 0;
        }
        .otp-code {
          font-size: 48px;
          font-weight: bold;
          color: #0A6E79;
          letter-spacing: 12px;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #E2E8F0;
          font-size: 14px;
          color: #718096;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔐 MediTrack Pro</div>
        </div>
        <div class="content">
          <h2>Your Verification Code</h2>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Use the following code to verify your identity:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>

          <p style="font-size: 14px; color: #718096;">This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MediTrack Pro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const emailTemplates = {
  welcomeEmail,
  appointmentConfirmation,
  appointmentReminder,
  medicationReminder,
  passwordReset,
  reportUploaded,
  sendOtp,
};

module.exports = { emailTemplates };