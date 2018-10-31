import jwt from 'jsonwebtoken';
/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

const { SECRET_OR_KEY } = process.env;

class Authenticate {
  static isLoggedIn(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, SECRET_OR_KEY);
      req.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  // Checks if user making the request is the store owner / admin
  static isAdmin(req, res, next) {
    if (req.user.type !== 1) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }


  // Checks if user making the request is the store attendant
  static isStoreAttendant(req, res, next) {
    if (req.user.type !== 2) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}

export default Authenticate;
