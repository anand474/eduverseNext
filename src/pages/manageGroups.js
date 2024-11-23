import { useState, useEffect } from "react";
import styles from "@/styles/ManageGroups.module.css";
import AdminHeader from "@/components/AdminHeader";

const initialGroups = [
  { id: 1, name: "AI Enthusiasts", description: "Group for AI researchers", interests: "Artificial Intelligence, Machine Learning", createdBy: "John Doe" },
  { id: 2, name: "Web Developers", description: "Group for front-end and back-end developers", interests: "React, Node.js, JavaScript", createdBy: "Jane Smith" },
  { id: 3, name: "Data Scientists", description: "Group for data science professionals", interests: "Data Analysis, Python, R", createdBy: "Alice Johnson" },
];

export default function ManageGroups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      window.location.href = "/login";
    }
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getGroups" }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      } else {
        const error = await response.json();
        console.error("Error fetching groups:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteGroup = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteGroup", groupId: id }),
      });
  
      if (response.ok) {
        const updatedGroups = groups.filter((group) => group.gid !== id);
        setGroups(updatedGroups);
        alert("Group deleted successfully.");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete group:", errorData.error);
        alert(errorData.error || "Failed to delete the group.");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("An error occurred while deleting the group. Please try again.");
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.gid}>
                <td>{group.gid}</td>
                <td>{group.gname}</td>
                <td>{group.groupdescription}</td>
                <td>{group.academic_interests}</td>
                <td className={styles.actionsCell}>
                  <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => handleDeleteGroup(group.gid)}> Delete </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}