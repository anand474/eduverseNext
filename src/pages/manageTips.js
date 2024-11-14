import { useState, useEffect } from "react";
import styles from "@/styles/ManageTips.module.css";
import AdminHeader from "@/components/AdminHeader";

export default function ManageTips() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      window.location.href = "/login";
    } else {
      fetchTips();
    }
  }, []);

  const fetchTips = async () => {
    try {
      const response = await fetch("/api/tips");
      if (response.ok) {
        const data = await response.json();
        setTips(data);
      } else {
        console.error("Failed to fetch tips");
      }
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`/api/tips?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        setTips(tips.filter((tip) => tip.tid !== id));
      } else {
        console.error("Failed to delete tip");
      }
    } catch (error) {
      console.error("Error deleting tip:", error);
    }
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
            {tips.map((tip) => (
              <tr key={tip.tid}>
                <td>{tip.tid}</td>
                <td>{tip.title}</td>
                <td>{tip.tip_content}</td>
                <td>{tip.postedBy}</td>
                <td>{tip.posted_date}</td>
                <td>
                  <button
                    className={`${styles.deleteButton} ${styles.actionsCell}`}
                    onClick={() => handleDeleteClick(tip.tid)}
                  >
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
