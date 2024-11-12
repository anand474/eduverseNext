import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const results = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM USERS", (err, results) => {
          if (err) {
            reject(err);  // Reject on error
          } else {
            resolve(results);  // Resolve with the results
          }
        });
      });

      console.log(results);  // Log results for debugging
      return res.status(200).json(results);  // Return the results as JSON
    } catch (error) {
      console.error(error);  // Log error for debugging
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  } else {
    // Method Not Allowed
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}