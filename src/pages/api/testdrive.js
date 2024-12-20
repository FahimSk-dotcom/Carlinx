// pages/api/register.js
import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URI);
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, pnumber, city,brandname,carModel,transmission,TestDriveLocation,selectedDate } = req.body;

    // Connect to MongoDB
    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection('TestDrive');

      // Check if the phone number already exists
      const existingUser = await usersCollection.findOne({ pnumber });
      if (existingUser) {
        return res.status(400).json({ message: 'PhoneNumber already exists!' });
      }

      // Insert user data
      const result = await usersCollection.insertOne({
        name,
        pnumber,
        city,
        brandname,
        carModel,
        transmission,
        TestDriveLocation,
        selectedDate
      });

      res.status(201).json({ message: 'TestDrive Booked successfully', user: result });
    } catch (error) {
      res.status(500).json({ message: 'Database connection error', error: error.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
