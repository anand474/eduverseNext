import db from "@/data/db";

export default async function handler(req, res) {
    const { userId } = req.query;

    if (req.method === "GET") {
        let query = "SELECT * FROM resume_builder WHERE uId = ?";
        let queryParams = [userId];

        db.query(query, queryParams, (error, results) => {
            if (error) {
                console.error("Error fetching resumes:", error);
                return res.status(500).json({ error: "Failed to fetch resumes" });
            }
            return res.status(200).json(results);
        });
    }
    else if (req.method === "POST") {
        const {
            uId,
            name,
            emailId,
            phoneNo,
            summary,
            education,
            experience,
            projects,
            certifications,
            skills,
            interests,
            strengths,
            weakness,
            path,
        } = req.body;

        const query = `
        INSERT INTO resume_builder 
        (uId, name, emailId, phoneNo, summary, education, experience, projects, certifications, skills, interests, strengths, weakness, path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

        const values = [
            uId,
            name,
            emailId,
            phoneNo,
            summary,
            education ? JSON.stringify(education) : null,
            experience ? JSON.stringify(experience) : null,
            projects ? JSON.stringify(projects) : null,
            certifications ? JSON.stringify(certifications) : null,
            skills ? JSON.stringify(skills) : null,
            interests || null,
            strengths || null,
            weakness || null,
            path || null,
        ];

        db.query(query, values, (error, results) => {

            if (error) {
                console.error("Error inserting resume:", error);
                return res.status(500).json({ error: "Failed to create resume" });
            } else {

                return res.status(200).json({
                    success: "Resume created successfully",
                    id: results.insertId,
                });
            }
        });
    }
    else if (req.method === "PUT") {
        const {
            rId,
            name,
            emailId,
            phoneNo,
            summary,
            education,
            experience,
            projects,
            certifications,
            skills,
            interests,
            strengths,
            weakness,
            path
        } = req.body;

        const query = `
          UPDATE resume_builder 
          SET 
            name = ?, 
            emailId = ?, 
            phoneNo = ?, 
            summary = ?, 
            education = ?, 
            experience = ?, 
            projects = ?, 
            certifications = ?, 
            skills = ?, 
            interests = ?, 
            strengths = ?, 
            weakness = ?, 
            path = ? 
          WHERE rId = ?
        `;

        const values = [
            name,
            emailId || null,
            phoneNo,
            summary,
            education ? JSON.stringify(education) : null,
            experience ? JSON.stringify(experience) : null,
            projects ? JSON.stringify(projects) : null,
            certifications ? JSON.stringify(certifications) : null,
            skills ? JSON.stringify(skills) : null,
            interests || null,
            strengths || null,
            weakness || null,
            path || null,
            rId,
        ];

        db.query(query, values, (error, results) => {
            if (error) {
                console.error("Error updating resume:", error);
                return res.status(500).json({ error: "Failed to update resume" });
            } else {
                return res.status(200).json({
                    success: "Resume updated successfully",
                });
            }
        });
    }

    else if (req.method === "DELETE") {
        const { rId } = req.query;
        if (!rId) {
            return res.status(400).json({ error: "Resume ID is required" });
        }

        const query = "DELETE FROM resume_builder WHERE rId = ?";
        db.query(query, [rId], (error) => {
            if (error) {
                console.error("Error deleting resume:", error);
                return res.status(500).json({ error: "Failed to delete resume" });
            } else {
                return res.status(200).json({ success: "Resume deleted successfully" });
            }
        });
    }
    else {
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}