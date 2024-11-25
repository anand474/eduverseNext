import React, { useEffect, useState } from "react";
import styles from "@/styles/HomePage.module.css";
import Header from "@/components/Header";
import Link from "next/link";

export default function AdvisorHomePage() {
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [events, setEvents] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingJobs, setLoadingJobs] = useState(true);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        const storedUserRole = sessionStorage.getItem("userRole");

        if (!storedUserId) {
            alert("Please login to continue");
            window.location.href = "/login";
        } else {
            setUserId(storedUserId);
            setUserRole(storedUserRole);
            fetchEvents(storedUserId, storedUserRole);
            fetchJobs(storedUserId, storedUserRole);
        }
    }, []);

    const fetchEvents = async (userId, userRole) => {
        try {
            const response = await fetch(
                `/api/events?userId=${userId}&userRole=${userRole}`
            );
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                console.error("Failed to fetch events:", await response.text());
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoadingEvents(false);
        }
    };

    const fetchJobs = async (userId, userRole) => {
        try {
            const response = await fetch(
                `/api/opportunities?userId=${userId}&userRole=${userRole}`
            );
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            } else {
                const errorData = await response.json();
                console.error("Error fetching job listings:", errorData.error);
            }
        } catch (error) {
            console.error("Error fetching job listings:", error);
        } finally {
            setLoadingJobs(false);
        }
    };

    return (
        <>
            <Header />
            <div className={`${styles.homePage} ${styles.textCenter}`}>
                <div className={styles.welcomeSection}>
                    <h1 className={styles.welcomeTitle}>
                        Welcome to Your Advisor Dashboard
                    </h1>
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
                    {loadingEvents ? (
                        <p>Loading events...</p>
                    ) : events.length > 0 ? (
                        <div className={styles.eventCard}>
                            {events.map((event) => {
                                const adjustTimestamp = new Date(new Date(event.date).setHours(new Date(event.date).getHours() - 6)).toDateString() ;
                                return (
                                    <p key={event.eid}>{`${event.ename} - ${adjustTimestamp}`}</p>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No events available at the moment</p>
                    )}
                </div>

                <div className={`${styles.homeSection} ${styles.jobPostings}`}>
                    <h2 className={styles.homeH2}>Recently Posted Jobs</h2>
                    {loadingJobs ? (
                        <p>Loading jobs...</p>
                    ) : jobs.length > 0 ? (
                        <div className={styles.jobCard}>
                            {jobs.map((job) => (
                                <p key={job.oid}>{`${job.oname} at ${job.company}`}</p>
                            ))}
                        </div>
                    ) : (
                        <p>No job postings available at the moment</p>
                    )}
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