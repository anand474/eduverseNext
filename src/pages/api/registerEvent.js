import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, eid } = req.body;

    const checkQuery = `
      SELECT COUNT(*) AS count FROM userevents
      WHERE eid = ? AND uid = ?
    `;
    const checkValues = [eid, userId];

    db.query(checkQuery, checkValues, (checkError, checkResults) => {
      if (checkError) {
        console.error("Error checking userevent existence:", checkError);
        return res.status(500).json({ error: "Failed to check userevent" });
      }

      const exists = checkResults[0].count > 0;

      if (exists) {
        return res.status(200).json({
            success: "UserEvent created successfully",
          });
      } else {
        const insertQuery = `
          INSERT INTO userevents (eid, uid)
          VALUES (?, ?)
        `;
        const insertValues = [eid, userId];

        db.query(insertQuery, insertValues, (insertError, insertResults) => {
          if (insertError) {
            console.error("Error inserting userevent:", insertError);
            return res.status(500).json({ error: "Failed to create userevent" });
          }
          return res.status(200).json({
            success: "UserEvent created successfully",
          });
        });
      }
    });
   } else if (req.method === "GET") {
    const { userId } = req.query;
    console.log("user query ",userId)

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    try {
      const query = `
        SELECT emailId FROM users WHERE uid = ?
      `;
      db.query(query, [userId], (error, results) => {
        if (error) {
          console.error("Error fetching user email:", error);
          return res.status(500).json({ error: "Failed to fetch user email" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        const userEmail = results[0].emailId;
        return res.status(200).json({ emailId: userEmail });
      });
    } catch (error) {
      console.error("Error in database query:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }  
  else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
