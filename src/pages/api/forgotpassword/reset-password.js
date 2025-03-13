import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, dob, password } = req.body;

  if (!email || !dob || !password) {
    return res.status(400).json({ message: 'Email, date of birth, and password are required' });
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
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify DOB as an additional security check
    if (existingUser.dob !== dob) {
      return res.status(400).json({ message: 'Date of birth does not match our records' });
    }
    
    // Update the password
    let updatedPassword;
    if (isAdmin) {
      // For Admin collection - store as plain text
      updatedPassword = password;
    } else {
      // For Registration collection - hash the password
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }
    
    await collection.updateOne(
      { email },
      { $set: { password: updatedPassword } }
    );
    
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}