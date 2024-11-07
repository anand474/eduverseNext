import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Header.module.css";
import { users } from "@/data/loadData";

export default function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  
  const restrictedPaths = ["/login", "/register", "/forgotPassword", "/contactForm", "/"];
  const contactPath = ["/login", "/register", "/forgotPassword", "/"];
  
  const isContactPage = contactPath.includes(router.pathname);
  const isRestrictedPage = restrictedPaths.includes(router.pathname);
  
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      const user = users[userId];
      setCurrentUser(user || null);
    }
  }, []);

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
                  currentUser.user_type === "Mentor" ? "/mentor" :
                  currentUser.user_type === "Advisor" ? "/advisor" :
                  currentUser.user_type === "Admin" ? "/admin" :
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
                  {currentUser.user_type === "Student" && (
                    <Link href="/mentorshipProgram">Mentorship Program</Link>
                  )}
                  <div className={styles.nestedDropdown}>
                    <a className={styles.dropdownToggle}>Career Development</a>
                    <div className={styles.nestedContent}>
                      <Link href="/articles">Articles</Link>
                      <Link href="/tips">Tips</Link>
                      {currentUser.user_type === "Student" && (
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
              {currentUser.user_type === "Mentor" && (
                <>
                  <li><Link href="/mentee-requests">Requests</Link></li>
                  <li><Link href="/your-mentees">Your Mentees</Link></li>
                </>
              )}
              <li><Link href="/contactForm">Contact Us</Link></li>
              <li className={styles.dropdown}>
                <a className={styles.dropdownToggle}>{currentUser.user_name}</a>
                <div className={styles.dropdownContent}>
                  <Link href="/profile">Profile</Link>
                  <Link href="/notifications">
                    Notifications <span className={styles.notificationBadge}>4</span>
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