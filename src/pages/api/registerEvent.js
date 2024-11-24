import db from "@/data/db";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { userId, eid } = req.body;
      
        const checkQuery = `
          SELECT COUNT(*) AS count FROM userevents
          WHERE eid = ? AND uid = ?
        `;
        const checkValues = [eid, userId];
      
        db.query(checkQuery, checkValues, (checkError, checkResults) => {
          if (checkError) {
            console.error("Error checking userevent existence:", checkError);
            return res.status(500).json({ error: "Failed to check userevent" });
          }
      
          const exists = checkResults[0].count > 0;
      
          if (exists) {
            return res.status(200).json({
              success: "UserEvent already exists",
            });
          } else {
            const eventQuery = `
              SELECT ename, date, start_time FROM events WHERE eid = ?
            `;
            db.query(eventQuery, [eid], (eventError, eventResults) => {
              if (eventError) {
                console.error("Error fetching event details:", eventError);
                return res.status(500).json({ error: "Failed to fetch event details" });
              }
      
              if (eventResults.length === 0) {
                return res.status(404).json({ error: "Event not found" });
              }
      
              const { ename, fdate, start_time } = eventResults[0];
              const date = new Date(fdate).toLocaleDateString("en-GB");
      
              const insertQuery = `
                INSERT INTO userevents (eid, uid)
                VALUES (?, ?)
              `;
              const insertValues = [eid, userId];
      
              db.query(insertQuery, insertValues, (insertError, insertResults) => {
                if (insertError) {
                  console.error("Error inserting userevent:", insertError);
                  return res.status(500).json({ error: "Failed to create userevent" });
                }
      
                const notificationMessage = `Successfully Registered to the event: ${ename}. See you at the Event!`;
      
                const notificationQuery = `
                  INSERT INTO notifications (uid, message, isRead)
                  VALUES (?, ?, 0)
                `;
                const notificationValues = [userId, notificationMessage];
      
                db.query(notificationQuery, notificationValues, (notifError) => {
                  if (notifError) {
                    console.error("Error creating notification:", notifError);
                    return res.status(500).json({ error: "Failed to create notification" });
                  }
      
                  return res.status(200).json({
                    success: "User registered and notification created successfully",
                  });
                });
              });
            });
          }
        });
      }
       else if (req.method === "GET") {
    const { userId } = req.query;
    console.log("user query ",userId)

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    try {
      const query = `
        SELECT emailId FROM users WHERE uid = ?
      `;
      db.query(query, [userId], (error, results) => {
        if (error) {
          console.error("Error fetching user email:", error);
          return res.status(500).json({ error: "Failed to fetch user email" });
        }
        

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        const userEmail = results[0].emailId;
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
