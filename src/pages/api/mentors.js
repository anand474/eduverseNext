import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const type = "Mentor";
    const query = "SELECT fullName FROM users WHERE type = ?";

    try {
      const mentors = await new Promise((resolve, reject) => {
        db.query(query, [type], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      res.status(200).json(mentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ error: "Failed to fetch mentors" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
