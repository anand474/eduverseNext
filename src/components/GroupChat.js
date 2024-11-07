import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/GroupChat.module.css";
import MemberCard from "@/components/MemberCard";
import { FaTrashAlt } from "react-icons/fa";

export default function GroupChat({ group, handleLeaveGroup, handleBack, handleDeleteGroup }) {
    const initialPosts = Array.from({ length: 10 }, (_, index) => {
        const usernames = ["User1", "User2", "User3", "User4"];
        const comments = [
            { username: "User3", text: "Great post!" },
            { username: "User4", text: "Thanks for sharing!" },
        ];

        return {
            title: `Post Title ${index + 1}`,
            description: `Description for post ${index + 1}.`,
            link: index % 2 === 0 ? `https://example.com/${index}` : "",
            username: usernames[index % usernames.length],
            comments: comments,
            userId: index + 1,
        };
    });

    const [posts, setPosts] = useState(initialPosts);
    const [activeTab, setActiveTab] = useState("chat");
    const [openComments, setOpenComments] = useState(new Array(initialPosts.length).fill(false));
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

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        const storedUserRole = sessionStorage.getItem("userRole");

        if (!storedUserId) {
            alert("Please login to continue");
            window.location.href = "/login";
        } else {
            setUserId(storedUserId);
            setUserRole(storedUserRole);
        }
    }, []);

    const handlePostChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleAddPost = () => {
        if (newPost.title && newPost.description) {
            const postWithUsername = {
                ...newPost,
                username: "You",
                comments: [],
            };
            setPosts([...posts, postWithUsername]);
            setNewPost({ title: "", description: "", link: "" });
        }
    };

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setChatMessages([...chatMessages, { sender: "You", text: newMessage }]);
            setNewMessage("");
        }
    };

    const toggleComments = (index) => {
        const updatedOpenComments = [...openComments];
        updatedOpenComments[index] = !updatedOpenComments[index];
        setOpenComments(updatedOpenComments);
    };

    const handleCommentChange = (index, e) => {
        const { value } = e.target;
        setNewComment((prev) => ({ ...prev, [index]: value }));
    };

    const handleAddComment = (index) => {
        if (newComment[index]?.trim()) {
            const updatedPosts = [...posts];
            updatedPosts[index].comments.push({
                username: "You",
                text: newComment[index],
            });
            setPosts(updatedPosts);
            setNewComment((prev) => ({ ...prev, [index]: "" }));
        }
    };

    const handleDeletePost = (index) => {
        const updatedPosts = posts.filter((_, postIndex) => postIndex !== index);
        setPosts(updatedPosts);
    };

    const uniqueMembers = Array.from(new Set([...posts.map(post => post.username), "You"]));

    useEffect(() => {
        if (chatMessagesEndRef.current) {
            chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);

    return (
        <div className={styles.groupChat}>
            <button className={styles.backButton} onClick={handleBack}>Back</button>
            <h2 className={styles.groupTextCenter}>{group.name}</h2>
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
                            <div className={styles.postUsername}>{post.username}</div>
                            <div className={styles.postContent}>
                                <div className={styles.postDetails}>
                                    <h4>{post.title}</h4>
                                    <p>{post.description}</p>
                                    {post.link && (
                                        <a className={styles.readMore} href={post.link} target="_blank" rel="noopener noreferrer">Read More</a>
                                    )}
                                </div>
                                <button onClick={() => toggleComments(index)}>Comments ({post.comments.length})</button>
                                {(userId == post.userId) &&
                                    <button
                                        className={styles.groupDeletePostButton}
                                        onClick={() => handleDeletePost(index)}
                                    >
                                        <FaTrashAlt size={15} color="red" />
                                    </button>
                                }
                            </div>
                            {openComments[index] && (
                                <div className={styles.commentsSection}>
                                    {post.comments.map((comment, commentIndex) => (
                                        <div key={commentIndex} className={styles.comment}>
                                            <span className={styles.commentUsername}>{comment.username}:</span> {comment.text}
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
                            placeholder="Post Link (optional)"
                        />
                        <button onClick={handleAddPost}>Add Post</button>
                    </div>
                </div>
            )}
            {activeTab === "members" && (
                <div>
                    <h3>Members:</h3>
                    {uniqueMembers.length > 0 ? (
                        <div className={styles.membersList}>
                            {uniqueMembers.map((member, index) => (
                                <MemberCard key={index} name={member} />
                            ))}
                        </div>
                    ) : (
                        <p>No members found.</p>
                    )}
                    <button className={styles.leaveGroupButton} onClick={handleLeaveGroup}>Leave Group</button>
                    <button className={styles.deleteGroupButton} onClick={() => handleDeleteGroup(group)}>Delete Group</button>
                </div>
            )}
        </div>
    );
}