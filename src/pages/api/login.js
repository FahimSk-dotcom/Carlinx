import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      const client = await connectToDatabase();
      const db = client.db(process.env.DB_NAME);
      
      // Determine which collection to query based on if email includes "admin"
      const isAdmin = email.includes('admin');
      const collectionName = isAdmin ? 'Admin' : 'Registration';
      const collection = db.collection(collectionName);
      
      // Find the user in the appropriate collection
      const existingUser = await collection.findOne({ email });
      
      if (!existingUser) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check password differently based on collection
      let isPasswordValid = false;
      
      if (isAdmin) {
        // For Admin collection - direct comparison (plain text password)
        isPasswordValid = (password === existingUser.password);
      } else {
        // For Registration collection - bcrypt comparison (hashed password)
        isPasswordValid = await bcrypt.compare(password, existingUser.password);
      }
      
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      return res.status(200).json({ 
        message: 'Login successful',
        user: {
          email: existingUser.email,
          isAdmin
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
        stack: error.stack,
      });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}