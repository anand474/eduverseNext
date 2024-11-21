// Frontend: pages/mentorship.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import styles from "../styles/MentorshipProgram.module.css";

export default function MentorshipProgram() {
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mentor, setMentor] = useState("");
  const [reason, setReason] = useState("");
  const [mentors, setMentors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      router.push("/login");
    }
    const fetchMentors = async () => {
      try {
        const response = await fetch(`/api/mentors`);
        if (response.ok) {
          const data = await response.json();
          setMentors(data);
        }
      } catch (error) {}
    };

    fetchMentors();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      studentId: sessionStorage.getItem("userId"),
      mentorId: mentor,
      emailId: email,
      phoneNo: phone,
      reason,
      isAccepted: 0,
    };

    try {
      const response = await fetch("/api/mentorship-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("Your mentorship request has been submitted!");
        setStudentName("");
        setEmail("");
        setPhone("");
        setMentor("");
        setReason("");
      } else {
        alert("Failed to submit your request. Please try again later.");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.mentorshipMessage}>
        <h2 className="pageTitle">Take Your Career to the Next Level!</h2>
        <p>
          Are you passionate about technology, business, or any other field? Join our Mentorship Program to connect with
          experienced professionals who can guide you through your career journey. Whether you're looking to improve your
          skills, network with industry experts, or get personalized career advice, this program is tailored to support
          your goals. Don't miss out on this opportunity to fast-track your success!
        </p>
      </div>

      <form className={styles.mentorshipFormContainer} onSubmit={handleSubmit}>
        <h2 className={styles.mentorshipFormHeading}>Mentorship Program Application</h2>

        <label className={styles.mentorshipFormLabel} htmlFor="studentName">Student Name</label>
        <input
          className={styles.mentorshipFormInput}
          type="text"
          id="studentName"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />

        <label className={styles.mentorshipFormLabel} htmlFor="email">Email</label>
        <input
          className={styles.mentorshipFormInput}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className={styles.mentorshipFormLabel} htmlFor="phone">Phone</label>
        <input
          className={styles.mentorshipFormInput}
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          pattern="[0-9]{10}"
          title="Phone number must be exactly 10 digits."
          required
        />

        <label className={styles.mentorshipFormLabel} htmlFor="mentor">Select Mentor</label>
        <select
          className={styles.mentorshipFormSelect}
          id="mentor"
          value={mentor}
          onChange={(e) => setMentor(e.target.value)}
          required
        >
          <option value="">-- Select Mentor --</option>
          {mentors.map((mentor) => (
            <option key={mentor.fullName} value={mentor.fullName}>
              {mentor.fullName}
            </option>
          ))}
        </select>

        <label className={styles.mentorshipFormLabel} htmlFor="reason">Why do you want to choose this mentor? What guidance/support do you need?</label>
        <textarea
          className={styles.mentorshipFormTextarea}
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="4"
          required
        ></textarea>

        <button className={styles.mentorshipFormSubmit} type="submit">Submit</button>
      </form>
    </>
  );
}
