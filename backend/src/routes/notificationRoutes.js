const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

const objectIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid notification id'),
  validateRequest,
];

const createNotificationValidator = [
  body('userId').isMongoId().withMessage('Valid user id is required'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('status')
    .optional()
    .isIn(['Unread', 'Read'])
    .withMessage('Status must be Unread or Read'),
  validateRequest,
];

const updateNotificationValidator = [
  body('userId').optional().isMongoId().withMessage('User id must be valid'),
  body('type').optional().trim().notEmpty().withMessage('Type cannot be empty'),
  body('message').optional().trim().notEmpty().withMessage('Message cannot be empty'),
  body('status')
    .optional()
    .isIn(['Unread', 'Read'])
    .withMessage('Status must be Unread or Read'),
  validateRequest,
];

router.post('/', createNotificationValidator, notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.get('/:id', objectIdParamValidator, notificationController.getNotification);
router.put(
  '/:id',
  [...objectIdParamValidator, ...updateNotificationValidator],
  notificationController.updateNotification
);
router.delete('/:id', objectIdParamValidator, notificationController.deleteNotification);

module.exports = router;
