import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/AdminHeader.module.css';
import { users } from '@/data/loadData';
import { useRouter } from 'next/router';

export default function AdminHeader() {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
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

  const currentUser = users[userId] || {};

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src={logoImage} alt="EduVerse Logo" width={150} height={50} />
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
            <a className={styles.dropdownToggle}>{currentUser.user_name || 'User'}</a>
            <div className={styles.dropdownContent}>
              <Link href="/profile">Profile</Link>
              <Link href="/notifications">
                Notifications
                <span className={styles.notificationBadge}>4</span>
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