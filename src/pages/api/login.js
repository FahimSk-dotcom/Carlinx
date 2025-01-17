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
  console.log('Request method:', req.method);

  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password in request body');
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      console.log('Connecting to MongoDB...');
      const client = await connectToDatabase();
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection('Registration');

      console.log('Querying user with email:', email);
      const existingUser = await usersCollection.findOne({ email });
      if (!existingUser) {
        console.log('User not found');
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      console.log('Login successful');
      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
        stack: error.stack,
      });
    }
  } else {
    console.log('Unsupported HTTP method:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
