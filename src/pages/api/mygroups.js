import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    let query = `
      SELECT gid, gname AS name, groupdescription AS description, academic_interests AS academicInterest, created_uid AS createdUid, users_list AS members
      FROM groups
      WHERE FIND_IN_SET('25', users_list) > 0;
    `;
    if (req.query.excludeUserGroups === "true") {
      query = `
        SELECT gid, gname AS name, groupdescription AS description, academic_interests AS academicInterest, created_uid AS createdUid, users_list AS members 
        FROM groups 
        WHERE (users_list IS NULL OR users_list = '' OR NOT JSON_CONTAINS(users_list, JSON_QUOTE(?)))
      `;
    }

    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ error: "Failed to fetch groups" });
      } else {
        res.status(200).json({ groups: results });
      }
    });
  } else if (req.method === "PUT") {
    const { userId, groupId } = req.body;
    console.log(userId, groupId);

    if (!userId || !groupId) {
      return res.status(400).json({ error: "User ID and Group ID are required" });
    }

    db.query(
      `UPDATE groups
      SET users_list = CASE
          WHEN users_list = '' OR users_list IS NULL THEN ?
          ELSE CONCAT(users_list, ',', ?)
      END
      WHERE gid = ?`,
      [userId, userId, groupId],
      (error, results) => {
        if (error) {
          console.error("Error updating group:", error);
          res.status(500).json({ error: "Failed to update group" });
        } else {
          res.status(200).json({ success: true });
        }
      }
    );
  }
  else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
