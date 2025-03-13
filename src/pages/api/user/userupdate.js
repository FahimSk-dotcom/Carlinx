// pages/api/user/update.js
import { MongoClient } from 'mongodb';
import formidable from 'formidable';
import cloudinary from '@/config/cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
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

    const email = fields.email?.[0];
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    try {
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection('Registration');

      const existingUser = await usersCollection.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const updateData = {};
      
      Object.keys(fields).forEach(key => {
        if (key !== 'email' && fields[key][0]) {
          updateData[key] = fields[key][0];
        }
      });

      let profileImageUrl = null;
      if (files.profileImage && files.profileImage.length > 0) {
        profileImageUrl = await uploadToCloudinary(files.profileImage[0]);
        if (profileImageUrl) {
          updateData.profileImage = profileImageUrl;
        }
      }
      const result = await usersCollection.updateOne(
        { email },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'User updated successfully',
        data: updateData,
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
