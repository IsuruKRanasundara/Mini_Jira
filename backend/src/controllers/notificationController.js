const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notificationService');

const createNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.createNotification(req.body);

  return res.status(201).json({
    message: 'Notification created successfully',
    data: notification,
  });
});

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getAllNotifications();
  return res.status(200).json({ data: notifications });
});

const getNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  return res.status(200).json({ data: notification });
});

const updateNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.updateNotificationById(req.params.id, req.body);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  return res.status(200).json({
    message: 'Notification updated successfully',
    data: notification,
  });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.deleteNotificationById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  return res.status(200).json({ message: 'Notification deleted successfully' });
});

module.exports = {
  createNotification,
  getNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
};
