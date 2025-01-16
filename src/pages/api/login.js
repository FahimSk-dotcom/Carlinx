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

  if (req.method === 'POST') {
    const { email, password } = req.body;
    console.log('Request Body:', req.body);
    if (!email || !password) {
      // Handle missing email or password in the request body
      return res.status(400).json({ message: "Email and password are required." });
    }

    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection('Registration');
      
      // Check if the user with the provided email exists
      const existingUser = await usersCollection.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare the entered password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // If email and password match, send a success response
      return res.status(200).json({ message: "Login successful" });

    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Database connection error', error: error.message });
    } finally {
      // Ensure the client is closed after the request is completed
      await client.close();
    }

  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
