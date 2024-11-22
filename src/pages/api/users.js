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

        console.log("PUT started", userId ,updates);

        if (!userId || !updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "User ID and updates are required" });
        }

        const allowedFields = [
            "fullName", "emailId", "password", "phoneNo", "type",
            "academic_interests", "research_interests"
        ];

        console.log("32");

        const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(", ")}` });
        }

        console.log("37");

        try {
            console.log("INTO try");

            if (updates.password) {
                const hashedPassword = await bcrypt.hash(updates.password, 10);
                updates.password = hashedPassword;
            }

            console.log("hashed pwd", updates.password);

            const fields = Object.keys(updates);
            const values = Object.values(updates);

            console.log(fields, values);

            let query = "UPDATE users SET ";
            query += fields.map(field => `${field} = ?`).join(", ");
            query += " WHERE uid = ?";

            console.log("query", query);

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
    } else {
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}