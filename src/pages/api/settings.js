import db from "@/data/db"; 

export default async function handler(req, res) {
  const { action, theme, userId } = req.body;

  if (action === "updateTheme" && userId && theme !== undefined) {
    const query = "UPDATE preferences SET isLightTheme = ? WHERE uid = ?";
    
    db.query(query, [theme, userId], (error, results) => {
      if (error) {
        console.error("Error updating theme:", error);
        return res.status(500).json({ error: "Failed to update theme" });
      }
      
      return res.status(200).json({ success: "Theme updated successfully" });
    });
  } else if (action === "updateEmail" && userId !== undefined) {
    const query = "UPDATE preferences SET enableEmail = ? WHERE uid = ?";
    console.log(theme);
    db.query(query, [theme, userId], (error, results) => {
      if (error) {
        console.error("Error updating email preference:", error);
        return res.status(500).json({ error: "Failed to update email preference" });
      }
      
      return res.status(200).json({ success: "Email preference updated successfully" });
    });
  } else if (action === "getTheme" && userId) {
    const query = "SELECT isLightTheme,enableEmail FROM preferences WHERE uid = ?";
    
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error("Error fetching theme:", error);
        return res.status(500).json({ error: "Failed to fetch theme" });
      }
      
      if (results.length > 0) {
        return res.status(200).json({ theme: results[0] });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    });
  } else {
    return res.status(400).json({ error: "Invalid parameters" });
  }
}
