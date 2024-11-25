import db from "@/data/db";

export default async function handler(req, res) {
    const { action } = req.body;

    if (req.method === "POST") {
        if (action === "addGroupChat") {
            const { gid, uid, uname, content } = req.body;

            if (!gid || !uid || !uname || !content) {
                return res.status(400).json({ error: "Group ID, User ID, User Name, and content are required" });
            }

            const addChatQuery = `
        INSERT INTO groupchat (gid, uid, uname, content, timestamp)
        VALUES (?, ?, ?, ?, NOW())
      `;

            db.query(addChatQuery, [gid, uid, uname, content], (err, results) => {
                if (err) {
                    console.error("Error adding chat message:", err);
                    return res.status(500).json({ error: "Failed to add chat message" });
                }

                return res.status(201).json({
                    message: "Chat message added successfully",
                    chat: {
                        gcid: results.insertId,
                        gid,
                        uid,
                        uname,
                        content,
                        timestamp: new Date().toISOString().slice(0, -1) + "-6:00"
                    },
                });
            });
        } else if (action === "fetchGroupChats") {
            const { gid } = req.body;

            if (!gid) {
                return res.status(400).json({ error: "Group ID is required" });
            }

            const fetchChatsQuery = `
        SELECT gcid, gid, uid, uname, content, timestamp
        FROM groupchat
        WHERE gid = ?
        ORDER BY timestamp ASC
      `;

            db.query(fetchChatsQuery, [gid], (err, results) => {
                if (err) {
                    console.error("Error fetching chat messages:", err);
                    return res.status(500).json({ error: "Failed to fetch chat messages" });
                }

                return res.status(200).json({
                    message: "Chat messages retrieved successfully",
                    chats: results,
                });
            });
        } else {
            return res.status(400).json({ error: "Invalid action" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}