import { MongoClient, ObjectId } from 'mongodb';
import formidable from 'formidable';
import cloudinary from '@/config/cloudinary';
import nodemailer from 'nodemailer';

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
      folder: 'uploads',
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Helper function to send email
async function sendResponseEmail(userEmail, userName, vehicleDetails, status, responseMessage) {
  try {
    const statusText = {
      'pending': 'Pending Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'completed': 'Completed'
    }[status] || status;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Vehicle Sell Request Update</h2>
        <p>Hello ${userName},</p>
        <p>We have an update regarding your vehicle sell request for ${vehicleDetails.brand} ${vehicleDetails.model} ${vehicleDetails.variant}.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Status: <span style="color: ${status === 'approved' ? '#28a745' : status === 'rejected' ? '#dc3545' : status === 'completed' ? '#17a2b8' : '#ffc107'}">${statusText}</span></h3>
          <p style="margin-bottom: 0;"><strong>Message:</strong> ${responseMessage}</p>
        </div>
        
        <h4 style="margin-bottom: 10px;">Vehicle Details:</h4>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Manufacturing Year:</strong> ${vehicleDetails.mYear}</li>
          <li><strong>Kilometers Driven:</strong> ${vehicleDetails.km}</li>
          <li><strong>Fuel Type:</strong> ${vehicleDetails.fuel}</li>
          <li><strong>RTO Location:</strong> ${vehicleDetails.rLoc}</li>
        </ul>
        
        <p>If you have any questions or need further assistance, please contact our support team.</p>
        <p>Thank you for choosing our service.</p>
        <p style="margin-bottom: 0;">Best Regards,</p>
        <p style="margin-top: 5px;">The Vehicle Team</p>
      </div>
    `;

    const mailOptions = {
      from: `"Vehicle Sales" <${process.env.EMAIL_FROM}>`,
      to: userEmail,
      subject: `Update on Your Vehicle Sell Request: ${statusText}`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
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
        if (section === 'selladmin') {
          const SellCollection = db.collection('VehicleSellRequests');
          const items = await SellCollection.find().sort({ created_at: -1 }).toArray();
          const data = {
            SellReqDetails: items.map(item => ({
              id: item._id.toString(),
              item_id: item.item_id,
              name: item.name,
              phone: item.mobile,
              rLoc: item.rtoLocation,
              mYear: item.mtgYear,
              brand: item.brand,
              model: item.model,
              variant: item.variant,
              km: item.kmDriven,
              fuel: item.fuelType,
              owner: item.owner,
              description: item.Description,
              img: item.imgagePath,
              status:item.status || 'NA',
              date: new Date(item.createdAT).toISOString().split('T')[0]
            }))
            
          };
          return res.status(200).json({ success: true, data });
        } else if (section === 'sellrequest') {
          // Handle sellrequest section
          const SellCollection = db.collection('VehicleSellRequests');
          const items = await SellCollection.find().sort({ created_at: -1 }).toArray();
          const data = {
            SellReqDetails: items.map(item => ({
              id: item._id.toString(),
              item_id: item.item_id || 'REQ-' + item._id.toString().substr(-6),
              name: item.name,
              email: item.email, // Make sure email is included in the response
              phone: item.mobile,
              rLoc: item.rtoLocation,
              mYear: item.mtgYear,
              brand: item.brand,
              model: item.model,
              variant: item.variant,
              km: item.kmDriven,
              fuel: item.fuelType,
              owner: item.owner,
              description: item.description,
              img: item.imagePath,
              status:item.status || 'pending',
              adminresposne:item.adminResponse,
              date: item.createdAt && !isNaN(new Date(item.createdAt))
                ? new Date(item.createdAt).toISOString().split('T')[0]
                : 'N/A'
            }))
          };
          return res.status(200).json({ success: true, data });
        } else {
          // Return empty data if section is not recognized
          return res.status(200).json({ success: true, data: { SellReqDetails: [] } });
        }
      } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const form = formidable();
        const [fields] = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields) => {
            if (err) reject(err);
            resolve([fields]);
          });
        });

        const id = fields.vehicleId[0];
        const status = fields.status[0];
        const response = fields.response[0];

        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Request ID is required'
          });
        }

        // Get the vehicle request details to access user's email
        const vehicleRequest = await db.collection('VehicleSellRequests').findOne({ _id: new ObjectId(id) });
        
        if (!vehicleRequest) {
          return res.status(404).json({
            success: false,
            error: 'Request not found'
          });
        }

        const result = await db.collection('VehicleSellRequests').updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: status,
              adminResponse: response,
              updatedAt: new Date()
            }
          }
        );

        // Send email notification if we have the user's email
        if (vehicleRequest.email) {
          const vehicleDetails = {
            brand: vehicleRequest.brand || '',
            model: vehicleRequest.model || '',
            variant: vehicleRequest.variant || '',
            mYear: vehicleRequest.mtgYear || '',
            km: vehicleRequest.kmDriven || '',
            fuel: vehicleRequest.fuelType || '',
            rLoc: vehicleRequest.rtoLocation || ''
          };

          await sendResponseEmail(
            vehicleRequest.email,
            vehicleRequest.name || 'Customer',
            vehicleDetails,
            status,
            response
          );
        } else {
          console.warn(`No email found for vehicle request ${id}, email notification skipped`);
        }

        return res.status(200).json({
          success: true,
          message: 'Response sent successfully'
        });
      } catch (error) {
        console.error('Error updating request:', error);
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
        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'ID is required'
          });
        }

        const result = await db.collection('VehicleSellRequests').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'Request not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Request deleted successfully'
        });
      } catch (error) {
        console.error('Error deleting request:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}