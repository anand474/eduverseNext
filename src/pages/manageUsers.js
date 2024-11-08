import { useState, useEffect } from "react";
// import Select from "react-select";
import AdminHeader from "@/components/AdminHeader";
import SearchBar from "@/components/SearchBar";
import styles from "@/styles/ManageUsers.module.css";

const initialUsers = [
  { id: 1, name: "John Doe", email: "A@gmail.com", phone: "123-456-7890", role: "" },
  { id: 2, name: "Jane Smith", email: "B@gmail.com", phone: "987-654-3210", role: "Mentor" },
  { id: 3, name: "Alice Johnson", email: "C@gmail.com", phone: "555-123-4567", role: "Advisor" },
];

const roleOptions = [
  { value: "Advisor", label: "Advisor" },
  { value: "Mentor", label: "Mentor" },
  { value: "Student", label: "Student" },
];

export default function ManageUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [editRowId, setEditRowId] = useState(null);

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

  const handleEditClick = (id) => {
    setEditRowId(id);
  };

  const handleSaveClick = () => {
    setEditRowId(null);
  };

  const handleRoleChange = (selectedOption, id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, role: selectedOption.value } : user
    );
    setUsers(updatedUsers);
  };

  const handleDeleteClick = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const handleResetLinkClick = (email) => {
    alert(`Reset link has been sent to ${email}`);
  };

  return (
    <>
      <AdminHeader />
      <div className={styles.manageUsers}>
        <h2 className="pageTitle">Manage Users</h2>
        <SearchBar />
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email ID</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  {editRowId === user.id ? (
                    <select
                      value={user.role || ""}
                      onChange={(e) => handleRoleChange({ value: e.target.value }, user.id)}
                      className={styles.selectDropdown}
                    >
                      <option value="">Select</option>
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    user.role || "No Role Assigned"
                  )}
                </td>
                <td className={styles.actionsCell}>
                  {editRowId === user.id ? (
                    <button className={styles.saveButton} onClick={handleSaveClick}>Save</button>
                  ) : (
                    <button className={styles.editButton} onClick={() => handleEditClick(user.id)}>Edit</button>
                  )}
                  <button className={styles.deleteButton} onClick={() => handleDeleteClick(user.id)}>Delete</button>
                  <button className={styles.resetButton} onClick={() => handleResetLinkClick(user.email)}>Reset Link</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}