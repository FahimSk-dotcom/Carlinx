// src/utils/emailService.js
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

export const createTransporter = () => {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const validateOrderDetails = (orderDetails) => {
  if (!orderDetails) {
    throw new Error('Order details are required');
  }

  const required = ['orderId', 'amount', 'userDetails', 'items'];
  const missing = required.filter(key => !orderDetails[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required order details: ${missing.join(', ')}`);
  }

  if (!Array.isArray(orderDetails.items) || orderDetails.items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  const { userDetails } = orderDetails;
  const requiredUserDetails = ['name', 'email', 'address', 'city', 'state', 'pincode'];
  const missingUserDetails = requiredUserDetails.filter(key => !userDetails[key]);

  if (missingUserDetails.length > 0) {
    throw new Error(`Missing required user details: ${missingUserDetails.join(', ')}`);
  }

  // Validate each item in the order
  orderDetails.items.forEach((item, index) => {
    if (!item.name || !item.quantity || !item.price) {
      throw new Error(`Invalid item at index ${index}: must contain name, quantity, and price`);
    }
  });
};

export const generateReceiptPDF = (orderDetails) => {
  return new Promise((resolve, reject) => {
    try {
      validateOrderDetails(orderDetails);

      const chunks = [];
      const doc = new PDFDocument();

      // Collect PDF chunks
      doc.on('data', chunks.push.bind(chunks));
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
      doc.on('error', reject);

      // Add company logo/header
      doc.fontSize(20).text('Carlinx', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('Payment Receipt', { align: 'center'});
      doc.moveDown();

      // Add receipt details
      doc.fontSize(12);
      doc.text(`Order ID: ${orderDetails.orderId}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Customer Name: ${orderDetails.userDetails.name}`);
      doc.text(`Email: ${orderDetails.userDetails.email}`);
      doc.moveDown();

      // Add shipping address
      doc.text('Shipping Address:');
      doc.text(orderDetails.userDetails.address);
      doc.text(`${orderDetails.userDetails.city}, ${orderDetails.userDetails.state}`);
      doc.text(`Pincode: ${orderDetails.userDetails.pincode}`);
      doc.moveDown();

      // Define table layout
      const tableTop = doc.y + 10;
      const itemX = 50;
      const qtyX = 300;
      const priceX = 400;
      const totalX = 500;
      
      // Add table headers
      doc.font('Helvetica-Bold');
      doc.text('Item', itemX, tableTop);
      doc.text('Qty', qtyX, tableTop);
      doc.text('Price', priceX, tableTop);
      doc.text('Total', totalX, tableTop);
      doc.font('Helvetica');

      // Add horizontal line below headers
      doc.moveTo(itemX, tableTop + 20)
         .lineTo(totalX + 50, tableTop + 20)
         .stroke();

      // Add order items
      let currentY = tableTop + 30;
      orderDetails.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        doc.text(item.name, itemX, currentY);
        doc.text(item.quantity.toString(), qtyX, currentY);
        doc.text(` ${item.price}`, priceX, currentY);  // Using single quote for rupee
        doc.text(` ${itemTotal}`, totalX, currentY);   // Using single quote for rupee
        
        currentY += 20;
      });

      // Add horizontal line above totals
      currentY += 10;
      doc.moveTo(priceX - 50, currentY)
         .lineTo(totalX + 50, currentY)
         .stroke();

      // Add subtotal and total aligned with price and total columns
      currentY += 20;
      doc.text('Subtotal:', priceX - 50, currentY);
      doc.text(` ${orderDetails.amount / 100}`, totalX, currentY);
      
      currentY += 20;
      doc.font('Helvetica-Bold');
      doc.text('Total Amount Paid:', priceX - 50, currentY);
      doc.text(`${orderDetails.amount / 100}`, totalX, currentY);
      doc.font('Helvetica');

      // Improved footer with proper spacing and alignment
      const pageHeight = doc.page.height;
      const footerTop = pageHeight - 100;

      // Add a line above footer
      doc.moveTo(50, footerTop - 10)
         .lineTo(550, footerTop - 10)
         .stroke();

      // Footer text with more spacing
      doc.fontSize(10);
      
      // Thank you message
      doc.text('Thank you for your purchase!', {
        align: 'center',
        width: doc.page.width,
        lineGap: 5
      });

      // Contact information
      doc.moveDown(2);
      doc.text('For any queries, please contact', {
        align: 'center',
        width: doc.page.width,
        lineGap: 5
      });

      doc.text('support@yourstore.com', {
        align: 'center',
        width: doc.page.width
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
export const sendOrderConfirmation = async (orderDetails) => {
  try {
    validateOrderDetails(orderDetails);
    
    const transporter = createTransporter();
    const receipt = await generateReceiptPDF(orderDetails);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: orderDetails.userDetails.email,
      subject: `Order Confirmation - Order #${orderDetails.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for your order!</h2>
          <p>Dear ${orderDetails.userDetails.name},</p>
          <p>Your order has been successfully placed and payment has been received.</p>
          
          <h3>Order Details:</h3>
          <p>Order ID: ${orderDetails.orderId}</p>
          <p>Payment ID: ${orderDetails.paymentId}</p>
          <p>Amount Paid: ₹${orderDetails.amount / 100}</p>
          
          <h3>Shipping Address:</h3>
          <p>${orderDetails.userDetails.address}</p>
          <p>${orderDetails.userDetails.city}, ${orderDetails.userDetails.state}</p>
          <p>Pincode: ${orderDetails.userDetails.pincode}</p>
          
          <h3>Order Summary:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
            ${orderDetails.items.map(item => `
              <tr>
                <td style="padding: 10px; border-top: 1px solid #dee2e6;">${item.name}</td>
                <td style="padding: 10px; border-top: 1px solid #dee2e6; text-align: right;">${item.quantity}</td>
                <td style="padding: 10px; border-top: 1px solid #dee2e6; text-align: right;">₹${item.price}</td>
              </tr>
            `).join('')}
          </table>
          
          <p style="text-align: right; margin-top: 20px;"><strong>Total: ₹${orderDetails.amount / 100}</strong></p>
          
          <p style="margin-top: 30px;">A PDF receipt is attached to this email for your records.</p>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa;">
            <p style="margin: 0;">If you have any questions about your order, please contact our customer service:</p>
            <p style="margin: 5px 0;">Email: support@yourstore.com</p>
            <p style="margin: 5px 0;">Phone: +1234567890</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `receipt-${orderDetails.orderId}.pdf`,
          content: receipt,
          contentType: 'application/pdf'
        }
      ]
    };

    return transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Failed to send order confirmation: ${error.message}`);
  }
};