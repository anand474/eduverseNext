import db from "@/data/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const { userRole, userId } = req.query;
    let query = "SELECT * FROM opportunities";
    let queryParams = [];

    if (userRole !== "Student" && userRole !== "Mentor") {
      query += " WHERE uid = ?";
      queryParams.push(userId);
    }
    db.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("Error fetching tips:", error);
        return res.status(500).json({ error: "Failed to fetch tips" });
      }
      return res.status(200).json(results);
    });
  } else if (req.method === "POST") {
    const { oname, company, description, location, link, type, uid } = req.body;

    if (!oname || !company || !description || !location || !link || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query = `
      INSERT INTO opportunities (oname, company, description, location, link, type, uid)
      VALUES (?, ?, ?, ?, ?, ?,?)
    `;
    const values = [
      oname,
      company,
      description,
      location,
      link,
      type,
      uid || null,
    ];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Failed to create opportunity" });
      } else {
        res.status(200).json({
          success: "Opportunity created successfully",
          id: results.insertId,
        });
      }
    });
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Opportunity ID is required" });
    }

    const query = "DELETE FROM opportunities WHERE oid = ?";
    db.query(query, [id], (error) => {
      if (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Failed to delete opportunity" });
      } else {
        res.status(200).json({ success: "Opportunity deleted successfully" });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
