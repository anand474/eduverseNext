import db from "@/data/db";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { userId } = req.query;
        console.log("user query ",userId)
    
        if (!userId) {
          return res.status(400).json({ error: "userId is required" });
        }
    
        try {
          const query = `
            SELECT enableEmail FROM preferences WHERE uid = ?
          `;
          db.query(query, [userId], (error, results) => {
            if (error) {
              console.error("Error fetching user email:", error);
              return res.status(500).json({ error: "Failed to fetch user email" });
            }
            
    
            if (results.length === 0) {
              return res.status(404).json({ error: "User not found" });
            }
    
            const userEmail = results[0].enableEmail;
            return res.status(200).json({ emailId: userEmail });
          });
        } catch (error) {
          console.error("Error in database query:", error);
          return res.status(500).json({ error: "Server error" });
        }
      }  
    else {
        res.setHeader("Allow", ["POST", "GET", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
}