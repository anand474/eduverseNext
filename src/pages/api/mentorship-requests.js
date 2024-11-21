import db from "@/data/db";

export default async function handler(req, res) {
    if (req.method === "POST") {
      
      const { studentId, mentorId, emailId, phoneNo, reason } = req.body;
  
      if (!studentId || !mentorId || !emailId || !phoneNo || !reason) {
        return res
          .status(400)
          .json({ error: "All fields are required except 'isAccepted'" });
      }
  
      const type = "Mentor";
      const mentorQuery = "SELECT uid FROM users WHERE fullName = ? and type=?";
      const [mentorResult] = await new Promise((resolve, reject) => {
        db.query(mentorQuery, [mentorId, type], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      
  
      if (!mentorResult) {
        return res.status(404).json({ error: "Mentor not found" });
      }
  
      const mentor = mentorResult.uid;
  
      const query = `
        INSERT INTO mentorship_requests (studentId, mentorId, emailId, phoneNo, reason, isAccepted)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [studentId, mentor, emailId, phoneNo, reason, 0];

      const notificationMessage = `New mentee request received.`;
      const notificationQuery = `
        INSERT INTO notifications (uId, message, isRead)
        VALUES (?, ?, ?)
      `;
      const notificationValues = [mentor, notificationMessage, 0];

      await new Promise((resolve, reject) => {
        db.query(notificationQuery, notificationValues, (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });
  
      db.query(query, values, (error, results) => {
        if (error) {
          console.error("Error creating mentorship request:", error);
          return res.status(500).json({ error: "Failed to create request" });
        }
        return res.status(200).json({
          success: "Mentorship request created successfully",
          id: results.insertId,
        });
      });
    }
    else if (req.method === "GET") {
        const { mentorId } = req.query;
        console.log("User id is :",mentorId)
        if (!mentorId) {
          return res.status(400).json({ error: "Mentor ID is required" });
        }
      const query = `
        SELECT 
          r.studentId, 
          r.mentorId,
          s.fullName AS studentName, 
          r.emailId AS studentEmail, 
          r.phoneNo AS studentPhone, 
          m.fullName AS mentorName, 
          r.reason
        FROM 
          mentorship_requests r
        JOIN 
          users s ON r.studentId = s.uid
        JOIN 
          users m ON r.mentorId = m.uid
        WHERE 
          r.mentorId = ? 
        AND
          r.isAccepted=?;
      `;
  
      try {
        const requests = await new Promise((resolve, reject) => {
          db.query(query, [mentorId,0], (error, results) => {
            if (error) return reject(error);
            resolve(results);
          });
        });
  
        res.status(200).json(requests);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch mentorship requests" });
      }
    }
    else if (req.method === "PUT") {
      const { id,isAccepted,mId } = req.body;
  
      if (isAccepted === undefined) {
        return res.status(400).json({ error: "isAccepted field is required" });
      }
      const query = `
        UPDATE mentorship_requests
        SET isAccepted = ?
        WHERE studentId = ?
        and mentorId = ?
      `;
      
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(query, [isAccepted, id,mId], (error, results) => {
            if (error) return reject(error);
            resolve(results);
          });
        });
        const notificationMessage = `Your mentee request is accepted.`;
      const notificationQuery = `
        INSERT INTO notifications (uId, message, isRead)
        VALUES (?, ?, ?)
      `;
      const notificationValues = [id, notificationMessage, 0];

      await new Promise((resolve, reject) => {
        db.query(notificationQuery, notificationValues, (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Request not found" });
        }
  
        res.status(200).json({ success: "Request accepted" });
      } catch (error) {
        console.error("Error updating request status:", error);
        res.status(500).json({ error: "Failed to accept request" });
      }
    }
    else if (req.method === "DELETE") {
        const { id,mId } = req.body;
  
      const query = `
        DELETE FROM mentorship_requests
        WHERE studentId = ? and mentorId =?
      `;
      
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(query, [id,mId], (error, results) => {
            if (error) return reject(error);
            resolve(results);
          });
        });
        const notificationMessage = `Your mentee request is rejected.`;
      const notificationQuery = `
        INSERT INTO notifications (uId, message, isRead)
        VALUES (?, ?, ?)
      `;
      const notificationValues = [id, notificationMessage, 0];

      await new Promise((resolve, reject) => {
        db.query(notificationQuery, notificationValues, (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Request not found" });
        }
  
        res.status(200).json({ success: "Request deleted" });
      } catch (error) {
        console.error("Error deleting request:", error);
        res.status(500).json({ error: "Failed to delete request" });
      }
    }
    else {
      res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  