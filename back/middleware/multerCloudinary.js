import multer from "multer";

const storage = multer.memoryStorage(); // important for Cloudinary

const uploadCloudinary = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only JPG/PNG files are allowed"));
  },
});

export default uploadCloudinary;
