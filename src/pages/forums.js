import { useState, useEffect } from "react";
import Header from "@/components/Header";
import styles from "@/styles/Forums.module.css";

export default function Forums() {
    const [forumList, setForumList] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newForum, setNewForum] = useState({ forum_name: "", forum_description: "" });
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

    useEffect(() => {
        const fetchForums = async () => {
            const response = await fetch("/api/forums", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "fetchForums" }),
            });
            const data = await response.json();
            setForumList(data);
        };
        fetchForums();
    }, []);
    
    const [newUser, setNewUserId]=useState(null);
    const handleCreateForum = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/forums", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "createForum",
                forum_name: newForum.forum_name,
                forum_description: newForum.forum_description,
                userId,
            }),
        });
        const data = await response.json();
        if (response.ok) {
            alert(`Forum Created Successfully!`);
            setNewUserId(data.created_uid);
            setForumList([...forumList, { forum_id: data.forum_id, ...newForum }]);
            setNewForum({ forum_name: "", forum_description: "" });
            setShowCreateForm(false);
        } else {
            alert(data.error || "Failed to create forum");
        }
    };
    

    const handleDelete = async (forumId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this forum?");
        if (!confirmDelete) return;
    
        try {
            const response = await fetch("/api/forums", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "deleteForum",
                    forum_id: forumId,
                    
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setForumList(forumList.filter((forum) => forum.fid !== forumId));
                console.log("Forum deleted successfully:", forumId);
            } else {
                alert(data.error || "Failed to delete forum");
            }
        } catch (error) {
            console.error("Error deleting forum:", error);
            alert("An error occurred while deleting the forum.");
        }
    };
    

    return (
        <>
            <Header />
            <div className={styles.forumsList}>
                <h2 className="pageTitle">Forums</h2>
                {userRole !== "Student" && (
                    <button className={styles.createForumBtn} onClick={() => setShowCreateForm(!showCreateForm)}>
                        {showCreateForm ? "Cancel" : "Create Forum"}
                    </button>
                )}

                {showCreateForm && (
                    <form className={styles.createForumForm} onSubmit={handleCreateForum}>
                        <input
                            type="text"
                            placeholder="New Forum Name"
                            value={newForum.forum_name}
                            onChange={(e) => setNewForum({ ...newForum, forum_name: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="New Forum Description"
                            value={newForum.forum_description}
                            onChange={(e) => setNewForum({ ...newForum, forum_description: e.target.value })}
                            required
                        />
                        <button type="submit">Create</button>
                    </form>
                )}
                <br />

                <div className={styles.forumsGrid}>
                    {forumList.map((forum) => (
                        <div className={styles.forumBox} key={forum.fid}>
                            <h3>{forum.fname || forum.forum_name}</h3>
                            <p>{forum.description || forum.forum_description}</p>
                            <div className={styles.buttonGroup}>
                                <button className={styles.goToForumBtn}
                                    onClick={() => window.location.href = `/forums/${forum.fid}`}
                                >
                                    Go to Forum
                                </button>
                                {((String(userId)===String(forum.created_uid)) || newUser) && (
                                    <button className={styles.deleteForumBtn} onClick={() => handleDelete(forum.fid)}>
                                        Delete Forum
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}