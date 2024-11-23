import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/GroupChat.module.css";
import MemberCard from "@/components/MemberCard";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function GroupChat({ group,  handleBack }) {
    const initialPosts = Array.from({ length: 10 }, (_, index) => {
        const usernames = ["User1", "User2", "User3", "User4"];
        const comments = [
            { username: "User3", text: "Great post!" },
            { username: "User4", text: "Thanks for sharing!" },
        ];

        return {
            posttitle: `Post Title ${index + 1}`,
            description: `Description for post ${index + 1}.`,
            link: index % 2 === 0 ? `https://example.com/${index}` : "",
            userName: usernames[index % usernames.length],
            comments: comments,
            userId: index + 1,
        };
    });
    const router = useRouter();
    console.log(router);
    const { groupId } = router.query;
    const [groups, setGroup] = useState(null);

    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("chat");
    const [openComments, setOpenComments] = useState([]);
    const [newPost, setNewPost] = useState({ title: "", description: "", link: "" });
    const [newMessage, setNewMessage] = useState("");
    const [newComment, setNewComment] = useState({});
    const initialChatMessages = Array.from({ length: 10 }, (_, index) => ({
        sender: index % 2 === 0 ? "User1" : "User2",
        text: `This is message number ${index + 1}`,
    }));

    const [chatMessages, setChatMessages] = useState(initialChatMessages);
    const chatMessagesEndRef = useRef(null);

    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const[userName,setUserName] = useState(null);

    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [error, setError] = useState("");
    const [creatorId, setCreatorId] = useState(null);
    const [gname, setGroupName] = useState(null);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        const storedUserRole = sessionStorage.getItem("userRole");
        const userName = sessionStorage.getItem("userName");

        if (!storedUserId) {
            alert("Please login to continue");
            window.location.href = "/login";
        } else {
            setUserId(storedUserId);
            setUserRole(storedUserRole);
            setUserName(userName);
            if (!router.isReady) return;
            const fetchGroupDetails = async () => {
                if (!groupId) return;
                try {
                    const response = await fetch(`/api/grouphandler`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            action: "getGroupDetails",
                            gid: groupId,
                        }),
                    });
        
                    const data = await response.json();
        
                    if (response.ok) {
                        const { gname,created_uid } = data;
                        
                        setCreatorId(created_uid); 
                        setGroupName(gname);
                    } else {
                        alert("Failed to fetch group details");
                    }
                } catch (err) {
                    console.error(err);
                    alert("An error occurred while fetching group details.");
                }
            };
        
            fetchGroupDetails();
        }}, [router.isReady,groupId]);
        if (!group) {
            return <p>Loading group details...</p>;
          }

    useEffect(() => {
        if (activeTab === "members") {
            fetchGroupMembers();
        }
    }, [activeTab]);

    const fetchGroupMembers = async () => {
        setLoadingMembers(true);
        setError("");

        try {
            const response = await fetch("/api/grouphandler", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "fetchGroupMembers",
                    gid: group.gid,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch members: ${response.statusText}`);
            }

            const data = await response.json();
            setMembers(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoadingMembers(false);
        }
    };
    const handleLeaveGroup = async (group) => {
        try {
            const response = await fetch(`/api/grouphandler`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "getGroupDetails",
                    gid: group.gid,
                }),
            });
    
            const data = await response.json();

    
            if (response.ok) {
                const { created_uid } = data;
    
                if (String(userId) === String(created_uid)) {
                    alert("You cannot leave the group as you are the creator.");
                    return;
                }
    
                const leaveResponse = await fetch("/api/grouphandler", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "leaveGroup",
                        gid: group.gid,
                        userId: userId,
                    }),
                });
    
                const leaveData = await leaveResponse.json();
    
                if (leaveResponse.ok) {
                    alert("Successfully left the group!");
                    
                    window.location.href = '/groups';
                } else {
                    alert(leaveData.error || "Failed to leave the group");
                }
            } else {
                alert("Failed to fetch group details");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while leaving the group.");
        }
    };

    const handleDeleteGroup = async (group) => {
        try {
            
            const response = await fetch(`/api/grouphandler`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "getGroupDetails",
                    gid: group.gid,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                const { created_uid } = data;
    
                if (String(userId) !== String(created_uid)) {
                    alert("You can only delete the group if you are the creator.");
                    return;
                }
    
                const deleteResponse = await fetch("/api/grouphandler", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "deleteGroup",
                        gid: group.gid,
                        userId: userId,
                    }),
                });
    
                const deleteData = await deleteResponse.json();
    
                if (deleteResponse.ok) {
                    alert("Group successfully deleted!");
                    window.location.href = '/groups'; 
                } else {
                    alert(deleteData.error || "Failed to delete the group");
                }
            } else {
                alert("Failed to fetch group details");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting the group.");
        }
    };
    
    

    const handlePostChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleAddPost = async (group) => {
        if (newPost.title && newPost.description) {
            try {
                const response = await fetch("/api/grouphandler", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "addPost",
                        gid: group.gid,
                        title: newPost.title,
                        description: newPost.description,
                        link: newPost.link,
                        userId,
                        userName,
                    }),
                });
    
                const data = await response.json();
                if (response.ok) {
                    setPosts([...posts, data.post]);
                    setNewPost({ title: "", description: "", link: "" });
                    alert("Post added successfully!");
                    
                } else {
                    alert(data.error || "Failed to add the post.");
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred while adding the post.");
            }
        } else {
            alert("Please fill in all required fields.");
        }
    };
    const fetchGroupPosts = async () => {
        try {
          const response = await fetch("/api/grouphandler", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "fetchGroupPosts",
              gid: group.gid,
            }),
          });
      
          if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
          }
      
          const data = await response.json();
          const formattedPosts = data.map(post => ({
            ...post,
            comments: JSON.parse(post.comments || "[]"),
          }));
          setPosts(formattedPosts);
        } catch (error) {
          console.error(error);
          alert("An error occurred while fetching posts.");
        }
      };
      
      useEffect(() => {
        if (activeTab === "posts") {
          fetchGroupPosts();
        }
      }, [activeTab, group.gid]);
      

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setChatMessages([...chatMessages, { sender: "You", text: newMessage }]);
            setNewMessage("");
        }
    };

    const toggleComments = async (index) => {
        const updatedOpenComments = [...openComments];
        updatedOpenComments[index] = !updatedOpenComments[index];
        setOpenComments(updatedOpenComments);
    
        if (updatedOpenComments[index] && !posts[index].commentsLoaded) {
            try {
                const response = await fetch("/api/grouphandler", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "fetchComments",
                        postId: posts[index].gpid, 
                    }),
                });
    
                const data = await response.json();
                if (response.ok) {
                    const updatedPosts = [...posts];
                    updatedPosts[index].comments = data;
                    updatedPosts[index].commentsLoaded = true;
                    setPosts(updatedPosts);
                } else {
                    alert(data.error || "Failed to load comments.");
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
                alert("An error occurred while fetching comments.");
            }
        }
    };
    

    const handleCommentChange = (index, e) => {
        const { value } = e.target;
        setNewComment((prev) => ({ ...prev, [index]: value }));
    };

    const handleAddComment = async (index) => {
        if (newComment[index]?.trim()) {
            try {
                const response = await fetch("/api/grouphandler", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "addComment",
                        gid: group.gid,
                        postId: posts[index].gpid,
                        comment: newComment[index],
                        userId,
                        userName,
                    }),
                });
    
                const data = await response.json();
                if (response.ok) {
                    const updatedPosts = [...posts];
                    updatedPosts[index].comments.push({
                        uname: userName,
                        content: newComment[index],
                    });
                    setPosts(updatedPosts);
                    setNewComment((prev) => ({ ...prev, [index]: "" }));
                    alert("Comment added successfully!");
                } else {
                    alert(data.error || "Failed to add the comment.");
                }
            } catch (error) {
                console.error("Error adding comment:", error);
                alert("An error occurred while adding the comment.");
            }
        } else {
            alert("Please enter a comment before submitting.");
        }
    };
    

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch("/api/grouphandler", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "deletePost",
                    postId: postId,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                const updatedPosts = posts.filter(post => post.gpid !== postId);
                setPosts(updatedPosts);
                alert("Post deleted successfully!");
            } else {
                alert(data.error || "Failed to delete post.");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("An error occurred while deleting the post.");
        }
    };

    const uniqueMembers = Array.from(new Set([...posts.map(post => post.username), "You"]));

    useEffect(() => {
        if (chatMessagesEndRef.current) {
            chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);

    return (
        <>
        <Header/>

        <div className={styles.groupChat}>
            <button className={styles.backButton} onClick={handleBack}>Back</button>
            <h2 className={styles.groupTextCenter}>{gname}</h2>
            <div className={styles.tabButtons}>
                <button className={activeTab === "chat" ? styles.active : ""} onClick={() => setActiveTab("chat")}>Chat</button>
                <button className={activeTab === "posts" ? styles.active : ""} onClick={() => setActiveTab("posts")}>Posts</button>
                <button className={activeTab === "members" ? styles.active : ""} onClick={() => setActiveTab("members")}>Members</button>
            </div>
            {activeTab === "chat" && (
                <div>
                    <div className={styles.chatMessages}>
                        {chatMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`${styles.message} ${message.sender === "You" ? styles.messageYou : styles.messageOther}`}
                            >
                                <span className={styles.senderName}>{message.sender}:</span> {message.text}
                            </div>
                        ))}
                        <div ref={chatMessagesEndRef} />
                    </div>
                    <div className={styles.chatInput}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleMessageChange}
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
            {activeTab === "posts" && (
                <div className={styles.postsSection}>
                    {posts.map((post, index) => (
                        <div key={index} className={styles.postItem}>
                            <div className={styles.postUsername}>{post.uname}</div>
                            <div className={styles.postContent}>
                                <div className={styles.postDetails}>
                                    <h4>{post.title || post.posttitle}</h4>
                                    <p>{post.description}</p>
                                    {post.link && (
                                        <a className={styles.readMore} href={post.link} target="_blank" rel="noopener noreferrer">Read More</a>
                                    )}
                                </div>
                                <button onClick={() => toggleComments(index)}> Comments </button>
                                {(userId == post.uid) &&
                                    <button
                                        className={styles.groupDeletePostButton}
                                        onClick={() => handleDeletePost(post.gpid)}
                                    >
                                        <FaTrashAlt size={15} color="red" />
                                    </button>
                                }
                            </div>
                            {openComments[index] && (
                                <div className={styles.commentsSection}>
                                    {post.comments.map((comment, commentIndex) => (
                                        <div key={commentIndex} className={styles.comment}>
                                            <span className={styles.commentUsername}>{comment.uname}:</span> {comment.content}
                                        </div>
                                    ))}
                                    <div className={styles.newComment}>
                                        <input
                                            type="text"
                                            value={newComment[index] || ""}
                                            onChange={(e) => handleCommentChange(index, e)}
                                            placeholder="Add a comment..."
                                        />
                                        <button onClick={() => handleAddComment(index)}>Add</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className={styles.newPostForm}>
                        <input
                            type="text"
                            name="title"
                            value={newPost.title}
                            onChange={handlePostChange}
                            placeholder="Post Title"
                        />
                        <textarea
                            name="description"
                            value={newPost.description}
                            onChange={handlePostChange}
                            placeholder="Post Description"
                        ></textarea>
                        <input
                            type="text"
                            name="link"
                            value={newPost.link}
                            onChange={handlePostChange}
                            placeholder="Link (optional)"
                        />
                        <button onClick={() => handleAddPost(group)}>Add Post</button>
                    </div>
                </div>
            )}
            {activeTab === "members" && (
                <div>
                    <h3>Members:</h3>
                    {loadingMembers && <p>Loading members...</p>}
                    {error && <p className={styles.errorText}>{error}</p>}
                    {members.length > 0 ? (
                        <div className={styles.membersList}>
                        {members.map((member) => {
                            const currentUserId = sessionStorage.getItem("userId"); 
                            const displayName = currentUserId && String(member.uid) === String(currentUserId) ? "You" : member.fullName;
                            return (
                                <MemberCard 
                                    key={member.uid} 
                                    name={displayName} 
                                    email={member.emailId} 
                                />
                            );
                        })}
                    </div>
                    ) : !loadingMembers && (
                        <p>No members found.</p>
                    )}
                    <button className={styles.leaveGroupButton} onClick={() => handleLeaveGroup(group)}>Leave Group</button>
                    {String(userId) === String(creatorId) && (
    <button className={styles.deleteGroupButton} onClick={() => handleDeleteGroup(group)}>
        Delete Group
    </button>
)}
                </div>
            )}
        </div>
        </>
    );
}