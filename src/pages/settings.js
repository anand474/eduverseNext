import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import AdminHeader from "@/components/AdminHeader";
import styles from "@/styles/Settings.module.css";

export default function SettingsPage() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [themeData, setThemeData] = useState({
    theme: "light",
  });

  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [themeSuccess, setThemeSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserRole = sessionStorage.getItem("userRole");

    if (!storedUserId) {
      alert("Please login to continue");
      router.push("/login");
    } else {
      setUserId(storedUserId);
      setUserRole(storedUserRole);
    }
  }, [router]);

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleThemeChange = (e) => {
    const theme = e.target.value;
    setThemeData({ theme });
    document.body.setAttribute("data-theme", theme);
  };

  const handleEmailToggleChange = () => {
    setEmailNotificationsEnabled((prev) => !prev);
  };

  const validatePasswordFields = () => {
    const newErrors = {};
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = "New password cannot be the same as the current password";
    } else if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(newPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters long and include a number and a special character";
    }

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePasswordFields();
    if (Object.keys(validationErrors).length === 0) {
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordErrors({});
    } else {
      setPasswordErrors(validationErrors);
    }
  };

  return (
    <div>
      {userRole === "Admin" ? <AdminHeader /> : <Header />}
      <div className={styles.settingsContainer}>
        <h2 className="pageTitle">Settings</h2>

        <div className={styles.card}>
          <h3>Reset Password</h3>
          {passwordSuccess && <div className={styles.successMessage}>Password has been updated successfully!</div>}
          <form onSubmit={handlePasswordSubmit}>
            <div className={styles.inputGroup}>
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                placeholder="Enter current password"
              />
              {passwordErrors.currentPassword && <span className={styles.errorMessage}>{passwordErrors.currentPassword}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                placeholder="Enter new password"
              />
              {passwordErrors.newPassword && <span className={styles.errorMessage}>{passwordErrors.newPassword}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordInputChange}
                placeholder="Confirm new password"
              />
              {passwordErrors.confirmNewPassword && <span className={styles.errorMessage}>{passwordErrors.confirmNewPassword}</span>}
            </div>

            <div className={styles.submitBtn}>
              <button type="submit">Save Password</button>
            </div>
          </form>
        </div>

        <div className={styles.card}>
          <h3>Change Theme</h3>
          {themeSuccess && <div className={styles.successMessage}>Theme has been updated successfully!</div>}
          <form onSubmit={(e) => { e.preventDefault(); setThemeSuccess(true); }}>
            <div className={styles.inputGroup}>
              <label>Theme</label>
              <select name="theme" value={themeData.theme} onChange={handleThemeChange}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className={styles.submitBtn}>
              <button type="submit">Save Theme</button>
            </div>
          </form>
        </div>

        <div className={styles.card}>
          <h3>Notification Preferences</h3>
          <form onSubmit={(e) => { e.preventDefault(); }}>
            <div className={styles.toggleContainer}>
              <label>Enable Email Notifications</label>
              <label className={styles.toggleSwitch}>
                <input type="checkbox" checked={emailNotificationsEnabled} onChange={handleEmailToggleChange} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}