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
    } else
        if (req.method === "PUT") {
            console.log("PUT", req);
            const { userId, role } = req.body;

            if (!userId || !role) {
                return res.status(400).json({ error: "User ID and role are required" });
            }

            try {
                const query = "UPDATE users SET type = ? WHERE uid = ?";
                db.query(query, [role, userId], (error, results) => {
                    if (error) {
                        return res.status(500).json({ error: "Database error" });
                    }

                    if (results.affectedRows === 0) {
                        return res.status(404).json({ error: "User not found" });
                    }

                    res.status(200).json({ message: "User role updated successfully" });
                });
            } catch (err) {
                res.status(500).json({ error: "An error occurred. Please try again." });
            }
        } else {
            res.setHeader("Allow", ["GET", "PUT"]);
            return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
}