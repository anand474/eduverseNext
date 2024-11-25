import React, { useState, useEffect } from "react";
import styles from "@/styles/ManageForums.module.css";
import { forums as initialForums, users } from "@/data/loadData";
import AdminHeader from "@/components/AdminHeader";


export default function ManageForums() {
  const [forums, setForums] = useState([]);
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
      fetchForums();
    }
  }, []);

  const fetchForums = async () => {
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getForums" }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setForums(data);
      } else {
        const error = await response.json();
        console.error("Error fetching forums:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this forum?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteForum", fid: id }),
      });
  
      if (response.ok) {
        const updatedForums = forums.filter((forum) => forum.fid !== id);
        setForums(updatedForums);
        alert("Forum deleted successfully.");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete forum:", errorData.error);
        alert(errorData.error || "Failed to delete the forum.");
      }
    } catch (error) {
      console.error("Error deleting forum:", error);
      alert("An error occurred while deleting the forum. Please try again.");
    }
  };

  return (
    <>
      <AdminHeader />
      <div className={styles.manageForums}>
        <h2 className="pageTitle">Manage Forums</h2>
        <table className={styles.forumTable}>
          <thead>
            <tr>
              <th>Forum ID</th>
              <th>Forum Name</th>
              <th>Forum Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forums.map((forum) => (
              <tr key={forum.fid}>
                <td>{forum.fid}</td>
                <td>{forum.fname}</td>
                <td>{forum.description}</td>
                <td className={styles.actionsCell}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(forum.fid)}
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