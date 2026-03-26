const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

const objectIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid application id'),
  validateRequest,
];

const createApplicationValidator = [
  body('userId').isMongoId().withMessage('Valid user id is required'),
  body('jobId').isMongoId().withMessage('Valid job id is required'),
  body('applicationStatus')
    .optional()
    .isIn(['Pending', 'Interview', 'Rejected', 'Offer'])
    .withMessage('Status must be Pending, Interview, Rejected, or Offer'),
  body('offerDetails.salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Offered salary must be a positive number'),
  validateRequest,
];

const updateApplicationValidator = [
  body('userId').optional().isMongoId().withMessage('User id must be valid'),
  body('jobId').optional().isMongoId().withMessage('Job id must be valid'),
  body('applicationStatus')
    .optional()
    .isIn(['Pending', 'Interview', 'Rejected', 'Offer'])
    .withMessage('Status must be Pending, Interview, Rejected, or Offer'),
  body('offerDetails.salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Offered salary must be a positive number'),
  validateRequest,
];

router.post('/', createApplicationValidator, applicationController.createApplication);
router.get('/', applicationController.getApplications);
router.get('/:id', objectIdParamValidator, applicationController.getApplication);
router.put(
  '/:id',
  [...objectIdParamValidator, ...updateApplicationValidator],
  applicationController.updateApplication
);
router.delete('/:id', objectIdParamValidator, applicationController.deleteApplication);

module.exports = router;
