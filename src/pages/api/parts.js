// API to handle parts data
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { search, minPrice, maxPrice } = req.query;

    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const partsCollection = db.collection('ShopPartsData');

      // Build the query object dynamically based on filters
      const query = {};

      if (search) {
        query.name = { $regex: search, $options: 'i' }; // Case-insensitive match for search term
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice, 10);
        if (maxPrice) query.price.$lte = parseInt(maxPrice, 10);
      }
      if (req.query.id) {
        query.id = parseInt(req.query.id, 10);
      }


      // Fetch filtered data
      const parts = await partsCollection.find(query).toArray();

      return res.status(200).json(parts);
    } catch (error) {
      return res.status(500).json({ message: 'Database connection error', error: error.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
