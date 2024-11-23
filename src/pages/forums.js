import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import { forums as initialForums, users } from "@/data/loadData";
import styles from "@/styles/Forums.module.css";

export default function Forums() {
    const [forumList, setForumList] = useState(initialForums);
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

    const handleCreateForum = (e) => {
        e.preventDefault();
        const newId = forumList.length ? forumList[forumList.length - 1].forum_id + 1 : 1;
        const createdForum = { forum_id: newId, ...newForum };
        setForumList([...forumList, createdForum]);
        setNewForum({ forum_name: "", forum_description: "" });
        setShowCreateForm(false);
    };

    const handleDelete = (forumId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this forum?");
        if (confirmDelete) {
            setForumList(forumList.filter(forum => forum.forum_id !== forumId));
            console.log("Forum deleted:", forumId);
        }
    };

    return (
        <>
            <Header />
            <div className={styles.forumsList}>
                <h2 className="pageTitle">Forums</h2>
                <SearchBar />
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
                        <div className={styles.forumBox} key={forum.forum_id}>
                            <h3>{forum.forum_name}</h3>
                            <p>{forum.forum_description}</p>
                            <div className={styles.buttonGroup}>
                                <button className={styles.goToForumBtn}
                                    onClick={() => window.location.href = `/forums/${forum.forum_id}`}
                                >
                                    Go to Forum
                                </button>
                                {userRole !== "Student" && (
                                    <button className={styles.deleteForumBtn} onClick={() => handleDelete(forum.forum_id)}>
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