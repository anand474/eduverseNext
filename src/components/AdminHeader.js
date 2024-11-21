import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/AdminHeader.module.css';
import { useRouter } from 'next/router';

export default function AdminHeader() {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const router = useRouter();

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

  useEffect(() => {
    if (userId) {
      const fetchUnreadNotifications = async () => {
        try {
          const response = await fetch(`/api/notifications?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            const unreadCount = data.filter(notification => !notification.isRead).length;
            setUnreadNotifications(unreadCount);
          } else {
            console.error("Failed to fetch notifications");
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchUnreadNotifications();

      const intervalId = setInterval(fetchUnreadNotifications, 1000);
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src="/assets/edvlogo.jpg" alt="EduVerse Logo" width={150} height={50} />
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/admin">Home</Link>
          </li>
          <li>
            <Link href="/manageUsers">Users</Link>
          </li>
          <li>
            <Link href="/adminUserRequests">Requests</Link>
          </li>
          <li>
            <Link href="/manageOpportunities">Opportunities</Link>
          </li>

          <li className={styles.dropdown}>
            <a className={styles.dropdownToggle}>Resources</a>
            <div className={styles.dropdownContent}>
              <Link href="/manageEvents">Events</Link>
              <Link href="/manageGroups">Groups</Link>
              <Link href="/manageForums">Forums</Link>
              <Link href="/manageArticles">Articles</Link>
              <Link href="/manageTips">Tips</Link>
            </div>
          </li>

          <li>
            <Link href="/chats">Chat</Link>
          </li>
          <li className={styles.dropdown}>
            <a className={styles.dropdownToggle}>{userId ? `Admin ${userId}` : 'User'}</a>
            <div className={styles.dropdownContent}>
              <Link href="/profile">Profile</Link>
              <Link href="/notifications">
                Notifications
                <span className={styles.notificationBadge}>
                  {unreadNotifications > 0 ? unreadNotifications : "0"}
                </span>
              </Link>
              <Link href="/settings">Preferences</Link>
              <Link href="/logout">Logout</Link>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
