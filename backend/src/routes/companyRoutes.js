const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const companyController = require('../controllers/companyController');

const router = express.Router();

const objectIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid company id'),
  validateRequest,
];

const createCompanyValidator = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('companyDescription')
    .trim()
    .notEmpty()
    .withMessage('Company description is required'),
  body('companyWebsite').isURL().withMessage('Valid company website URL is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('employerUsers')
    .optional()
    .isArray()
    .withMessage('Employer users must be an array of user ids'),
  body('employerUsers.*')
    .optional()
    .isMongoId()
    .withMessage('Each employer user id must be valid'),
  validateRequest,
];

const updateCompanyValidator = [
  body('companyName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty'),
  body('companyDescription')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company description cannot be empty'),
  body('companyWebsite').optional().isURL().withMessage('Company website must be valid'),
  body('industry').optional().trim().notEmpty().withMessage('Industry cannot be empty'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('employerUsers')
    .optional()
    .isArray()
    .withMessage('Employer users must be an array of user ids'),
  body('employerUsers.*')
    .optional()
    .isMongoId()
    .withMessage('Each employer user id must be valid'),
  validateRequest,
];

router.post('/', createCompanyValidator, companyController.createCompany);
router.get('/', companyController.getCompanies);
router.get('/:id', objectIdParamValidator, companyController.getCompany);
router.put('/:id', [...objectIdParamValidator, ...updateCompanyValidator], companyController.updateCompany);
router.delete('/:id', objectIdParamValidator, companyController.deleteCompany);

module.exports = router;
