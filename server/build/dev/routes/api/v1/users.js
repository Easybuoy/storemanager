'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _authenticate = require('../../../middleware/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _userController = require('../../../controllers/userController');

var _userController2 = _interopRequireDefault(_userController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { login, signup, getCurrentUser } = _userController2.default;

const { isLoggedIn, isAdmin } = _authenticate2.default;
const router = _express2.default.Router();

// @route   POST api/v1/users/register
// @desc    Register user
// @access  Private
router.post('/signup', isLoggedIn, isAdmin, signup);

// @route   POST api/v1/users/register
// @desc     Login user / Returning JWT Token
// @access   Public
router.post('/login', login);

// @route   GET api/v1/users/current
// @desc     Return current user
// @access   Private
router.get('/current', isLoggedIn, getCurrentUser);

module.exports = router;