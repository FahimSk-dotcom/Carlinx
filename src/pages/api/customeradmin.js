// pages/api/customeradmin.js
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
  const collection = db.collection('Registration');

  switch (method) {
    case 'GET':
      try {
        const { section, id } = req.query;

        if (section === 'customer') {
          // Fetch all customers
          const customers = await collection.find().sort({ name: 1 }).toArray();
          
          const data =  {
            Customer: customers.map(customer => ({
            id: customer._id.toString(),
            name: customer.name || 'N/A',
            email: customer.email || 'N/A',
            dob: customer.dob || 'N/A',
            // Add any other fields from your contact collection
          }))
        };
          return res.status(200).json({ 
            success: true, 
            data 
          });
        } 
        else if (id) {
          // Fetch a specific customer by ID
          const customer = await collection.findOne({ _id: new ObjectId(id) });
          
          if (!customer) {
            return res.status(404).json({
              success: false,
              message: 'Customer not found'
            });
          }
          
          return res.status(200).json({
            success: true,
            data: {
              id: customer._id.toString(),
              name: customer.name || 'N/A',
              email: customer.email || 'N/A',
              dob: customer.dob || 'N/A',
              // Add any other fields from your contact collection
            }
          });
        }
        
        return res.status(400).json({
          success: false,
          message: 'Section or ID parameter is required'
        });
      } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error fetching customers',
          error: error.message 
        });
      }

    case 'PUT':
      try {
        const { id, name, email, dob } = req.body;

        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'Customer ID is required'
          });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (dob) updateData.dob = dob;

        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            message: 'Customer not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Customer updated successfully'
        });
      } catch (error) {
        console.error('Error updating customer:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error updating customer',
          error: error.message 
        });
      }

    case 'DELETE':
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'Customer ID is required'
          });
        }

        const result = await collection.deleteOne({ 
          _id: new ObjectId(id) 
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            message: 'Customer not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Customer deleted successfully'
        });
      } catch (error) {
        console.error('Error deleting customer:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error deleting customer',
          error: error.message 
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ 
        success: false,
        message: `Method ${method} Not Allowed` 
      });
  }
}