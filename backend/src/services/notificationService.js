const Notification = require('../models/Notification');

const createNotification = async (payload) => {
  const notification = await Notification.create(payload);
  return notification;
};

const getAllNotifications = async () => {
  return Notification.find();
};

const getNotificationById = async (id) => {
  return Notification.findById(id);
};

const updateNotificationById = async (id, payload) => {
  return Notification.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteNotificationById = async (id) => {
  return Notification.findByIdAndDelete(id);
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
};
