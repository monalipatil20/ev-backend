const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  upload.fields([
    { name: 'aadhaar', maxCount: 1 },
    { name: 'license', maxCount: 1 },
    { name: 'rcBook', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'pollutionCertificate', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'bankProof', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
  ]),
  (req, res, next) => {
    const normalized = [];
    Object.values(req.files || {}).forEach((entries) => {
      normalized.push(...entries);
    });
    req.files = normalized;
    uploadController.uploadFiles(req, res, next);
  }
);

module.exports = router;
