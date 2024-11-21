import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const query = "SELECT * FROM notifications WHERE uId = ? and isRead=? ORDER BY nId DESC";
    db.query(query, [userId,0], (error, results) => {
      if (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ error: "Failed to fetch notifications" });
      }
      res.status(200).json(results);
    });
  } else if (req.method === "PUT") {
    const { nId } = req.body;

    if (!nId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }

    const query = "UPDATE notifications SET isRead = 1 WHERE nId = ?";
    db.query(query, [nId], (error) => {
      if (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({ error: "Failed to mark notification as read" });
      }
      res.status(200).json({ success: "Notification marked as read" });
    });
  } else if (req.method === "DELETE") {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const query = "DELETE FROM notifications WHERE uId = ?";
    db.query(query, [userId], (error) => {
      if (error) {
        console.error("Error clearing notifications:", error);
        return res.status(500).json({ error: "Failed to clear notifications" });
      }
      res.status(200).json({ success: "All notifications cleared" });
    });
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
