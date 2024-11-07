import React, { useEffect } from "react";
import styles from "../styles/HomePage.module.css";
import Header from "../components/Header";

export default function HomePage() {
  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      window.location.href = "/login";
    }
  }, []);

  return (
    <>
      <Header />
      <div className={`${styles.homePage} ${styles.textCenter}`}>
        <div>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Welcome to EduVerse</h1>
          <p className={styles.welcomeMessage}>
            EduVerse is your one-stop platform for connecting students, academics, and professionals in the academic world.
          </p>
          <div className={styles.additionalContent}>
            <p>At EduVerse, you'll find everything you need to succeed:</p>
            <ul>
              <li><strong>Networking:</strong> Join interest-based groups and forums.</li>
              <li><strong>Opportunities:</strong> Browse job postings and internships.</li>
              <li><strong>Academic Events:</strong> Participate in workshops and conferences.</li>
              <li><strong>Career Resources:</strong> Build resumes and receive guidance.</li>
              <li><strong>Mentorship:</strong> Connect with mentors for career support.</li>
            </ul>
          </div>
        </div>
        </div>

        <div className={`${styles.homeSection} ${styles.upcomingEvents}`}>
          <h2 className={styles.homeH2}>Upcoming Events</h2>
          <div className={styles.eventCard}>
            <p>Conference on AI - Oct 12, 2024</p>
            <p>Workshop on Web Development - Nov 8, 2024</p>
            <p>Data Science Summit - Dec 15, 2024</p>
          </div>
        </div>

        <div className={`${styles.homeSection} ${styles.jobPostings}`}>
          <h2 className={styles.homeH2}>Recent Job Postings</h2>
          <div className={styles.jobCard}>
            <p>Full-Stack Developer at XYZ Company</p>
            <p>Data Analyst at ABC Corp</p>
            <p>Frontend Engineer at TechStart</p>
          </div>
        </div>

        <div className={`${styles.homeSection} ${styles.quickLinks}`}>
          <h2 className={styles.homeH2}>Quick Links</h2>
          <div className={styles.linkCard}>
            <p><a href="/mentorship-program">Join Mentorship Program</a></p>
            <p><a href="/build-resume">Build your Resume</a></p>
            <p><a href="/forums">Forums</a></p>
            <p><a href="/groups">Groups</a></p>
          </div>
        </div>
      </div>
    </>
  );
}