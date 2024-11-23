import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { action } = req.body;

    if (action === "getGroups") {
      const query = "SELECT * FROM groups";

      db.query(query, (error, results) => {
        if (error) {
          console.error("Error fetching groups:", error);
          return res.status(500).json({ error: "Failed to fetch groups" });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "No groups found" });
        }
        return res.status(200).json(results);
      });
    }
  else if (action === "deleteGroup" ) {
    const {groupId} = req.body;
    const query = "DELETE FROM groups WHERE gid = ?";
    db.query(query, [groupId], (error, results) => {
      if (error) {
        console.error("Error deleting group:", error);
        return res.status(500).json({ error: "Failed to delete group" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Group not found" });
      }

      return res.status(200).json({ success: "Group deleted successfully" });
    });
  
}else  if (action === "getForums") {
    const query = "SELECT * FROM forums";

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching forums:", error);
        return res.status(500).json({ error: "Failed to fetch forums" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "No forums found" });
      }
      return res.status(200).json(results);
    });
  }
else if (action === "deleteForum" ) {
    const {fid} = req.body;
    const query = "DELETE FROM forums WHERE fid = ?";
    db.query(query, [fid], (error, results) => {
      if (error) {
        console.error("Error deleting group:", error);
        return res.status(500).json({ error: "Failed to delete forum" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Forum not found" });
      }

      return res.status(200).json({ success: "Forum deleted successfully" });
    });
  
}  else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
}
