import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { mentorId } = req.body;
    console.log("Mentorid ,",mentorId)

    if (!mentorId) {
      return res.status(400).json({ error: "Mentor ID is required" });
    }

    try {
      const query = `
        SELECT 
          u.fullName,
          r.studentId, 
          r.emailId, 
          r.phoneNo, 
          r.reason 
        FROM 
          mentorship_requests r,users u
        WHERE 
          r.mentorId = ?
        AND
          r.isAccepted = ?
        AND
         u.uid=r.studentId
      `;
      const mentees = await new Promise((resolve, reject) => {
        db.query(query, [mentorId,1], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      res.status(200).json(mentees);
    } catch (error) {
      console.error("Error fetching mentees:", error);
      res.status(500).json({ error: "Failed to fetch mentees" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
