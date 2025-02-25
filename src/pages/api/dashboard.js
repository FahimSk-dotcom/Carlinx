import { MongoClient, ObjectId } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  const { method } = req;
  const client = await connectToDatabase();
  const db = client.db(process.env.DB_NAME);

  switch (method) {
    case 'GET':
      try {
        const { section } = req.query;
        let data = {};

        switch (section) {
          case 'dashboard':
            const ordersCollection = db.collection('Orders');
            let payments = [];
            try {
              payments = await ordersCollection.find().sort({ created_at: -1 }).toArray();
              data = {
                paymentDetails: payments.map(payment => ({
                  id: payment._id.toString(),
                  transaction: payment.id || 'N/A',
                  amount: payment.amount_data ? `₹${(payment.amount_data / 100).toLocaleString()}` : 'N/A',
                  status: payment.status ? payment.status.toUpperCase() : 'N/A',
                  customerName: payment.c_name || 'N/A',
                  contact: payment.c_no || 'N/A'
                }))
              };
            } catch (error) {
              console.error('Error fetching payments:', error);
              data = { paymentDetails: [] };
            }
            break;

          case 'testdrive':
            const testDrives = await db.collection('TestDrive').find().sort({ selectedDate: 1 }).toArray();
            data = testDrives.map(drive => ({
              id: drive._id.toString(),
              customerName: drive.name,
              phoneNumber: drive.pnumber,
              city: drive.city,
              brand: drive.brandname,
              model: drive.carModel,
              transmission: drive.transmission,
              location: drive.TestDriveLocation,
              date: drive.selectedDate,
              status: drive.status || 'Pending' // Default status if not set
            }));
            break;
          default:
            return res.status(400).json({ message: 'Invalid section specified' });
        }

        return res.status(200).json({ success: true, data });

      } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          message: 'Internal Server Error',
          error: error.message
        });
      }

    case 'PUT':
      try {
        const { id, status } = req.body;

        if (!id || !status) {
          return res.status(400).json({
            success: false,
            message: 'ID and status are required'
          });
        }

        const result = await db.collection('TestDrive').updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: status } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({
            success: false,
            message: 'Test drive not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Status updated successfully'
        });

      } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({
          success: false,
          message: 'Error updating status',
          error: error.message
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}