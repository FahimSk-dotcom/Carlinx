import { MongoClient, ObjectId } from 'mongodb';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import cloudinary from '@/config/cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

async function uploadToCloudinary(file) {
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'uploads',
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}

export default async function handler(req, res) {
  const { method } = req;
  const client = await connectToDatabase();
  const db = client.db(process.env.DB_NAME);

  switch (method) {
    case 'GET':
      try {
        const { section } = req.query;
        if (section === 'Shop') {
          const ShopCollection = db.collection('ShopPartsData');
          const items = await ShopCollection.find().sort({ created_at: -1 }).toArray();
          const data = {
            ShopDetails: items.map(item => ({
              id: item._id.toString(),
              name: item.name,
              description: item.Description,
              price: item.price ? `₹${(item.price).toLocaleString()}` : 'N/A',
              img: item.img,
              stock: item.Stock,
              status: item.status || 'active'
            }))
          };
          return res.status(200).json({ success: true, data });
        }
      } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const form = formidable({
          keepExtensions: true,
          maxFileSize: 5 * 1024 * 1024,
          multiples: false,
        });

        const [fields, files] = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve([fields, files]);
          });
        });

        console.log('Received fields:', fields);
        console.log('Received files:', files);

        let imgUrl = null;
        if (files.image && files.image.length > 0) {
          imgUrl = await uploadToCloudinary(files.image[0]);
        }

        const newItem = {
          id:fields.id[0],
          name: fields.name[0],
          Description: fields.description[0],
          price: parseFloat(fields.price[0]),
          Stock: parseInt(fields.stock[0]),
          status: fields.status ? fields.status[0] : 'active',
          img: imgUrl,
          created_at: new Date()
        };
        console.log(fields.id[0])
        console.log('Inserting item:', newItem);
        const result = await db.collection('ShopPartsData').insertOne(newItem);

        return res.status(201).json({ 
          success: true, 
          id: result.insertedId,
          imgPath: imgUrl
        });
      } catch (error) {
        console.error('Error in POST handler:', error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error'
        });
      }
      break;

    case 'PUT':
      try {
        const form = formidable();
        const [fields, files] = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve([fields, files]);
          });
        });

        const id = fields.id[0];
        const status = fields.status[0];
        const name = fields.name[0];
        const description = fields.description[0];
        const price = parseFloat(fields.price[0]);
        const stock = parseInt(fields.stock[0]);

        if (!id || !status) {
          return res.status(400).json({
            success: false,
            error: 'ID and status are required'
          });
        }

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid ID format'
          });
        }

        const updateData = {
          name: name,
          Description: description,
          price: price,
          Stock: stock,
          status: status
        };

        if (files.image && files.image.length > 0) {
          updateData.img = await uploadToCloudinary(files.image[0]);
        }

        const result = await db.collection('ShopPartsData').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'Item not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Item updated successfully'
        });
      } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const form = formidable();
        const [fields] = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields) => {
            if (err) reject(err);
            resolve([fields]);
          });
        });

        const id = fields.id[0];
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid ID format'
          });
        }

        const result = await db.collection('ShopPartsData').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'Item not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Item deleted successfully'
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
