import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { condition, brand, model, year, price } = req.query;

    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const inventoryCollection = db.collection('InventoryCar');

      // Build the query object dynamically based on filters
      const query = {};

      if (condition && condition !== 'All Status') {
        query.condition = condition;
      }
      if (brand && brand !== 'All Brands') {
        query.name = { $regex: brand, $options: 'i' }; // Case-insensitive match
      }
      if (model && model !== 'All Model') {
        query.model = model;
      }
      if (year && year !== 'All Year') {
        query.model = year; // Assuming 'model' includes year (update as needed)
      }
      if (price && price !== 'All Price') {
        const [minPrice, maxPrice] = price.split('-').map((p) => parseInt(p.replace(/[^0-9]/g, ''), 10));
        query.price = { $gte: minPrice, $lte: maxPrice };
      }
      if (req.query.id) {
        query.item_id = parseInt(req.query.id, 10);
      }
      // Fetch filtered data
      const inventory = await inventoryCollection.find(query).toArray();

      return res.status(200).json(inventory);
    } catch (error) {
      return res.status(500).json({ message: 'Database connection error', error: error.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
