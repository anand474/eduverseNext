import { useEffect, useState } from "react";
import styles from "@/styles/HomePage.module.css";
import AdminHeader from "@/components/AdminHeader";
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
            <AdminHeader />
            <div className={`${styles.homePage} ${styles.textCenter}`}>
                <div className={styles.welcomeSection}>
                    <h1 className='pageTitle'>Welcome to Your Admin Dashboard</h1>
                    <p className={styles.welcomeMessage}>
                        As an admin on EduVerse, you play a crucial role in managing the platform. Here, you can oversee users, manage content, and facilitate events that enhance the community experience.
                    </p>
                    <div className={styles.additionalContent}>
                        <p>What you can do:</p>
                        <ul>
                            <li><strong>Assign Roles:</strong> Assign roles to newly added users in the user requests section.</li>
                            <li><strong>Answer User Questions:</strong> Respond to inquiries submitted through the Contact Us form.</li>
                            <li><strong>Manage Resources:</strong> Oversee all resources, events, and opportunities available on the platform.</li>
                            <li><strong>Manage User Credentials:</strong> Update or reset user credentials as necessary.</li>
                            <li><strong>Connect via Chat:</strong> Communicate with users and other admins through the chat feature.</li>
                        </ul>
                    </div>
                </div>

                <div className={`${styles.homeSection} ${styles.quickLinks}`}>
                    <h2 className={styles.homeH2}>Quick Links</h2>
                    <div className={styles.linkCard}>
                        <p><Link href="/chats">Chat</Link></p>
                        <p><Link href="/manageEvents">Events</Link></p>
                        <p><Link href="/manageForums">Forums</Link></p>
                        <p><Link href="/manageGroups">Groups</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
}