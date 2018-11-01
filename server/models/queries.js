const queries = {
  userExist: 'SELECT * FROM users WHERE email = $1',
  userInsert: `INSERT INTO
  users(id, name, email, password, type, status, userImage, created_at)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8)
  returning *`,
  userUpdate: 'UPDATE users SET type=($2) WHERE id=($1) returning *',
  userAttendants: 'SELECT name, email, status, userimage FROM users WHERE type = 2',

};

export default queries;
