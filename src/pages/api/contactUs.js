import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, phone, email, message } = req.body;

    const name = `${firstName} ${lastName}`;

    if (!firstName || !lastName || !phone || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Construct SQL query to insert data into the `user_queries` table
    const query = `
      INSERT INTO user_queries (name, phoneNo, emailId, query)
      VALUES (?, ?, ?, ?)
    `;
    const values = [name, phone, email, message];

    // Execute the query
    db.query(query, values, (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Failed to submit query" });
      } else {
        res.status(200).json({ success: "Query submitted successfully" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
