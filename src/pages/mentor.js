import React, { useEffect, useState } from "react";
import styles from "@/styles/HomePage.module.css";
import Header from "@/components/Header";
import Link from "next/link";

export default function MentorHomePage() {
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        const storedUserRole = sessionStorage.getItem("userRole");

        if (!storedUserId) {
            alert("Please login to continue");
            window.location.href = "/login";
        } else {
            setUserId(storedUserId);
            setUserRole(storedUserRole);
        }
    }, []);

    return (
        <>
            <Header />
            <div className={`${styles.homePage} ${styles.textCenter}`}>
                <div className={styles.welcomeSection}>
                    <h1 className={styles.welcomeTitle}>Welcome to Your Mentorship Dashboard</h1>
                    <p className={styles.welcomeMessage}>
                        As a mentor on EduVerse, you play a crucial role in guiding students and professionals toward success. Here, you can manage your mentoring activities, stay updated on upcoming sessions, and find the tools to make a real impact.
                    </p>
                    <div className={styles.additionalContent}>
                        <p>Here's what EduVerse offers to support you in your mentorship journey:</p>
                        <ul>
                            <li><strong>Guide Mentees:</strong> Guide mentees in their areas of interest and connect with them via chat.</li>
                            <li><strong>Career Support:</strong> Share your expertise and help mentees thrive through groups and forums.</li>
                            <li><strong>Mentorship Events:</strong> Host or join upcoming workshops and discussions.</li>
                            <li><strong>Resources:</strong> Access tips, forums, groups, and articles.</li>
                            <li><strong>Collaborate:</strong> Connect with your mentees and fellow mentors to share ideas.</li>
                        </ul>
                    </div>
                </div>

                <div className={`${styles.homeSection} ${styles.upcomingEvents}`}>
                    <h2 className={styles.homeH2}>Recently Updated Events</h2>
                    <div className={styles.eventCard}>
                        <p>Conference on AI - Oct 12, 2024</p>
                        <p>Workshop on Web Development - Nov 8, 2024</p>
                        <p>Data Science Summit - Dec 15, 2024</p>
                    </div>
                </div>

                <div className={`${styles.homeSection} ${styles.jobPostings}`}>
                    <h2 className={styles.homeH2}>Recently Posted Jobs</h2>
                    <div className={styles.jobCard}>
                        <p>Full-Stack Developer at XYZ Company</p>
                        <p>Data Analyst at ABC Corp</p>
                        <p>Frontend Engineer at TechStart</p>
                    </div>
                </div>

                <div className={`${styles.homeSection} ${styles.quickLinks}`}>
                    <h2 className={styles.homeH2}>Quick Links</h2>
                    <div className={styles.linkCard}>
                        <p><Link href="/menteeRequests">View Mentorship Program Requests</Link></p>
                        <p><Link href="/yourMentees">Manage your Mentees</Link></p>
                        <p><Link href="/forums">Forums</Link></p>
                        <p><Link href="/groups">Groups</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
}