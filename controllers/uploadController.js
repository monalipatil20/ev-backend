const uploadFiles = async (req, res, next) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];

    return res.status(201).json({
      success: true,
      message: 'Files uploaded successfully',
      data: files.map((file) => ({
        fieldName: file.fieldname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadFiles,
};
