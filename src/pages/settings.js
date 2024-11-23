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
      document.body.setAttribute("data-theme", sessionStorage.getItem("lightTheme"));
      const savedTheme = sessionStorage.getItem("theme") || "light"; 
      setThemeData({ theme: savedTheme });
      document.body.setAttribute("data-theme", savedTheme);

      const fetchTheme = async () => {
        const response = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getTheme",
            userId: storedUserId,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          const theme = data.theme.isLightTheme === 1 ? "dark" : "light";
          const enableEmail = data.theme.enableEmail === 1 ? true : false;
          setThemeData({ theme });
          setEmailNotificationsEnabled(enableEmail)
          document.body.setAttribute("data-theme", theme);
        } else {
          console.error("Failed to fetch theme");
        }
      };

      fetchTheme();
    }
  }, [router]);

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleThemeChange = async (e) => {
    const theme = e.target.value;
    setThemeData({ theme });
    document.body.setAttribute("data-theme", theme);
    sessionStorage.setItem("lightTheme", theme); 

    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateTheme",
        theme: theme === "dark" ? 1 : 0,
        userId: userId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setThemeSuccess(true);
    } else {
      alert(data.error || "Failed to update theme");
    }
  };

  const handleEmailToggleChange = async () => {
    const newEmailPreference = !emailNotificationsEnabled;
   

    setEmailNotificationsEnabled(newEmailPreference);
    sessionStorage.setItem("enableEmail",newEmailPreference);

    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateEmail",
        theme: newEmailPreference === false ? "0" : "1",
        userId: userId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setThemeSuccess(true);
    } else {
      alert(data.error || "Failed to update theme");
    }
    
  };

  


  return (
    <div>
      {userRole === "Admin" ? <AdminHeader /> : <Header />}
      <div className={styles.settingsContainer}>
        <h2 className="pageTitle">Settings</h2>
          

        <div className={styles.card}>
          <h3>Change Theme</h3>
          <form onSubmit={(e) => { e.preventDefault(); setThemeSuccess(true); }}>
            <div className={styles.inputGroup}>
              <label>Theme</label>
              <select name="theme" value={themeData.theme} onChange={handleThemeChange}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
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
