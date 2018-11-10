import multer from 'multer';




const ImageUpload = (req, res, next) => { console.log('eee')
console.log(req.file)
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
    cb(null, 'assets/uploads/products/');
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

next();
}

export default ImageUpload;
