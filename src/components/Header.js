import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Header.module.css";

export default function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const restrictedPaths = ["/login", "/register", "/forgotPassword", "/contactForm", "/"];
  const contactPaths = ["/login", "/register", "/forgotPassword", "/"];

  const isRestrictedPage = restrictedPaths.includes(router.pathname);
  const isContactPage = contactPaths.includes(router.pathname);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");
    const userName = sessionStorage.getItem("userName");

    if (userId && userRole && userName) {
      setCurrentUser({
        userId,
        userRole,
        userName,
      });
    }
  }, []);

  useEffect(() => {
    if (currentUser?.userId) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`/api/notifications?userId=${currentUser.userId}`);
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

      fetchNotifications();
    }
  }, [currentUser]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/assets/edvlogo.jpg" alt="EduVerse Logo" width={50} height={50} />
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          {isRestrictedPage && !currentUser && (
            <>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/forgotPassword">Reset Password</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/contactForm">Contact Us</Link></li>
            </>
          )}

          {!isContactPage && currentUser && (
            <>
              <li>
                <Link href={
                  currentUser.userRole === "Mentor" ? "/mentor" :
                  currentUser.userRole === "Advisor" ? "/advisor" :
                  currentUser.userRole === "Admin" ? "/admin" :
                  "/home"
                }>
                  Home
                </Link>
              </li>
              <li><Link href="/opportunities">Opportunities</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li className={styles.dropdown}>
                <a className={styles.dropdownToggle}>Resources</a>
                <div className={styles.dropdownContent}>
                  {currentUser.userRole === "Student" && (
                    <Link href="/mentorshipProgram">Mentorship Program</Link>
                  )}
                  <div className={styles.nestedDropdown}>
                    <a className={styles.dropdownToggle}>Career Development</a>
                    <div className={styles.nestedContent}>
                      <Link href="/articles">Articles</Link>
                      <Link href="/tips">Tips</Link>
                      {currentUser.userRole === "Student" && (
                        <Link href="/buildResume">Build Your Resume</Link>
                      )}
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.dropdown}>
                <a className={styles.dropdownToggle}>Networking</a>
                <div className={styles.dropdownContent}>
                  <Link href="/groups">Groups</Link>
                  <Link href="/forums">Forums</Link>
                </div>
              </li>
              <li><Link href="/chats">Chat</Link></li>
              {currentUser.userRole === "Mentor" && (
                <>
                  <li><Link href="/menteeRequests">Requests</Link></li>
                  <li><Link href="/yourMentees">Your Mentees</Link></li>
                </>
              )}
              <li><Link href="/contactForm">Contact Us</Link></li>
              <li className={styles.dropdown}>
                <a className={styles.dropdownToggle}>{currentUser.userName}</a>
                <div className={styles.dropdownContent}>
                  <Link href="/profile">Profile</Link>
                  <Link href="/notifications">
                    Notifications <span className={styles.notificationBadge}>{unreadNotifications}</span>
                  </Link>
                  <Link href="/settings">Settings</Link>
                  <Link href="/logout">Logout</Link>
                </div>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
