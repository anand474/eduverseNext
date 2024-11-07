import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import styles from "@/styles/Notifications.module.css";

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "This is a very long text to show that the application wraps the whole content into the notification card display. Your profile was viewed by 5 people", isRead: false },
    { id: 2, text: "You have a new message from John", isRead: false },
    { id: 3, text: "Your subscription is about to expire", isRead: false },
    { id: 4, text: "Reminder: Meeting at 3 PM tomorrow", isRead: false },
  ]);

  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      router.push("/login");
    }
  }, [router]);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      <Header />
      <div className={styles.notificationsPage}>
        <SearchBar onSearch={setSearchTerm} />
        <div className={styles.clearAll}>
          <button className={styles.clearAllButton} onClick={clearAll}>
            Clear All
          </button>
        </div>
        <br />
        <div className={styles.notificationsList}>
          <ul className={styles.listItems}>
            {notifications.length === 0 ? (
              <p>No notifications available</p>
            ) : (
              notifications.map((notification) => (
                <div className={styles.notificationsCard} key={notification.id}>
                  <li className={`${styles.notificationItem} ${notification.isRead ? styles.read : ""}`}>
                    <div className={styles.notificationText}>{notification.text}</div>
                    <div className={styles.notificationActions}>
                      {!notification.isRead && (
                        <button className={styles.markReadButton} onClick={() => markAsRead(notification.id)}>
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </li>
                </div>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
}