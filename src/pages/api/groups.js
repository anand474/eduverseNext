import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, description, academicInterest, createdUid, members } = req.body;

    if (!name || !description || !academicInterest || !createdUid || !members) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query = `
      INSERT INTO groups (gname, groupdescription, academic_interests, created_uid, users_list)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [name, description, academicInterest, createdUid, JSON.stringify(members)];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error("Error inserting group:", error);
        res.status(500).json({ error: "Failed to create group" });
      } else {
        const newGroup = {
          id: results.insertId,
          name,
          description,
          academicInterest,
          createdUid,
          members,
        };
        res.status(200).json({ success: "Group created successfully", newGroup });
      }
    });
  } else if (req.method === "GET") {
    const { academicInterest } = req.query;

    if (!academicInterest) {
      return res.status(400).json({ error: "Academic interest is required" });
    }

    const query = `
      SELECT uid, fullName
      FROM users
      WHERE academic_interests LIKE CONCAT('%', ?, '%')
    `;

    db.query(query, [academicInterest], (error, results) => {
      if (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
      } else {
        console.log(results);
        res.status(200).json({ users: results });
      }
    });
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
