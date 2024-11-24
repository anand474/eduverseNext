import bcrypt from 'bcryptjs';
import db from "@/data/db";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const query = "SELECT * FROM users";
            db.query(query, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Database error" });
                }
                res.status(200).json(results);
            });
        } catch (err) {
            res.status(500).json({ error: "An error occurred. Please try again." });
        }
    } else if (req.method === "PUT") {

        const { userId, updates } = req.body;

        if (!userId || !updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "User ID and updates are required" });
        }

        const allowedFields = [
            "fullName", "emailId", "password", "phoneNo", "type",
            "academic_interests", "research_interests"
        ];

        const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(", ")}` });
        }

        try {
            if (updates.password) {
                const hashedPassword = await bcrypt.hash(updates.password, 10);
                updates.password = hashedPassword;
            }

            const fields = Object.keys(updates);
            const values = Object.values(updates);
            let query = "UPDATE users SET ";
            query += fields.map(field => `${field} = ?`).join(", ");
            query += " WHERE uid = ?";
            db.query(query, [...values, userId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Database error" });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: "User not found" });
                }

                res.status(200).json({ message: "Profile updated successfully" });
            });
        } catch (err) {
            res.status(500).json({ error: "An error occurred. Please try again." });
        }
    } else if (req.method === "DELETE") {
        const { userId } = req.query;

        console.log("========================================================================DELETE", userId);

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        try {
            const query = "DELETE FROM users WHERE uid = ?";
            db.query(query, [userId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Database error" });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: "User not found" });
                }

                res.status(200).json({ message: "User deleted successfully" });
            });
        } catch (err) {
            res.status(500).json({ error: "An error occurred. Please try again." });
        }
    } else {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}