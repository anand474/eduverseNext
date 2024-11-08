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
                    <h1 className='pageTitle'>Welcome to Your Advisor Dashboard</h1>
                    <p className={styles.welcomeMessage}>
                        As an advisor on EduVerse, you have the power to shape academic and professional paths. Here, you can create opportunities, guide mentors, and manage key resources that support students' success.
                    </p>
                    <div className={styles.additionalContent}>
                        <p>What you can do:</p>
                        <ul>
                            <li><strong>Create Events:</strong> Organize events, workshops, or conferences to provide guidance and opportunities for growth.</li>
                            <li><strong>Create Groups and Forums:</strong> Set up spaces for discussions on various academic or career topics.</li>
                            <li><strong>Guide Mentors:</strong> Assist mentors in supporting students and offering the best possible advice.</li>
                            <li><strong>Chat with Anyone:</strong> Connect with students, mentors, or other advisors across the platform.</li>
                            <li><strong>Manage Tips and Articles:</strong> Curate and oversee content that offers valuable insights to both students and mentors.</li>
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
                        <p><Link href="/chats">Chat</Link></p>
                        <p><Link href="/events">Events</Link></p>
                        <p><Link href="/forums">Forums</Link></p>
                        <p><Link href="/groups">Groups</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
}