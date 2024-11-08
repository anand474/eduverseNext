import React, { useState, useEffect } from "react";
import styles from "@/styles/ManageForums.module.css"; // Import CSS module
import { forums as initialForums, users } from "@/data/loadData";
import AdminHeader from "@/components/AdminHeader";


export default function ManageForums() {
  const [forums, setForums] = useState(initialForums);
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

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this forum?")) {
      const updatedForums = forums.filter((forum) => forum.forum_id !== id);
      setForums(updatedForums);
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
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forums.map((forum) => (
              <tr key={forum.forum_id}>
                <td>{forum.forum_id}</td>
                <td>{forum.forum_name}</td>
                <td>{forum.forum_description}</td>
                <td>{users[forum.created_by].user_name}</td>
                <td className={styles.actionsCell}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(forum.forum_id)}
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