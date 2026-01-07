const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'post-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Arquivo não fornecido',
        message: 'Nenhum arquivo foi enviado'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('[UploadController] ✅ Imagem enviada:', req.file.filename);

    return res.status(200).json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('[UploadController] ❌ Erro no upload:', error);
    return res.status(500).json({
      error: 'Erro no upload',
      message: error.message || 'Erro ao fazer upload da imagem'
    });
  }
}

module.exports = {
  upload,
  uploadImage
};
