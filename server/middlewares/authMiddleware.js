import { clerkClient } from "@clerk/express";

// middleware (protect educator router)
export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }

        const user = await clerkClient.users.getUser(userId);

        if (user.publicMetadata.role !== 'educator') {
            return res.status(403).json({ success: false, message: 'Unauthorized Access.' });
        }

        next();

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
