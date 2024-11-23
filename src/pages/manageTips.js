import { useState, useEffect } from "react";
import styles from "@/styles/ManageTips.module.css";
import AdminHeader from "@/components/AdminHeader";

export default function ManageTips() {
  const [tips, setTips] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserRole = sessionStorage.getItem("userRole");

    if (!storedUserId || !storedUserRole) {
      alert("Please login to continue");
      window.location.href = "/login";
      return;
    }

    setUserId(storedUserId);
    setUserRole(storedUserRole);
  }, []);
  useEffect(() => {
    if (userId && userRole) {
      fetchTips();
    }
  }, [userId, userRole]);

  const fetchTips = async () => {
    console.log("Fetching tips...");
    console.log("UserRole:", userRole, "UserId:", userId);

    try {
      const response = await fetch(
        `/api/tips?userId=${userId}&userRole=${userRole}`
      );
      if (response.ok) {
        const data = await response.json();
        setTips(data);
      } else {
        console.error("Failed to fetch tips:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching tips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`/api/tips?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        setTips((prev) => prev.filter((tip) => tip.tid !== id));
      } else {
        console.error("Failed to delete tip");
      }
    } catch (error) {
      console.error("Error deleting tip:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

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
