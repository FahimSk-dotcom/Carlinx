// pages/api/user.js
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection('Registration');

      const user = await usersCollection.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Do not send the password back for security reasons
      const { password, ...userWithoutPassword } = user;

      return res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    } finally {
      await client.close();
    }
  } 
  
  else if (req.method === 'POST') { 
    // Handle password update
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection('Registration');

      const user = await usersCollection.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Compare old password with stored hash
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect old password' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password in database
      await usersCollection.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );

      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    } finally {
      await client.close();
    }
  } 
  
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
