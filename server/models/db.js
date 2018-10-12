module.exports = {
  products: [
    {
      id: 1,
      name: 'Google Pixel 2',
      description: 'The Google Pixel 2 is powered by 1.9GHz octa-core processor and it comes with 4GB of RAM. The phone packs 64GB of internal storage that cannot be expanded.',
      quantity: 50,
      price: '$649',
    },
    {
      id: 2,
      name: 'Google Pixel 3',
      description: 'The Pixel 3 is the latest causality. Wireless charging is a new feature for the Pixel phones, and a welcome change now that Google is launching the Pixel Stand wireless charger alongside its new devices.',
      quantity: 75,
      price: '$1000',
    },
    {
      id: 3,
      name: 'iPhone 7 Plus',
      description: 'The phone comes with a 5.50-inch touchscreen display with a resolution of 1080 pixels by 1920 pixels at a PPI of 401 pixels per inch.',
      quantity: 125,
      price: '$600',
    },
  ],
  sales: [
    {
      id: 1,
      store_attendant_user_id: 2,
      product_id: 1,
      date_time: '2018-10-12T13:04:51.884Z',

    },
    {
      id: 2,
      store_attendant_user_id: 1,
      product_id: 3,
      date_time: '2018-10-12T13:04:51.884Z',
    },
  ],
};
