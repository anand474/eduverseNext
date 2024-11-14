import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ename, place, date, start_time, end_time, description, uid, link } =
      req.body;

    if (
      !ename ||
      !place ||
      !date ||
      !start_time ||
      !end_time ||
      !description ||
      !uid
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required except link" });
    }

    const query = `
      INSERT INTO events (ename, place, date, start_time, end_time, description, uid, link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      ename,
      place,
      date,
      start_time,
      end_time,
      description,
      uid,
      link || null,
    ];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error("Error inserting event:", error);
        return res.status(500).json({ error: "Failed to create event" });
      }
      return res
        .status(200)
        .json({ success: "Event created successfully", id: results.insertId });
    });
  } else if (req.method === "GET") {
    db.query("SELECT * FROM events", (error, results) => {
      if (error) {
        console.error("Error fetching events:", error);
        return res.status(500).json({ error: "Failed to fetch events" });
      }
      return res.status(200).json(results);
    });
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const query = "DELETE FROM events WHERE eid = ?";
    db.query(query, [id], (error) => {
      if (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ error: "Failed to delete event" });
      }
      return res.status(200).json({ success: "Event deleted successfully" });
    });
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
