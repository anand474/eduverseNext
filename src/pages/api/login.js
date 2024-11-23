import db from "@/data/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const queryUser = "SELECT * FROM users WHERE emailId = ?";
    
    db.query(queryUser, [email], async (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const queryPreferences = "SELECT isLightTheme, enableEmail FROM preferences WHERE uid = ?";
      
      db.query(queryPreferences, [user.uid], (prefError, prefResults) => {
        if (prefError) {
          return res.status(500).json({ error: "Error fetching preferences" });
        }

        if (prefResults.length === 0) {
          return res.status(404).json({ error: "Preferences not found for this user" });
        }

        const preferences = prefResults[0];

        res.status(200).json({
          userId: user.uid,
          userRole: user.type,
          name: user.fullName,
          isLightTheme: preferences.isLightTheme,
          enableEmail: preferences.enableEmail,
        });
      });
    });
  } catch (err) {
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
}
