import { createRouter } from 'next-connect';
import multer from 'multer';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = './public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  },
});

const router = createRouter();

// Configure mongoose schema
const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    rtoLocation: { type: String, required: true },
    mtgYear:{ type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String, required: true },
    kmDriven: { type: String, required: true },
    fuelType:{ type: String, required: true },
    owner: { type: String, required: true },
    description: String,
    imagePath:{ type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'VehicleSellRequests', 
  }
);

// Middleware to connect to MongoDB
router.use(async (req, res, next) => {
  try {
    if (mongoose.connections[0].readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI1, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    }
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// POST route to upload vehicle details
router.post(async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ error: err.message });
      }

      const {
        name,
        email,
        mobile,
        rtoLocation,
        mtgYear,
        brand,
        model,
        variant,
        kmDriven,
        fuelType,
        owner,
        description,
      } = req.body;

      if (!name || !email || !mobile) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      try {
        const Vehicle =
          mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newVehicle = new Vehicle({
          name,
          email,
          mobile,
          rtoLocation,
          mtgYear,
          brand,
          model,
          variant,
          kmDriven,
          fuelType,
          owner,
          description,
          imagePath,
        });

        await newVehicle.save();

        res.status(200).json({
          success: true,
          data: newVehicle,
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ error: 'Failed to save to database' });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler();
