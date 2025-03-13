import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import formidable from 'formidable';
import cloudinary from '@/config/cloudinary';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for form data
  },
};

const client = new MongoClient(process.env.MONGODB_URI);

async function uploadToCloudinary(file) {
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'profile_pictures',
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Use formidable to parse form data including files
      const form = formidable({
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB max file size
        multiples: false,
      });

      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      // Extract form fields
      const name = fields.name[0];
      const dob = fields.dob[0];
      const email = fields.email[0];
      const password = fields.password[0];

      // Validate required fields
      if (!name || !dob || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection('Registration');

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Handle profile image upload if provided
      let profileImageUrl = null;
      if (files.profileImage && files.profileImage.length > 0) {
        profileImageUrl = await uploadToCloudinary(files.profileImage[0]);
      }

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 8);

      // Store user with hashed password and profile image URL
      const result = await usersCollection.insertOne({
        name,
        dob,
        email,
        password: hashedPassword,
        profileImage: profileImageUrl,
        createdAt: new Date()
      });

      res.status(201).json({ 
        message: "User registered successfully", 
        user: { ...result, profileImage: profileImageUrl }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'Server error occurred', 
        error: error.message 
      });
    } finally {
      await client.close();
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}