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

/* ======================
   ROUTES
====================== */
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>API Status</title>
            <style>
                body {
                    margin: 0;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #000;
                    color: #fff;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                }
                h1 {
                    font-size: 2rem;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h1>🥤 Red Bull fully loaded! <br />API is flying 🚀</h1>
        </body>
        </html>
    `);
});

app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🥤 Red Bull consumed. Server may respond faster than intended on port ${PORT} 🚀`);
});