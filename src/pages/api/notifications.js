import db from "@/data/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const query = "SELECT * FROM notifications WHERE uId = ? and isRead=? ORDER BY nId DESC";
    db.query(query, [userId, 0], (error, results) => {
      if (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ error: "Failed to fetch notifications" });
      }
      res.status(200).json(results);
    });
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); 
      const tomorrowDate = tomorrow.toISOString().split('T')[0]; 
  
      const eventQuery = `
        SELECT e.eid, e.ename, e.date, e.start_time, ue.uid 
        FROM events e
        JOIN userevents ue ON e.eid = ue.eid
        WHERE e.date = ?
      `;
  
      db.query(eventQuery, [tomorrowDate], (eventError, eventResults) => {
        if (eventError) {
          console.error("Error fetching tomorrow's events:", eventError);
          return res.status(500).json({ error: "Failed to fetch tomorrow's events" });
        }
  
        if (eventResults.length > 0) {
          eventResults.forEach(({ uid, ename, date, start_time }) => {
            const message = `You have an event "${ename}" tomorrow, on ${new Date(date).toLocaleDateString("en-GB")} at ${start_time}.`;
  
            const checkQuery = `
              SELECT * FROM notifications 
              WHERE uId = ? AND message = ? AND isRead = 0
            `;
            db.query(checkQuery, [uid, message], (checkError, checkResults) => {
              if (checkError) {
                console.error("Error checking existing notifications:", checkError);
                return;
              }
  
              if (checkResults.length === 0) {
                const notificationQuery = `
                  INSERT INTO notifications (uId, message, isRead)
                  VALUES (?, ?, ?)
                `;
                db.query(notificationQuery, [uid, message, 0], (notifError) => {
                  if (notifError) {
                    console.error("Error creating notification:", notifError);
                  }
                });
              } else {
                console.log("Notification already exists for user:", uid);
              }
            });
          });
  
          res.status(200).json({ success: "Notifications sent successfully for tomorrow's events" });
        } else {
          res.status(200).json({ success: "No events for tomorrow" });
        }
      });
    } catch (error) {
      console.error("Error sending notifications for tomorrow's events:", error);
      res.status(500).json({ error: "Server error while sending notifications for tomorrow's events" });
    }
  } else if (req.method === "PUT") {
    const { nId } = req.body;

    if (!nId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }

    const query = "UPDATE notifications SET isRead = 1 WHERE nId = ?";
    db.query(query, [nId], (error) => {
      if (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({ error: "Failed to mark notification as read" });
      }
      res.status(200).json({ success: "Notification marked as read" });
    });
  } else if (req.method === "DELETE") {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const query = "DELETE FROM notifications WHERE uId = ?";
    db.query(query, [userId], (error) => {
      if (error) {
        console.error("Error clearing notifications:", error);
        return res.status(500).json({ error: "Failed to clear notifications" });
      }
      res.status(200).json({ success: "All notifications cleared" });
    });
  } else if (req.method === "POST") {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "User ID and message are required" });
    }

    const query = "INSERT INTO notifications (uId, message, isRead) VALUES (?, ?, ?)";
    db.query(query, [userId, message, 0], (error) => {
      if (error) {
        console.error("Error inserting notification:", error);
        return res.status(500).json({ error: "Failed to insert notification" });
      }
      res.status(200).json({ success: "Notification sent successfully" });
    });
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}