// components/ManageTips.js
import { useState, useEffect } from "react";
import styles from "@/styles/ManageTips.module.css";
import AdminHeader from "@/components/AdminHeader";
import { tips as initialTips } from "@/data/loadData";

export default function ManageTips() {
    const [tips, setTips] = useState(initialTips);

    useEffect(() => {
        if (!sessionStorage.getItem("userId")) {
            alert("Please login to continue");
            window.location.href = "/login";
        }
    }, []);

    const handleDeleteClick = (id) => {
        const updatedTips = tips.filter(tip => tip.id !== id);
        setTips(updatedTips);
    };

    return (
        <>
            <AdminHeader />
            <div className={styles.manageTips}>
                <h2 className="pageTitle">Manage Tips</h2>

                <table className={styles.tipsTable}>
                    <thead>
                        <tr>
                            <th>Tip ID</th>
                            <th>Short Description</th>
                            <th>Content</th>
                            <th>Posted By</th>
                            <th>Posted Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tips.map(tip => (
                            <tr key={tip.id}>
                                <td>{tip.id}</td>
                                <td>{tip.shortDescription}</td>
                                <td>{tip.content}</td>
                                <td>{tip.postedBy}</td>
                                <td>{tip.postedDate}</td>
                                <td>
                                    <button className={`${styles.deleteButton} ${styles.actionsCell}`} onClick={() => handleDeleteClick(tip.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}