import db from "@/data/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { fullName, email, password, phoneNumber, type, academicInterests, researchInterests, adminId } = req.body;

  if (!fullName || !email || !password || !phoneNumber) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const checkEmailQuery = "SELECT * FROM users WHERE emailId = ?";
    db.query(checkEmailQuery, [email], async (error, results) => {
      if (error) {
        return res.status(500).json({ error: error });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users (fullName, emailId, password, phoneNo, type, academic_interests, research_interests)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [fullName, email, hashedPassword, phoneNumber, type, academicInterests || null, researchInterests || null];

      db.query(query, values, (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Failed to register user" });
        }

        const userId = results.insertId;
        const preferencesQuery = `
          INSERT INTO preferences (uid, isLightTheme, enableEmail)
          VALUES (?, ?, ?)
        `;
        const preferencesValues = [userId, 0, 1];

        db.query(preferencesQuery, preferencesValues, (preferencesError) => {
          if (preferencesError) {
            return res.status(500).json({ error: "Failed to set user preferences" });
          }

          res.status(200).json({ success: `User registered successfully with UserID: ${userId}` });
        });
      });

      const notificationQuery = `
    INSERT INTO notifications (uid, message, isRead)
    VALUES (?, ?, 0)
  `;
      const notificationValues = [adminId, "New User Registered , Please assign role!"];

  db.query(notificationQuery, notificationValues, (notifError) => {
    if (notifError) {
      return res.status(500).json({ error: "Failed to create notification" });
    }
    return res.status(200).json({ message: "User registered and notification created successfully" });
  });
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}