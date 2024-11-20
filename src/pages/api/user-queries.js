import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const query = "SELECT * FROM user_queries";
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching user queries:", error);
        return res.status(500).json({ error: "Failed to fetch user queries" });
      }
      return res.status(200).json(results);
    });
  } else if (req.method === "POST") {
    const { id, replyMessage } = req.body;

    if (!id || !replyMessage) {
      return res.status(400).json({ error: "ID and reply message are required" });
    }

    const query = "UPDATE user_queries SET reply_message = ?, replied = 1 WHERE id = ?";
    db.query(query, [replyMessage, id], (error, results) => {
      if (error) {
        console.error("Error updating query reply:", error);
        return res.status(500).json({ error: "Failed to update reply" });
      }
      return res.status(200).json({ success: "Reply sent successfully" });
    });
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Query ID is required" });
    }

    const query = "DELETE FROM user_queries WHERE qId = ?";
    db.query(query, [id], (error) => {
      if (error) {
        console.error("Error deleting query:", error);
        return res.status(500).json({ error: "Failed to delete query" });
      }
      return res.status(200).json({ success: "Query deleted successfully" });
    });
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
