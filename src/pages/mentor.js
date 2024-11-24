import React, { useEffect, useState } from "react";
import styles from "@/styles/HomePage.module.css";
import Header from "@/components/Header";
import Link from "next/link";

export default function MentorHomePage() {
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
            Welcome to Your Mentorship Dashboard
          </h1>
          <p className={styles.welcomeMessage}>
            As a mentor on EduVerse, you play a crucial role in guiding students
            and professionals toward success. Here, you can manage your
            mentoring activities, stay updated on upcoming sessions, and find
            the tools to make a real impact.
          </p>
          <div className={styles.additionalContent}>
            <p>
              Here's what EduVerse offers to support you in your mentorship
              journey:
            </p>
            <ul>
              <li>
                <strong>Guide Mentees:</strong> Guide mentees in their areas of
                interest and connect with them via chat.
              </li>
              <li>
                <strong>Career Support:</strong> Share your expertise and help
                mentees thrive through groups and forums.
              </li>
              <li>
                <strong>Mentorship Events:</strong> Host or join upcoming
                workshops and discussions.
              </li>
              <li>
                <strong>Resources:</strong> Access tips, forums, groups, and
                articles.
              </li>
              <li>
                <strong>Collaborate:</strong> Connect with your mentees and
                fellow mentors to share ideas.
              </li>
            </ul>
          </div>
        </div>

        <div className={`${styles.homeSection} ${styles.upcomingEvents}`}>
          <h2 className={styles.homeH2}>Recently Updated Events</h2>
          {loadingEvents ? (
            <p>Loading events...</p>
          ) : events.length > 0 ? (
            <div className={styles.eventCard}>
              {events.map((event) => (
                <p key={event.eid}>{`${event.ename} - ${event.date}`}</p>
              ))}
            </div>
          ) : (
            <p>
              No events have been created yet. You'll soon see them as they are
              added.
            </p>
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
            <p>No job postings yet. You'll soon see them as they are added.</p>
          )}
        </div>

        <div className={`${styles.homeSection} ${styles.quickLinks}`}>
          <h2 className={styles.homeH2}>Quick Links</h2>
          <div className={styles.linkCard}>
            <p>
              <Link href="/menteeRequests">
                View Mentorship Program Requests
              </Link>
            </p>
            <p>
              <Link href="/yourMentees">Manage your Mentees</Link>
            </p>
            <p>
              <Link href="/forums">Forums</Link>
            </p>
            <p>
              <Link href="/groups">Groups</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
