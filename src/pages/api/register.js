import db from "@/data/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { fullName, email, password, phoneNumber, type, academicInterests, researchInterests } = req.body;

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

        res.status(200).json({ success: ("User registered successfully with UserID: " + results.insertId) });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}