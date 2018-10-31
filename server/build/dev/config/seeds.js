'use strict';

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let storeattendantuserid = 0;


const addProduct = (name, description, quantity, price, productImage) => {
  const text = `INSERT INTO
          products(id, name, description, quantity, price, product_image, created_at)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          returning *`;
  const values = [(0, _v2.default)(), name, description, quantity, price, productImage, new Date()];

  _db2.default.query(text, values).then(() => {
    return 'success';
  }).catch(() => {
    return 'failed.';
  });
};

const addSale = (storeAttendantUserId, orders, totalSaleAmount) => {
  const text = `INSERT INTO
            sales(id, store_attendant_user_id, orders, total_sale_amount, created_at)
            VALUES($1, $2, $3, $4, $5)
            returning *`;
  const values = [(0, _v2.default)(), storeAttendantUserId, orders, totalSaleAmount, new Date()];

  _db2.default.query(text, values).then(() => {
    return 'success';
  }).catch(() => {
    return 'failed.';
  });
};

const addUser = (name, email, password, userImage, type, status) => {
  const hashedpassword = _bcryptjs2.default.hashSync(password, 10);

  const text = `INSERT INTO
          users(id, name, email, password, type, status, userImage, created_at)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8)
          returning *`;
  const values = [(0, _v2.default)(), name, email, hashedpassword, type, status, userImage, new Date()];

  _db2.default.query(text, values).then(res => {
    if (type === 3) {
      const storeattendantuserid = res.rows[0].id;
      const order = JSON.stringify([{
        product_id: 'dc936c5e-d2a8-42b4-a365-57a95a30e4b6',
        quantity: '10',
        totalProductAmount: 8000
      }, {
        product_id: 'dc936c5e-d2a8-42b4-a365-57a95a30e4b6',
        quantity: '12',
        totalProductAmount: 9600
      }]);
      addSale(storeattendantuserid, order, 17600);
      addSale(storeattendantuserid, order, 17600);
    }
    return 'success';
  }).catch(() => {
    return 'failed.';
  });
};

// Add test data for user
addUser('Example', 'example@gmail.com', '123456', 'uploads\\users\\default-avatar.png', 1, 1);
addUser('Example', 'example2@gmail.com', '123456', 'uploads\\users\\default-avatar.png', 3, 1);
addUser('Example Example', 'example3@gmail.com', '123456', 'uploads\\users\\default-avatar.png', 2, 1);
addUser('Type not exist', 'example31@gmail.com', '123456', 'uploads\\users\\default-avatar.png', 4, 1);

// Add test data for products
addProduct('Google Pixel 2', 'The Google Pixel 2 is powered by 1.9GHz octa-core processor and it comes with 4GB of RAM. The phone packs 64GB of internal storage that cannot be expanded.', 50, 649, 'uploads\\products\\default.png');
addProduct('Google Pixel 3', 'The Pixel 3 is the latest causality. Wireless charging is a new feature for the Pixel phones, and a welcome change now that Google is launching the Pixel Stand wireless charger alongside its new devices.', 75, 800, 'uploads\\products\\default.png');
addProduct('iPhone 7 Plus', 'The phone comes with a 5.50-inch touchscreen display with a resolution of 1080 pixels by 1920 pixels at a PPI of 401 pixels per inch.', 125, 800, 'uploads\\products\\default.png');