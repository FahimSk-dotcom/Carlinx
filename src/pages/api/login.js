import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

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
      return res.status(500).json({ message: 'Database connection error', error: error.message });
    } finally {
      await client.close();
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
