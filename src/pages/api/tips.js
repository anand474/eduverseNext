import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, tip_content, posted_date, postedBy, uid_created } = req.body;

    if (!title || !tip_content || !posted_date || !postedBy || !uid_created) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query = `
      INSERT INTO tips (title, tip_content, posted_date, postedBy, uid_created)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [title, tip_content, posted_date, postedBy, uid_created];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error("Error inserting tip:", error);
        return res.status(500).json({ error: "Failed to create tip" });
      }
      return res
        .status(200)
        .json({ success: "Tip created successfully", id: results.insertId });
    });
  } else if (req.method === "GET") {
    db.query("SELECT * FROM tips", (error, results) => {
      if (error) {
        console.error("Error fetching tips:", error);
        return res.status(500).json({ error: "Failed to fetch tips" });
      }
      return res.status(200).json(results);
    });
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Tip ID is required" });
    }

    const query = "DELETE FROM tips WHERE tid = ?";
    db.query(query, [id], (error) => {
      if (error) {
        console.error("Error deleting tip:", error);
        return res.status(500).json({ error: "Failed to delete tip" });
      }
      return res.status(200).json({ success: "Tip deleted successfully" });
    });
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
