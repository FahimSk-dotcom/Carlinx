import { MongoClient } from 'mongodb';

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

  const { email, dob } = req.body;

  // Validate request parameters
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
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
      return res.status(404).json({ message: 'Email not found' });
    }
    
    // If DOB is provided, verify it
    if (dob) {
      if (existingUser.dob !== dob) {
        return res.status(400).json({ message: 'Date of birth does not match our records' });
      }
    }
    
    return res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}