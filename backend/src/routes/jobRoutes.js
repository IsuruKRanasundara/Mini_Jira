const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const jobController = require('../controllers/jobController');

const router = express.Router();

const objectIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid job id'),
  validateRequest,
];

const createJobValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType')
    .isIn(['Full-time', 'Part-time', 'Freelance'])
    .withMessage('Job type must be Full-time, Part-time, or Freelance'),
  body('jobCategory').trim().notEmpty().withMessage('Job category is required'),
  body('employerId').isMongoId().withMessage('Valid employer id is required'),
  body('salaryRange.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  body('salaryRange.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a positive number'),
  validateRequest,
];

const updateJobValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('company').optional().trim().notEmpty().withMessage('Company cannot be empty'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('jobType')
    .optional()
    .isIn(['Full-time', 'Part-time', 'Freelance'])
    .withMessage('Job type must be Full-time, Part-time, or Freelance'),
  body('jobCategory')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job category cannot be empty'),
  body('employerId').optional().isMongoId().withMessage('Employer id must be valid'),
  body('salaryRange.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  body('salaryRange.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a positive number'),
  validateRequest,
];

router.post('/', createJobValidator, jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', objectIdParamValidator, jobController.getJob);
router.put('/:id', [...objectIdParamValidator, ...updateJobValidator], jobController.updateJob);
router.delete('/:id', objectIdParamValidator, jobController.deleteJob);

module.exports = router;
