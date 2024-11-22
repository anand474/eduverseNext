import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import styles from "@/styles/Notifications.module.css";

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = typeof window !== "undefined" && sessionStorage.getItem("userId");
    if (!storedUserId) {
      alert("Please login to continue");
      router.push("/login");
    } else {
      setUserId(storedUserId);
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`/api/notifications?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);                 
          } else {
            console.error("Failed to fetch notifications:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();

      const pollingInterval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds
      return () => clearInterval(pollingInterval);
    }
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nId: id }),
      });

      if (response.ok) {
        setNotifications(notifications.filter((notification) => notification.nId !== id));
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const clearAll = async () => {
    try {
      const response = await fetch(`/api/notifications`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setNotifications([]);
      } else {
        console.error("Failed to clear notifications");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
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
                <div className={styles.notificationsCard} key={notification.nId}>
                  <li className={`${styles.notificationItem} ${notification.isRead ? styles.read : ""}`}>
                    <div className={styles.notificationText}>{notification.message}</div>
                    <div className={styles.notificationActions}>
                      {!notification.isRead && (
                        <button className={styles.markReadButton} onClick={() => markAsRead(notification.nId)}>
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
