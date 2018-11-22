const queries = {
  userExist: 'SELECT * FROM users WHERE email = $1',
  userExistWithId: 'SELECT * FROM users WHERE id = $1',
  userInsert: `INSERT INTO
    users(id, name, email, password, type, status, userImage, created_at)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    returning *`,
  userUpdate: 'UPDATE users SET type=($2) WHERE id=($1) returning *',
  userAttendants: 'SELECT name, email, status, userimage FROM users WHERE type = 2',
  productInsert: `INSERT INTO
    products(id, name, description, quantity, price, category_id, product_image, created_at)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    returning *`,
  productExist: 'SELECT * FROM products ',
  productExistWithId: 'SELECT * FROM products WHERE id = $1',
  productDeleteWithId: 'DELETE FROM products WHERE id = $1 returning *',
  productUpdateWithId: 'UPDATE products SET name=($2), description=($3), quantity=($4), price=($5), category_id=($6), product_image=($7), updated_at=($8) WHERE id=($1) returning *',
  productUpdateCategoryWithId: 'UPDATE products SET category_id=($2), updated_at=($3) WHERE id=($1) returning *',
  categoryExists: 'SELECT * FROM categories ',
  categoryExistWithId: 'SELECT * FROM categories WHERE id = $1',
  categoryExistWithName: 'SELECT * FROM categories WHERE name = $1',
  categoryUpdateWithId: 'UPDATE categories SET name=($2), updated_at=($3) WHERE id=($1) returning *',
  categoryDeleteWithId: 'DELETE FROM categories WHERE id = $1 returning *',
  categoryInsert: `INSERT INTO
  categories(id, name, created_at)
  VALUES($1, $2, $3)
  returning *`,
  saleInsert: `INSERT INTO
  sales(id, store_attendant_user_id, orders, total_sale_amount, created_at)
  VALUES($1, $2, $3, $4, $5)
  returning *`,
  ordersInsert: `INSERT INTO
  orders(id, sale_id, product_id, quantity, created_at)
  VALUES($1, $2, $3, $4, $5)
  returning *`,
  salesExistForGetSales: 'SELECT o.sale_id, o.quantity, o.created_at, p.name, p.description, p.price FROM orders as o JOIN products as p ON o.product_id = p.id;',
  salesByIdAdmin: `SELECT p.name, p.description, p.product_image, p.price, o.quantity, o.created_at FROM sales as s JOIN orders as o ON 
  s.id = o.sale_id JOIN products as p ON o.product_id = p.id WHERE s.id = $1;`,
  salesByIdAttendant: `SELECT p.name, p.description, p.product_image, p.price, o.quantity, o.created_at FROM sales as s JOIN orders as o ON 
  s.id = o.sale_id JOIN products as p ON o.product_id = p.id WHERE s.store_attendant_user_id = $2 AND s.id = $1;`,
};

export default queries;
