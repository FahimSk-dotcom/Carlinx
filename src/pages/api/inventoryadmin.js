import { MongoClient, ObjectId } from 'mongodb';
import formidable from 'formidable';
import cloudinary from '@/config/cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();
  cachedClient = client;
  return client;
}

async function uploadToCloudinary(file) {
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'cars',
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
  const collection = db.collection('InventoryCar');

  switch (method) {
    case 'GET':
      try {
        const items = await collection.find().sort({ created_at: -1 }).toArray();
        const data = {
          Inventory: items.map(item => ({
            id: item._id.toString(),
            item_id : item.item_id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            rating: item.rating,
            reviews: item.reviews,
            condition: item.condition,
            transmission: item.transmission,
            mileage: item.mileage,
            model: item.model,
            fuel: item.fuel
          }))
          
        };
        return res.status(200).json({ success: true, data });
      } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

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

        let imageUrl = null;
        if (files.image && files.image.length > 0) {
          imageUrl = await uploadToCloudinary(files.image[0]);
        }

        const newCar = {
          item_id: fields.item_id[0],
          name: fields.name[0],
          description: fields.description[0],
          price: `$${fields.price[0]}`,
          image: imageUrl,
          rating: parseFloat(fields.rating[0]),
          reviews: fields.reviews[0],
          condition: fields.condition[0],
          transmission: fields.transmission[0],
          mileage: fields.mileage[0],
          model: fields.model[0],
          fuel: fields.fuel[0],
          created_at: new Date()
        };

        const result = await collection.insertOne(newCar);

        return res.status(201).json({ 
          success: true, 
          id: result.insertedId,
          imagePath: imageUrl
        });
      } catch (error) {
        console.error('Error in POST handler:', error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error'
        });
      }

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
        console.log(id)
        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'ID is required'
          });
        }

        const updateData = {
          name: fields.name[0],
          item_id : fields.item_id[0],
          description: fields.description[0],
          price: fields.price[0],
          rating: parseFloat(fields.rating[0]),
          reviews: fields.reviews[0],
          condition: fields.condition[0],
          transmission: fields.transmission[0],
          mileage: fields.mileage[0],
          model: fields.model[0],
          fuel: fields.fuel[0]
        };

        if (files.image && files.image.length > 0) {
          updateData.image = await uploadToCloudinary(files.image[0]);
        }

        const result = await db.collection('InventoryCar').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
          );

        if (result.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'Car not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Car updated successfully'
        });
      } catch (error) {
        console.error('Error updating car:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

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
        console.log(id)

        const result = await db.collection('InventoryCar').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'Car not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Car deleted successfully'
        });
      } catch (error) {
        console.error('Error deleting car:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}