const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const skillController = require('../controllers/skillController');

const router = express.Router();

const objectIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid skill id'),
  validateRequest,
];

const createSkillValidator = [
  body('skillName').trim().notEmpty().withMessage('Skill name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  validateRequest,
];

const updateSkillValidator = [
  body('skillName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Skill name cannot be empty'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  validateRequest,
];

router.post('/', createSkillValidator, skillController.createSkill);
router.get('/', skillController.getSkills);
router.get('/:id', objectIdParamValidator, skillController.getSkill);
router.put('/:id', [...objectIdParamValidator, ...updateSkillValidator], skillController.updateSkill);
router.delete('/:id', objectIdParamValidator, skillController.deleteSkill);

module.exports = router;
