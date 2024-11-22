import db from "@/data/db";

export default async function handler(req, res) {
    const { action } = req.body;

    if (req.method === "POST") {
        
        if (action === "createForum") {
            const { forum_name, forum_description,userId } = req.body;

            if (!forum_name || !forum_description) {
                return res.status(400).json({ error: "Forum name and description are required" });
            }

            const query = `INSERT INTO forums (fname, description,created_uid) VALUES (?, ?,?)`;
            db.query(query, [forum_name, forum_description,userId], (error, results) => {
                if (error) {
                    console.error("Error creating forum:", error);
                    return res.status(500).json({ error: "Failed to create forum" });
                }
                return res.status(200).json({
                    success: "Forum created successfully",
                    forum_id: results.insertId,
                    created_uid: userId,
                });
            });

        } else if (action === "fetchForums") {
            const query = `SELECT * FROM forums ORDER BY fid DESC`;
            db.query(query, (error, results) => {
                if (error) {
                    console.error("Error fetching forums:", error);
                    return res.status(500).json({ error: "Failed to fetch forums" });
                }
                return res.status(200).json(results);
            });

        
        } else if (action === "deleteForum") {
            const { forum_id } = req.body;
            if (!forum_id) {
                return res.status(400).json({ error: "Forum ID is required" });
            }

            const query = `DELETE FROM forums WHERE fid = ?`;
            db.query(query, [forum_id], (error) => {
                if (error) {
                    console.error("Error deleting forum:", error);
                    return res.status(500).json({ error: "Failed to delete forum" });
                }
                return res.status(200).json({ success: "Forum deleted successfully" });
            });

        } 
        else if (action === "fetchForum") {
            const { forum_id } = req.body;

            if (!forum_id) {
                return res.status(400).json({ error: "Forum ID is required" });
            }

            const query = "SELECT * FROM forums WHERE fid = ?";
            db.query(query, [forum_id], (error, results) => {
                if (error) {
                    console.error("Error fetching forum:", error);
                    return res.status(500).json({ error: "Failed to fetch forum" });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: "Forum not found" });
                }

                return res.status(200).json(results[0]);
            });
        } else if (action === "createPost") {
            const { forum_id, title, content, link, uid,uname } = req.body;

            if (!forum_id || !title || !content || !uid || !uname) {
                return res.status(400).json({ error: "Forum ID, title, content, and posted by are required" });
            }

            const query = `
                INSERT INTO posts (fid, posttitle, description, link, uname, uid, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `;
            db.query(query, [forum_id, title, content, link || null, uname,uid], (error, results) => {
                if (error) {
                    console.error("Error creating post:", error);
                    return res.status(500).json({ error: "Failed to create post" });
                }
                return res.status(200).json({
                    success: "Post created successfully",
                    post_id: results.insertId,
                });
            });

        } else if (action === "fetchPosts") {
            const { forum_id } = req.body;
            if (!forum_id) {
                return res.status(400).json({ error: "Forum ID is required" });
            }

            const query = `SELECT * FROM posts WHERE fid = ?`;
            db.query(query, [forum_id], (error, results) => {
                if (error) {
                    console.error("Error fetching posts:", error);
                    return res.status(500).json({ error: "Failed to fetch posts" });
                }
                return res.status(200).json(results);
            });

        } else if (action === "deletePost") {
            const { post_id } = req.body;
            if (!post_id) {
                return res.status(400).json({ error: "Post ID is required" });
            }

            const query = `DELETE FROM posts WHERE pid = ?`;
            db.query(query, [post_id], (error) => {
                if (error) {
                    console.error("Error deleting post:", error);
                    return res.status(500).json({ error: "Failed to delete post" });
                }
                return res.status(200).json({ success: "Post deleted successfully" });
            });

        } else if (action === "addComment") {
            const { post_id, username, text } = req.body;

            if (!post_id || !username || !text) {
                return res.status(400).json({ error: "Post ID, username, and comment text are required" });
            }

            const query = `
                INSERT INTO forumcomments (pid, uname, content, timestamp)
                VALUES (?, ?, ?, NOW())
            `;
            db.query(query, [post_id, username, text], (error, results) => {
                if (error) {
                    console.error("Error adding comment:", error);
                    return res.status(500).json({ error: "Failed to add comment" });
                }
                return res.status(200).json({
                    success: "Comment added successfully",
                    comment_id: results.insertId,
                });
            });

        }else if (action === "fetchComments") {
            const { post_id } = req.body;

            if (!post_id) {
                return res.status(400).json({ error: "Post ID is required" });
            }

            const query = `SELECT * FROM forumcomments WHERE pid = ? ORDER BY timestamp ASC`;
            db.query(query, [post_id], (error, results) => {
                if (error) {
                    console.error("Error fetching comments:", error);
                    return res.status(500).json({ error: "Failed to fetch comments" });
                }
                return res.status(200).json(results);
            });
        } else {
            return res.status(400).json({ error: "Invalid action" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
