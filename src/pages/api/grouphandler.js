import db from "@/data/db";

export default async function handler(req, res) {
  const { action } = req.body;

  if (req.method === "POST") {
    if (action === "fetchGroupMembers") {
      const { gid } = req.body;

      if (!gid) {
        return res.status(400).json({ error: "Group ID is required" });
      }

      const groupQuery = "SELECT users_list FROM groups WHERE gid = ?";
      db.query(groupQuery, [gid], (groupError, groupResults) => {
        if (groupError) {
          console.error("Error fetching group data:", groupError);
          return res.status(500).json({ error: "Failed to fetch group data" });
        }

        if (groupResults.length === 0) {
          return res.status(404).json({ error: "Group not found" });
        }
        console.log(groupResults)

        const usersList = groupResults[0].users_list;

        const userIds = groupResults.map(group => {
            try {
              
              return JSON.parse(group.users_list); 
            } catch (error) {
              console.error("Error parsing users_list:", error);
              return [];
            }
          }).flat();
        const userQuery = `SELECT uid, fullName, emailId FROM users WHERE uid IN (${userIds.map(() => "?").join(",")})`;
        db.query(userQuery, userIds, (userError, userResults) => {
          if (userError) {
            console.error("Error fetching users:", userError);
            return res.status(500).json({ error: "Failed to fetch user data" });
          }
          console.log(userResults);
          return res.status(200).json(userResults);
        });
      });
    }else if (action === "leaveGroup") {
        const { gid, userId } = req.body;
  
        if (!gid || !userId) {
          return res.status(400).json({ error: "Group ID and User ID are required" });
        }
  
        const groupQuery = "SELECT gid, users_list, created_uid FROM groups WHERE gid = ?";
        db.query(groupQuery, [gid], (groupError, groupResults) => {
          if (groupError) {
            console.error("Error fetching group data:", groupError);
            return res.status(500).json({ error: "Failed to fetch group data" });
          }
  
          if (groupResults.length === 0) {
            return res.status(404).json({ error: "Group not found" });
          }
  
          const groupData = groupResults[0];
          const usersList = JSON.parse(groupData.users_list);
          const creatorId = groupData.creator_id;
  
          if (userId === creatorId) {
            return res.status(403).json({ error: "You cannot leave the group as you are the creator" });
          }
  
          const updatedUsersList = usersList.filter(uid => uid !== userId);
          const updatedUsersListString = JSON.stringify(updatedUsersList);
  
          const updateGroupQuery = "UPDATE groups SET users_list = ? WHERE gid = ?";
          db.query(updateGroupQuery, [updatedUsersListString, gid], (updateError, updateResult) => {
            if (updateError) {
              console.error("Error updating group data:", updateError);
              return res.status(500).json({ error: "Failed to leave the group" });
            }
  
            return res.status(200).json({ message: "Successfully left the group" });
          });
        });
      }else if(action === "getGroupDetails"){
        const { gid } = req.body;
        const groupQuery = "SELECT gname,created_uid FROM groups WHERE gid = ?";
        db.query(groupQuery, [gid], (groupError, groupResults) => {
            if (groupError) {
                console.error("Error fetching group data:", groupError);
                return res.status(500).json({ error: "Failed to fetch group data" });
            }

            if (groupResults.length === 0) {
                return res.status(404).json({ error: "Group not found" });
            }

            const groupData = groupResults[0];
            const { gname,created_uid} = groupData;
            return res.status(200).json({ created_uid,gname });
        });
      } else if (action === "deleteGroup") {
        const { gid, userId } = req.body;
      
        if (!gid || !userId) {
          return res.status(400).json({ error: "Group ID and User ID are required" });
        }
      
        const groupQuery = "SELECT gid, created_uid, users_list FROM groups WHERE gid = ?";
        db.query(groupQuery, [gid], (groupError, groupResults) => {
          if (groupError) {
            console.error("Error fetching group data:", groupError);
            return res.status(500).json({ error: "Failed to fetch group data" });
          }
      
          if (groupResults.length === 0) {
            return res.status(404).json({ error: "Group not found" });
          }
      
          const groupData = groupResults[0];
          const creatorId = groupData.created_uid;
      
          if (String(userId) !== String(creatorId)) {
            console.log(userId,creatorId)
            return res.status(403).json({ error: "You can only delete the group if you are the creator" });
          }
      
          const deleteGroupQuery = "DELETE FROM groups WHERE gid = ?";
          db.query(deleteGroupQuery, [gid], (deleteError, deleteResult) => {
            if (deleteError) {
              console.error("Error deleting group:", deleteError);
              return res.status(500).json({ error: "Failed to delete the group" });
            }
      
            const usersList = JSON.parse(groupData.users_list);
            const removeGroupFromUsersQuery = "UPDATE users SET groups = JSON_REMOVE(groups, ?) WHERE uid IN (?)";
            db.query(removeGroupFromUsersQuery, [gid, usersList], (removeGroupError) => {
              if (removeGroupError) {
                console.error("Error removing group from users' list:", removeGroupError);
              }
            });
      
            return res.status(200).json({ message: "Group successfully deleted" });
          });
        });
      }else if (action === "addPost") {
        const { gid, title, description, link, userId,userName } = req.body;
  
        if (!gid || !title || !description || !userId) {
          return res.status(400).json({ error: "Missing required fields" });
        }
  
        const groupQuery = "SELECT gid FROM groups WHERE gid = ?";
        db.query(groupQuery, [gid], (groupError, groupResults) => {
          if (groupError) {
            console.error("Error fetching group data:", groupError);
            return res.status(500).json({ error: "Failed to fetch group data" });
          }
  
          if (groupResults.length === 0) {
            return res.status(404).json({ error: "Group not found" });
          }
  
          const addPostQuery = `
            INSERT INTO group_posts (gid, posttitle, description, link, uid, uname, timestamp)
            VALUES (?, ?, ?, ?, ?, ?,NOW())
          `;
  
          db.query(addPostQuery, [gid, title, description, link, userId,userName], (postError, postResult) => {
            if (postError) {
              console.error("Error adding post:", postError);
              return res.status(500).json({ error: "Failed to add post" });
            }
  
            return res.status(201).json({message: "Post added successfully",
                post: {
                    gid,
                    title,
                    description,
                    link,
                    userId,
                    userName,
                    postId: postResult.insertId,
                    timestamp: new Date().toISOString()
                } });
          });
        });
      } else if (action === "fetchGroupPosts") {
        const { gid } = req.body;
      
        if (!gid) {
          return res.status(400).json({ error: "Group ID is required" });
        }
      
        const query = "SELECT * FROM group_posts WHERE gid = ? ORDER BY timestamp ASC";
        db.query(query, [gid], (error, results) => {
          if (error) {
            console.error("Error fetching posts:", error);
            return res.status(500).json({ error: "Failed to fetch posts" });
          }
      
          return res.status(200).json(results);
        });
      }
      else if (action === "deletePost") {
        const { postId } = req.body;
    
        if (!postId) {
            return res.status(400).json({ error: "Post ID is required" });
        }
    
        const query = "DELETE FROM group_posts WHERE gpid = ?";
        db.query(query, [postId], (error, results) => {
            if (error) {
                console.error("Error deleting post:", error);
                return res.status(500).json({ error: "Failed to delete post" });
            }
    
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Post not found" });
            }
    
            return res.status(200).json({ message: "Post deleted successfully" });
        });
    }
    else if (action === "addComment") {
        const { postId, userId, userName, comment } = req.body;
    
        if (!postId || !userId || !comment) {
            return res.status(400).json({ error: "Post ID, User ID, and comment are required" });
        }
    
        const addCommentQuery = "INSERT INTO comments (pid, uname, content,timestamp) VALUES (?, ?, ?, NOW())";
        db.query(addCommentQuery, [postId,userName, comment], (err, results) => {
            if (err) {
                console.error("Error adding comment:", err);
                return res.status(500).json({ error: "Failed to add comment" });
            }
    
            return res.status(200).json({ message: "Comment added successfully" });
        });
    }
    else if (action === "fetchComments") {
        const { postId } = req.body;
    
        if (!postId) {
            return res.status(400).json({ error: "Post ID is required" });
        }
    
        const commentQuery = "SELECT uname,content FROM comments WHERE pid = ?";
        db.query(commentQuery, [postId], (err, results) => {
            if (err) {
                console.error("Error fetching comments:", err);
                return res.status(500).json({ error: "Failed to fetch comments" });
            }
    
            return res.status(200).json(results);
        });
    }
      
      else {
        return res.status(400).json({ error: "Invalid action" });
      }
    }  else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
