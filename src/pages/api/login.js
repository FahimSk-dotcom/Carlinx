import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

let client;

export default async function handler(req, res) {
  // Ensure that the MongoDB client is only initialized once
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  console.log('Request method:', req.method);

  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      // Log missing parameters
      console.log('Missing email or password in request body');
      return res.status(400).json({ message: "Email and password are required." });
    }

    try {
      console.log('Connecting to MongoDB...');
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection('Registration');

      // Check if the user with the provided email exists
      console.log('Querying user with email:', email);
      const existingUser = await usersCollection.findOne({ email });
      if (!existingUser) {
        console.log('User not found');
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare the entered password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        return res.status(400).json({ message: "Invalid email or password" });
      }

      console.log('Login successful');
      return res.status(200).json({ message: "Login successful" });

    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        message: 'Database connection error', 
        error: error.message, 
        stack: error.stack // Log stack trace for deeper debugging
      });
    } finally {
      console.log('Closing MongoDB connection');
      await client.close();
    }

  } else {
    console.log('Unsupported HTTP method:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
