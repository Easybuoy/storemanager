import jwt from 'jsonwebtoken';

import keys from '../config/keys';


class Authenticate {
  static isLoggedIn(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, keys.secretOrKey);
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

  // Checks if user making the request is the store attendant admin
  static isStoreAttendantAdmin(req, res, next) {
    if (req.user.type !== 2) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }

  // Checks if user making the request is the store attendant
  static isStoreAttendant(req, res, next) {
    if (req.user.type !== 3) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}

export default Authenticate;
