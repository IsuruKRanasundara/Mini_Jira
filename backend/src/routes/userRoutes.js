const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const userController = require('../controllers/userController');

const router = express.Router();

const objectIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid user id'),
  validateRequest,
];

const registerValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validateRequest,
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
  validateRequest,
];

const updateValidator = [
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('password')
    .optional()
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validateRequest,
];

router.post('/register', registerValidator, userController.registerUser);
router.post('/login', loginValidator, userController.loginUser);
router.get('/', userController.getUsers);
router.get('/:id', objectIdParamValidator, userController.getUser);
router.put('/:id', [...objectIdParamValidator, ...updateValidator], userController.updateUser);
router.delete('/:id', objectIdParamValidator, userController.deleteUser);

module.exports = router;
