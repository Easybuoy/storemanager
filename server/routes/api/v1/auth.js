import express from 'express';
import multer from 'multer';

import authenticate from '../../../middleware/authenticate';
import usersController from '../../../controllers/auth';

const {
  login, signup, getCurrentUser, makeAdmin, getAttendants, deleteAttendant, getUserById,
} = usersController;

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/uploads/users/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + file.originalname);
  },
});

const upload = multer(
  {
    storage,
    limits: {
      fileSize: 1024 * 1024 * 5,

    },
    fileFilter,
  },
);

const { isLoggedIn, isAdmin } = authenticate;
const router = express.Router();

// @route   POST api/v1/auth/register
// @desc    Register user
// @access  Private
router.post('/signup', isLoggedIn, isAdmin, upload.single('userImage'), signup);


// @route   POST api/v1/auth/register
// @desc     Login user / Returning JWT Token
// @access   Public
router.post('/login', login);


// @route   GET api/v1/auth/current
// @desc     Return current user
// @access   Private
router.get('/current', isLoggedIn, getCurrentUser);


// @route    POST api/v1/auth/makeadmin
// @desc     Make store attendant an admin
// @access   Private
router.post('/makeadmin', isLoggedIn, isAdmin, makeAdmin);

// @route    GET api/v1/auth/attendants
// @desc     Get All Store Attendants
// @access   Private
router.get('/attendants', isLoggedIn, isAdmin, getAttendants);

// @route    DELETE api/v1/auth/attendant/:attendantId
// @desc     Delete An Attendant.
// @access   Private
router.delete('/attendant/:id', isLoggedIn, isAdmin, deleteAttendant);

// @route    GET api/v1/auth/:id
// @desc     Get User By Id.
// @access   Private
router.get('/:id', isLoggedIn, isAdmin, getUserById);

module.exports = router;
