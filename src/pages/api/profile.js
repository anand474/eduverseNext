
import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const query = `
        SELECT 
          u.fullName,
          u.emailId,
          u.type,
          u.academic_interests,
          u.research_interests,
          u.phoneNo
        FROM 
          users u
        WHERE 
          u.uid = ?;`
      ;

      const user = await new Promise((resolve, reject) => {
        db.query(query, [userId], (error, results) => {
          if (error) return reject(error);
          resolve(results[0]);
        });
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  } else if (req.method === "PUT") {
    
    const {userId, user_name, email, academic_interests, research_interests, phone_number} = req.body;
    console.log('user is,',user_name);
    if (!userId || !user_name || !email || !academic_interests || !research_interests || !phone_number) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const query = `
        UPDATE users
        SET
          fullName = ?,
          emailId = ?,
          academic_interests = ?,
          research_interests = ?,
          phoneNo = ?
        WHERE uid = ?;`
      ;

      await new Promise((resolve, reject) => {
        db.query(
          query,
          [user_name, email, academic_interests, research_interests, phone_number, userId],
          (error, results) => {
            if (error) return reject(error);
            resolve(results);
          }
        );
      });

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating user data:", error);
      res.status(500).json({ error: "Failed to update user data" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}