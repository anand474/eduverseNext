import { useState, useEffect } from "react";
import styles from "@/styles/ManageGroups.module.css";
import AdminHeader from "@/components/AdminHeader";

const initialGroups = [
  { id: 1, name: "AI Enthusiasts", description: "Group for AI researchers", interests: "Artificial Intelligence, Machine Learning", createdBy: "John Doe" },
  { id: 2, name: "Web Developers", description: "Group for front-end and back-end developers", interests: "React, Node.js, JavaScript", createdBy: "Jane Smith" },
  { id: 3, name: "Data Scientists", description: "Group for data science professionals", interests: "Data Analysis, Python, R", createdBy: "Alice Johnson" },
];

export default function ManageGroups() {
  const [groups, setGroups] = useState(initialGroups);

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      window.location.href = "/login";
    }
  }, []);

  const handleDeleteGroup = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (confirmDelete) {
      const updatedGroups = groups.filter(group => group.id !== id);
      setGroups(updatedGroups);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className={styles.manageGroups}>
        <h2 className="pageTitle">Manage Groups</h2>
        <table className={styles.groupTable}>
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Group Name</th>
              <th>Description</th>
              <th>Academic Interests</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>{group.id}</td>
                <td>{group.name}</td>
                <td>{group.description}</td>
                <td>{group.interests}</td>
                <td>{group.createdBy}</td>
                <td className={styles.actionsCell}>
                  <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => handleDeleteGroup(group.id)}> Delete </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}