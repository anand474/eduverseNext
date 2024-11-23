import { useState, useEffect } from "react";
import styles from "../styles/HomePage.module.css";
import Header from "../components/Header";

export default function HomePage() {
  const [jobPostings, setJobPostings] = useState([]);
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");
    if (!userId) {
      alert("Please login to continue");
      window.location.href = "/login";
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/opportunities?userId=${userId}&userRole=${userRole}`);
        if (response.ok) {
          const jobs = await response.json();
          setJobPostings(jobs);
        } else {
          console.error("Failed to fetch job postings");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events?userId=${userId}&userRole=${userRole}`);
        if (response.ok) {
          const eventData = await response.json();
          setEvents(eventData);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchJobs();
    fetchEvents();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.homePage}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Welcome to EduVerse</h1>
          <p className={styles.welcomeMessage}>
            EduVerse is your one-stop platform for connecting students,
            academics, and professionals in the academic world.
          </p>
          <div className={styles.additionalContent}>
            <p>At EduVerse, you'll find everything you need to succeed:</p>
            <ul>
              <li>Networking: Join interest-based groups and forums.</li>
              <li>Opportunities: Browse job postings and internships.</li>
              <li>Academic Events: Participate in workshops and conferences.</li>
              <li>Career Resources: Build resumes and receive guidance.</li>
              <li>Mentorship: Connect with mentors for career support.</li>
            </ul>
          </div>
        </div>
        <div className={styles.homeSection}>
          <h2 className={styles.homeH2}>Upcoming Events</h2>
          <div className={styles.eventCard}>
            {events.length > 0 ? (
              events.slice(0, 5).map((event) => (
                <div key={event.eid} className={styles.eventItem}>
                  <p>
                    <strong>{event.ename}</strong> - {event.place} -{" "}
                    {new Date(event.date).toLocaleDateString()} from{" "}
                    {new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to{" "}
                    {new Date(`1970-01-01T${event.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                      View Details
                    </a>
                  </p>

                </div>
              ))
            ) : (
              <p>No upcoming events at the moment.</p>
            )}
          </div>
        </div>
        <div className={styles.homeSection}>
          <h2 className={styles.homeH2}>Recent Job Postings</h2>
          <div className={styles.jobCard}>
            {jobPostings.length > 0 ? (
              jobPostings.slice(0, 5).map((job) => (
                <div key={job.oid} className={styles.jobItem}>
                  <p>
                    <strong>{job.oname}</strong> at {job.company} [{job.location}]
                  </p>
                </div>
              ))
            ) : (
              <p>No job postings available at the moment.</p>
            )}
          </div>
        </div>
        <div className={styles.homeSection}>
          <h2 className={styles.homeH2}>Quick Links</h2>
          <div className={styles.linkCard}>
            <p>
              <a href="/mentorship-program">Join Mentorship Program</a>
            </p>
            <p>
              <a href="/build-resume">Build your Resume</a>
            </p>
            <p>
              <a href="/forums">Forums</a>
            </p>
            <p>
              <a href="/groups">Groups</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
