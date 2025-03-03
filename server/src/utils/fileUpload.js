const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ServerError = require('../errors/ServerError');
const env = process.env.NODE_ENV || 'development';
const devFilePath = path.resolve(__dirname, '..', '..', 'public/images');

const filePath = env === 'production' ? '/var/www/html/images/' : devFilePath;

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, filePath);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

const handleFileUpload = (uploadFunction) => (req, res, next) => {
  uploadFunction(req, res, (err) => {
    if (err instanceof multer.MulterError || err) {
      return next(new ServerError());
    }
    return next();
  });
};
module.exports.uploadAvatar = handleFileUpload(upload.single('file'));
module.exports.uploadContestFiles = handleFileUpload(upload.array('files', 3));
module.exports.updateContestFile = handleFileUpload(upload.single('file'));
module.exports.uploadLogoFiles = handleFileUpload(upload.single('offerData'));
