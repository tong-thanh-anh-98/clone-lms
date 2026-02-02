import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './configs/mongodb.js';
import connectCloudinary from './configs/cloudinary.js';

import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import { clerkMiddleware } from '@clerk/express';

import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

// initialize express
const app = express();

/* ======================
   CONNECT SERVICES
====================== */
await connectDB();
await connectCloudinary();

/* ======================
   WEBHOOK (RAW BODY)
====================== */
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// route
// app.get('/', (req, res) => res.send('API Working!'));
// app.post('/clerk', express.json(), clerkWebhooks);
// app.use('/api/educator', express.json(), educatorRouter);
// app.use('/api/course', express.json(), courseRouter);
// app.use('/api/user', express.json(), userRouter);
// app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

/* ======================
   ROUTES
====================== */
app.get('/', (req, res) => res.send('🥤Red Bull fully loaded! API is flying 🚀'));
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
    console.log(`🥤 Red Bull consumed. Server may respond faster than intended on port ${PORT} 🚀`);
});