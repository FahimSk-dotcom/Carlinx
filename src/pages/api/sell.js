import { createRouter } from 'next-connect';
import multer from 'multer';
import mongoose from 'mongoose';
import cloudinary from '@/config/cloudinary';
import { Readable } from 'stream';  

// Multer configuration (store in memory instead of disk)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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
    await mongoose.connect(process.env.MONGODB_URI1);
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
    imagePath: { type: String, required: true }, // Now stores Cloudinary URL
  },
  {
    collection: 'VehicleSellRequests',
    timestamps: true,
  }
);

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

const router = createRouter();
router.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

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

// Function to upload image buffer to Cloudinary
const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'uploads' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url); // Get the Cloudinary URL
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

// POST route to upload image & save data
router.post(async (req, res) => {
  try {
    await runMiddleware(req, res, upload.single('image'));

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Upload file to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(req.file.buffer);

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

    // Save to MongoDB
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
      imagePath: cloudinaryUrl, // Store Cloudinary URL in database
    };

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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler();
