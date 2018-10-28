import uuidv4 from 'uuid/v4';
import bcrypt from 'bcryptjs';

import db from '../models/db';

const addUser = (name, email, password, userImage, type, status) => {
  const hashedpassword = bcrypt.hashSync(password, 10);

  const text = `INSERT INTO
        users(id, name, email, password, type, status, userImage, created_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        returning *`;
  const values = [
    uuidv4(),
    name,
    email,
    hashedpassword,
    type,
    status,
    userImage,
    new Date(),
  ];

  db.query(text, values).then(() => {
    return 'success';
  }).catch(() => {
    return 'failed.';
  });
};

const addProduct = (name, description, quantity, price, productImage) => {
  const text = `INSERT INTO
          products(id, name, description, quantity, price, product_image, created_at)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          returning *`;
  const values = [
    uuidv4(),
    name,
    description,
    quantity,
    price,
    productImage,
    new Date(),
  ];

  db.query(text, values).then(() => {
    return 'success';
  }).catch((e) => { console.log(e)
    return 'failed.';
  });
};

// Add test data for user
addUser('Example', 'example@gmail.com', '123456', 'uploads\\users\\default-avatar.png', 1, 1);
addUser('Example', 'example2@gmail.com', '123456', 'uploads\\users\\default-avatar.png', 3, 1);
addUser('Example Example', 'example3@gmail.com', '123456', 'uploads\\users\\default-avatar.png', 2, 1);

// Add test data for products
addProduct('Google Pixel 2', 'The Google Pixel 2 is powered by 1.9GHz octa-core processor and it comes with 4GB of RAM. The phone packs 64GB of internal storage that cannot be expanded.', 50, 649, 'uploads\\products\\default.png');
addProduct('Google Pixel 3', 'The Pixel 3 is the latest causality. Wireless charging is a new feature for the Pixel phones, and a welcome change now that Google is launching the Pixel Stand wireless charger alongside its new devices.', 75, 800, 'uploads\\products\\default.png');
addProduct('iPhone 7 Plus', 'The phone comes with a 5.50-inch touchscreen display with a resolution of 1080 pixels by 1920 pixels at a PPI of 401 pixels per inch.', 125, 800, 'uploads\\products\\default.png');
