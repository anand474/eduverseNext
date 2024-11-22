import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { FaTrashAlt } from "react-icons/fa";
import styles from "@/styles/ForumPage.module.css";

export default function ForumPage() {
    const router = useRouter();
    const { forum_id } = router.query;
    const forumId = parseInt(forum_id, 10);

    const [posts, setPosts] = useState([]);
    const [openComments, setOpenComments] = useState([]);
    const [newPost, setNewPost] = useState({ title: "", content: "", link: "" });
    const [newComment, setNewComment] = useState({});
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [fforumId, setFforumId] = useState(null);
    const [ffdescription, setFforumDescription] = useState(null);

    useEffect(() => {
        let storedUserId = sessionStorage.getItem("userId");
        let storedUserRole = sessionStorage.getItem("userRole");
        let storedUserName = sessionStorage.getItem("userName");

        if (!storedUserId) {
            alert("Please login to continue");
            window.location.href = "/login";
        } else {
            setUserId(storedUserId);
            setUserRole(storedUserRole);
            setUserName(storedUserName);
            if (forumId) {
                const fetchForum = async () => {
                    const response = await fetch("/api/forums", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "fetchForum", forum_id: forumId }),
                    });
    
                    const data = await response.json();
                    if (response.ok) {
                        setFforumId(data.fname);
                        setFforumDescription(data.description); 
                    } else {
                        alert(data.error || "Failed to fetch forum details");
                    }
                };
                const fetchPosts = async () => {
                    const response = await fetch("/api/forums", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "fetchPosts", forum_id: forumId }),
                    });
    
                    const data = await response.json();
                    if (response.ok) {
                        const updatedPosts = data.map((post) => ({
                            ...post,
                            comments: post.comments || [],
                        }));
                        setPosts(updatedPosts); 
                    } else {
                        alert(data.error || "Failed to fetch forum details");
                    }
                };
                
                
    
                fetchForum();
                fetchPosts();
            }
        }
    }, [forumId]);


    const currentUser = userId;

    const handleAddPost = async (e) => {
        e.preventDefault();
        if (newPost.title.trim() && newPost.content.trim()) {
            const response = await fetch("/api/forums", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "createPost",
                    forum_id: forumId,
                    title: newPost.title,
                    content: newPost.content,
                    link: newPost.link,
                    uid: userId,
                    uname: userName,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setPosts([...posts, { post_id: data.post_id, ...newPost, comments: [] }]);
                setNewPost({ title: "", content: "", link: "" });
            } else {
                alert(data.error || "Failed to add post");
            }
        }
    };

    const handleDeletePost = async (postId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;
    
        const response = await fetch("/api/forums", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "deletePost",
                post_id: postId,
            }),
        });
    
        const data = await response.json();
        if (response.ok) {
            const updatedPosts = posts.filter((post) => post.pid !== postId);
            setPosts(updatedPosts);
        } else {
            alert(data.error || "Failed to delete post");
        }
    };
    

    const handlePostChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };



    const handleCommentChange = (index, e) => {
        const { value } = e.target;
        setNewComment((prev) => ({ ...prev, [index]: value }));
    };

    const handleAddComment = async (index) => {
        if (newComment[index]?.trim()) {
            const post = posts[index];
            const response = await fetch("/api/forums", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "addComment",
                    post_id: post.pid,
                    username: userName,  
                    text: newComment[index],
                }),
            });

            const data = await response.json();
            if (response.ok) {
                const updatedPosts = [...posts];
                updatedPosts[index].comments.push({
                    uname: "You",  
                    content: newComment[index],
                });
                setPosts(updatedPosts);
                setNewComment((prev) => ({ ...prev, [index]: "" }));
            } else {
                alert(data.error || "Failed to add comment");
            }
        }
    };
    

    const fetchComments = async (index, postId) => {
        const response = await fetch("/api/forums", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "fetchComments", post_id: postId }),
        });
    
        const data = await response.json();
        if (response.ok) {
            const updatedPosts = [...posts];
            updatedPosts[index].comments = data; 
            setPosts(updatedPosts);
        } else {
            alert(data.error || "Failed to fetch comments");
        }
    };
    
    const toggleComments = (index) => {
        const updatedOpenComments = [...openComments];
        updatedOpenComments[index] = !updatedOpenComments[index];
        setOpenComments(updatedOpenComments);
    
        if (updatedOpenComments[index] && posts[index]?.comments?.length === 0) {
            fetchComments(index, posts[index].pid);
        }
    };
    

    return (
        <>
            <Header />
            <div className={styles.forumPage}>
                <h2 className="pageTitle">{fforumId}</h2>
                <p>{ffdescription}</p>

                <h2>Posts</h2>

                <div className={styles.postsSection}>
                    {posts.map((post, index) => (
                        <div key={index} className={styles.postItem}>
                            <div className={styles.postUsername}>{post.uname || userName}</div>
                            <div className={styles.postContent}>
                                <div className={styles.postDetails}>
                                    <h4>{post.posttitle || post.title }</h4>
                                    <p>{post.description || post.content}</p>
                                    {post.link && (
                                        <a className={styles.readMore} href={post.link} target="_blank" rel="noopener noreferrer">Read More</a>
                                    )}
                                </div>
                                <button className={styles.commentsButton} onClick={() => toggleComments(index)}>
                                    Comments 
                                </button>

                                {(String(userId) === String(post.uid) || !post.uid) && (
                                    <button
                                        className={styles.deletePostButton}
                                        onClick={() => handleDeletePost(post.pid)}>
                                        <FaTrashAlt size={15} color="red" />
                                    </button>
                                )}
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
                    <hr />
                    <div className={styles.newPostForm}>
                        <form onSubmit={handleAddPost}>
                            <input
                                type="text"
                                name="title"
                                value={newPost.title}
                                onChange={handlePostChange}
                                placeholder="Post Title"
                                required
                            />
                            <textarea
                                name="content"
                                value={newPost.content}
                                onChange={handlePostChange}
                                placeholder="Post Description"
                                required
                            ></textarea>
                            <input
                                type="text"
                                name="link"
                                value={newPost.link}
                                onChange={handlePostChange}
                                placeholder="Post Link (optional)"
                            />
                            <br />
                            <button type="submit">Add Post</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}