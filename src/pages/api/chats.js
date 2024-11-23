import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Valid User ID is required" });
    }

    const query = `
      SELECT * 
      FROM chat 
      WHERE sender_id = ? OR receiver_id = ? 
      ORDER BY timestamp ASC
    `;

    db.query(query, [userId, userId], (error, results) => {
      if (error) {
        console.error("Error fetching chats:", error);
        return res.status(500).json({ error: "Failed to fetch chats" });
      }
      res.status(200).json(results);
    });
  } else if (req.method === "POST") {
    const { message, sender_id, sender_name, receiver_id, receiver_name, timestamp } = req.body;

    if (!message || !sender_id || !sender_name || !receiver_id || !receiver_name || !timestamp) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query = `
      INSERT INTO chat (message, sender_id, sender_name, receiver_id, receiver_name, timestamp) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [message, sender_id, sender_name, receiver_id, receiver_name, timestamp],
      (error, result) => {
        if (error) {
          console.error("Error adding chat message:", error);
          return res.status(500).json({ error: "Failed to add chat message" });
        }
        res.status(201).json({
          success: "Chat message added successfully",
          chatId: result.insertId,
          chat: { message, sender_id, sender_name, receiver_id, receiver_name, timestamp },
        });
      }
    );
  } else if (req.method === "DELETE") {
    const { chatId } = req.body;

    if (!chatId || isNaN(chatId)) {
      return res.status(400).json({ error: "Valid Chat ID is required" });
    }

    const query = "DELETE FROM chat WHERE chid = ?";

    db.query(query, [chatId], (error, result) => {
      if (error) {
        console.error("Error deleting chat:", error);
        return res.status(500).json({ error: "Failed to delete chat" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.status(200).json({ success: "Chat deleted successfully" });
    });
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}