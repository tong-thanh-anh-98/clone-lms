import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';

import connectDB from './configs/mongodb.js';
import connectCloudinary from './configs/cloudinary.js';

import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';

import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

// initialize express
const app = express();

const PORT = 5000;

await connectDB();

await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Stripe Webhook
app.post(
   '/stripe',
   express.raw({ type: 'application/json' }),
   stripeWebhooks
);

app.get('/', (req, res) => res.send('The API is working!'));
app.post('/clerk', express.json(), clerkWebhooks);
app.use('/api/user', userRouter);
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);

app.listen(PORT, () => {
   console.log(`The server is currently running on port:${PORT}!`);
});