const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require('../controllers/notificationController');

// Validation rules
const markAsReadValidation = [
  body('read').optional().isBoolean(),
];

// All routes require authentication
router.use(protect);

// Main routes
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/mark-all-read', markAllAsRead);

// Individual notification routes
router.get('/:id', getNotificationById);
router.put('/:id', markAsReadValidation, validate, markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;