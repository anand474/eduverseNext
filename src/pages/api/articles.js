import db from "@/data/db";

export default async function handler(req, res) {
  const { action } = req.body;

  if (req.method === "POST") {
    if (action === "createArticle") {
      const { aname, description, postedBy, posted_date, article_link, uid } = req.body;

      if (!aname || !description || !postedBy || !posted_date || !uid) {
        return res.status(400).json({ error: "All fields are required except article_link" });
      }

      const query = `
        INSERT INTO articles (aname, description, posted_date, postedBy, article_link, uid)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [aname, description, posted_date, postedBy, article_link || null, uid];

      db.query(query, values, (error, results) => {
        if (error) {
          console.error("Error inserting article:", error);
          return res.status(500).json({ error: "Failed to create article" });
        }
        return res.status(200).json({
          success: "Article created successfully",
          id: results.insertId,
        });
      });
    } else if (action === "fetchArticles") {
      const { uid, urole } = req.body;
      const query =
      urole !== "Student"
        ? "SELECT * FROM articles WHERE uid = ?"
        : "SELECT * FROM articles";

    db.query(query, [uid], (error, results) => {
      if (error) {
        console.error("Error fetching articles:", error);
        return res.status(500).json({ error: "Failed to fetch articles" });
      }
      return res.status(200).json(results);
    });
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Article ID is required" });
    }

    const query = "DELETE FROM articles WHERE aid = ?";
    db.query(query, [id], (error) => {
      if (error) {
        console.error("Error deleting article:", error);
        return res.status(500).json({ error: "Failed to delete article" });
      }
      return res.status(200).json({ success: "Article deleted successfully" });
    });
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
