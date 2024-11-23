import React from "react";
import styles from "@/styles/Welcome.module.css";
import GuestHeader from "@/components/Header";
import Link from "next/link"; // Import Link component for navigation

export default function WelcomePage({ onProceedToLogin }) {
    return (
        <div className={styles.welcomePageContainer}>
            <GuestHeader />
            <div className={styles.welcomePage}>
                <div className={styles.headerText}>
                    <h1>Empowering Students and Academics for Success</h1>
                </div>
                <div className={styles.leftSection}>
                    <div className={`${styles.tile} ${styles.blackTile} ${styles.textCenter}`}>
                        <h2>Explore Opportunities</h2>
                        <p>Join Mentorship Program</p>
                    </div>
                    <div className={`${styles.tile} ${styles.whiteTile}`}>
                        <h2>Explore Career Development Resources</h2>
                        <p>Resume Builder Tool</p>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <div className={`${styles.tile} ${styles.whiteTile}`}>
                        <h2>Upcoming Academic Events</h2>
                        <p>Conferences</p>
                        <p>Workshops</p>
                    </div>
                    <div className={`${styles.tile} ${styles.blackTile}`}>
                        <h2>Join the Conversations</h2>
                        <p>Forums</p>
                        <p>Groups</p>
                    </div>
                </div>
                <div className={styles.loginMessage}>
                    <Link href="/login">Continue to Login</Link>
                </div>
            </div>
        </div>
    );
}