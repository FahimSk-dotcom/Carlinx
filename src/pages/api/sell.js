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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});


const connectDB = async () => {
  if (mongoose.connections[0].readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI1, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

// Define the schema
const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    rtoLocation: { type: String, required: true },
    mtgYear: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String, required: true },
    kmDriven: { type: String, required: true },
    fuelType: { type: String, required: true },
    owner: { type: String, required: true },
    description: { type: String },
    imagePath: { type: String, required: true },
  },
  {
    collection: 'VehicleSellRequests',
    timestamps: true,
  }
);

// Create or reuse the model
const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

const router = createRouter();

// Middleware to ensure MongoDB is connected
router.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Promisify multer middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });
};

// POST route to handle file upload and data storage
router.post(async (req, res) => {
  try {
    await runMiddleware(req, res, upload.single('image'));

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
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

    // Validate required fields
    if (
      !name ||
      !email ||
      !mobile ||
      !rtoLocation ||
      !mtgYear ||
      !brand ||
      !model ||
      !variant ||
      !kmDriven ||
      !fuelType ||
      !owner
    ) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const vehicleData = {
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
      imagePath: `/uploads/${req.file.filename}`,
    };

    // Insert into database
    const newVehicle = new Vehicle(vehicleData);
    const savedVehicle = await newVehicle.save();

    return res.status(201).json({
      success: true,
      message: 'Vehicle details saved successfully',
      data: savedVehicle,
    });
  } catch (error) {
    console.error('Error saving vehicle details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export configuration
export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser for multer
  },
};

export default router.handler();
