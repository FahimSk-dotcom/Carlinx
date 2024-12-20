import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, subject, message } = req.body;

        try {
            await client.connect();
            const db = client.db(process.env.DB_NAME);
            const usercollection = db.collection('Contactus');
            const result = await usercollection.insertOne({
                name,
                email,
                subject,
                message,
            });
            res.status(201).json({ message: "Message submitted successfully", user: result });
        } catch (error) {
            res.status(500).json({ message: 'Database connection error', error: error.message });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
