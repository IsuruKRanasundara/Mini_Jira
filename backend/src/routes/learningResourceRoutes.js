const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const learningResourceController = require('../controllers/learningResourceController');

const router = express.Router();

const objectIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid learning resource id'),
  validateRequest,
];

const createLearningResourceValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('url').isURL().withMessage('Valid URL is required'),
  body('skillName').trim().notEmpty().withMessage('Skill name is required'),
  body('platform').trim().notEmpty().withMessage('Platform is required'),
  body('difficultyLevel')
    .isIn(['Easy', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty level must be Easy, Intermediate, or Advanced'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  validateRequest,
];

const updateLearningResourceValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('type').optional().trim().notEmpty().withMessage('Type cannot be empty'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('url').optional().isURL().withMessage('URL must be valid'),
  body('skillName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Skill name cannot be empty'),
  body('platform')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Platform cannot be empty'),
  body('difficultyLevel')
    .optional()
    .isIn(['Easy', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty level must be Easy, Intermediate, or Advanced'),
  body('duration')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Duration cannot be empty'),
  validateRequest,
];

router.post('/', createLearningResourceValidator, learningResourceController.createLearningResource);
router.get('/', learningResourceController.getLearningResources);
router.get('/:id', objectIdParamValidator, learningResourceController.getLearningResource);
router.put(
  '/:id',
  [...objectIdParamValidator, ...updateLearningResourceValidator],
  learningResourceController.updateLearningResource
);
router.delete('/:id', objectIdParamValidator, learningResourceController.deleteLearningResource);

module.exports = router;
