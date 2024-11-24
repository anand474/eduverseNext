import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import styles from "@/styles/ManageUsers.module.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      alert("Please login to continue");
      window.location.href = "/login";
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id) => setEditRowId(id);

  const handleSaveClick = async (id, role) => {
    try {
      setLoading(true);
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id, updates: { type: role } }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      const updatedUsers = users.map((user) =>
        user.uid === id ? { ...user, role } : user
      );
      setUsers(updatedUsers);
      alert("User role updated successfully!");
      setLoading(false);

      const userEmail = users.find((user) => user.uid === id)?.emailId;
      const loginPageUrl = "http://localhost:3000/login";
      const emailBody = `
      <div style="font-family: Jua, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #4CAF50;">Your Account is Activated!</h2>
        <p>Dear User,</p>
        <p>Your ${role} account has been successfully activated. You can now log in using the link below:</p>
        <a href="${loginPageUrl}" 
           style="display: inline-block; margin-top: 20px; padding: 10px 20px; font-size: 16px; font-weight: bold; 
                  color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
          Login to Your Account
        </a>
        <p style="margin-top: 20px;">Thank you for being part of our platform!</p>
      </div>
    `;

      const emailResponse = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userEmail,
          subject: "Your Eduverse Account is Activated",
          html: emailBody,
        }),
      });

      if (emailResponse.ok) {
        console.log("Email sent to user successfully");
      } else {
        console.error("Failed to send email to the user");
      }

    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Error updating user role.");
    } finally {
      setEditRowId(null);
      setLoading(false);
    }
  };

  const handleRoleChange = (event, id) => {
    const updatedUsers = users.map((user) =>
      user.uid === id ? { ...user, type: event.target.value } : user
    );
    setUsers(updatedUsers);
  };

  const handleDeleteClick = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        setLoading(true);
        const response = await fetch(`/api/users?userId=${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete user");
        setUsers(users.filter((user) => user.uid !== id));
      } catch (error) {
        console.error(error);
        alert("Error deleting user.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetLinkClick = async (email, name) => {
    try {
      setLoading(true);
      const resetLink = "http://localhost:3000/forgotPassword";
      const emailBody = `
          <div style="font-family: Jua, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #4CAF50;">Password Reset Request</h2>
            <p>Dear ${name},</p>
            <p>We received a request to reset your password. You can reset your password by clicking the link below:</p>
            <a href="${resetLink}" 
               style="display: inline-block; margin-top: 20px; padding: 10px 20px; font-size: 16px; font-weight: bold; 
                      color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
            <p style="margin-top: 20px;">If you did not request a password reset, please ignore this email.</p>
          </div>
        `;

      const emailResponse = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Password Reset Request",
          html: emailBody,
        }),
      });

      if (emailResponse.ok) {
        setLoading(false);
        alert(`A password reset link has been sent to ${email}`);
        console.log("Password reset email sent successfully.");
      } else {
        setLoading(false);
        console.error("Failed to send password reset email.");
        alert("Error sending password reset link.");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Error sending password reset link.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <AdminHeader />
      <div className={styles.manageUsers}>
        <h2 className="pageTitle">Manage Users</h2>
        {loading && <div className="loadingSpinner"></div>}
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid}>
                <td>{user.uid}</td>
                <td>{user.fullName}</td>
                <td>{user.emailId}</td>
                <td>{user.phoneNo}</td>
                <td>
                  {editRowId === user.uid ? (
                    <select
                      value={user.type || ""}
                      onChange={(event) => handleRoleChange(event, user.uid)}
                      className={styles.selectDropdown}
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Advisor">Advisor</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Student">Student</option>
                    </select>
                  ) : (
                    user.type || "No Role Assigned"
                  )}
                </td>
                <td className={styles.actionsCell}>
                  {editRowId === user.uid ? (
                    <button
                      className={styles.saveButton}
                      onClick={() => handleSaveClick(user.uid, user.type)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(user.uid)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(user.uid)}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.resetButton}
                    onClick={() => handleResetLinkClick(user.emailId, user.fullName)}
                  >
                    Reset Link
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