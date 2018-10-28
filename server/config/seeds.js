import uuidv4 from 'uuid/v4';
import bcrypt from 'bcryptjs';

import db from '../models/db';

const addUser = (name, email, password, userImage, type, status, createdAt) => {
  const text = `INSERT INTO
        users(id, name, email, password, type, status, userImage, created_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        returning *`;
  const values = [
    uuidv4(),
    name,
    email,
    password,
    type,
    status,
    userImage,
    createdAt,
  ];

  db.query(text, values).then(() => {
    return 'success';
  }).catch(() => {
    return 'failed.';
  });
};
