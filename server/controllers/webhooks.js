import { Webhook } from "svix";
import User from "../models/User.js";

// api controller function to manage Clerk User with database.
export const clerkWebhooks = async (req, res) => {
    try {
        const webhooks = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await webhooks.verify(req.body, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const payload = JSON.parse(req.body.toString());
        const { data, type } = payload;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0]?.email_address,
                    name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
                    imageUrl: data.image_url,
                };
                await User.create(userData);
                return res.json({ success: true });
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0]?.email_address,
                    name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
                    imageUrl: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData);
                return res.json({ success: true });
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true });
            }

            default:
                break;
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};