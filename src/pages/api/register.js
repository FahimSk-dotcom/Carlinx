import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, dob, email, password } = req.body;

    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection('Registration');

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 8); // Hash with 10 salt rounds

      // Store user with hashed password
      const result = await usersCollection.insertOne({
        name,
        dob,
        email,
        password: hashedPassword, // Save the hashed password
      });

      res.status(201).json({ message: "User registered successfully", user: result });

    } catch (error) {
      res.status(500).json({ message: 'Database connection error', error: error.message });
    } finally {
      await client.close();
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
