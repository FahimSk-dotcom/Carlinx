import { MongoClient } from 'mongodb';

// Cached MongoDB client to reuse connections
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(process.env.MONGODB_URI1, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    throw error;
  }
}

// API handler function
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await connectToDatabase();
      const db = client.db('Carlinx'); // Ensure the correct DB name
      const carDetailsCollection = db.collection('VehicleSellRequests');

      const count = await carDetailsCollection.countDocuments();
      if (count === 0) {
        return res.status(404).json({
          message: 'No car details found',
          success: false,
        });
      }

      // Fetch the latest car details
      const latestCarDetails = await carDetailsCollection
        .find()
        .sort({ createdAt: -1 })  // Sort by _id descending
        .limit(1)
        .toArray();

      if (!latestCarDetails || latestCarDetails.length === 0) {
        return res.status(404).json({
          message: 'No car details found',
          success: false,
        });
      }

      return res.status(200).json({
        success: true,
        data: latestCarDetails[0], // Send the first item directly
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        success: false,
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({
      message: 'Method Not Allowed',
      success: false,
    });
  }
}
