import React from "react";
import "./css/MentorHomePage.css";
import Header from "./Header";

function MentorHomePage() {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        alert("Please login to continue");
        window.location.href = "/login";
        return
    }

    return (
        <>
            <Header />
            <div className="home-home-page text-home-center">
                <div className="home-welcome-section">
                    <h1 className="home-welcome-title">Welcome to Your Mentorship Dashboard</h1>
                    <p className="home-welcome-message">
                        As a mentor on EduVerse, you play a crucial role in guiding students and professionals toward success. Here, you can manage your mentoring activities, stay updated on upcoming sessions, and find the tools to make a real impact.
                    </p>
                    <div className="home-additional-content">
                        <p>
                            Here's what EduVerse offers to support you in your mentorship journey:
                        </p>
                        <ul>
                            <li><strong>Guide Mentees:</strong> Guide mentees in their areas of interest and connect with them via chat.</li>
                            <li><strong>Career Support:</strong> Share your expertise and help mentees thrive through groups and forums.</li>
                            <li><strong>Mentorship Events:</strong> Host or join upcoming workshops and discussions.</li>
                            <li><strong>Resources:</strong> Access tips, forums, groups, and articles.</li>
                            <li><strong>Collaborate:</strong> Connect with your mentees and fellow mentors to share ideas.</li>
                        </ul>
                    </div>
                </div>

                <div className="home-home-section home-upcoming-events">
                    <h2 className="home-h2">Recently Updated Events</h2>
                    <div className="home-event-card">
                        <p>Conference on AI - Oct 12, 2024</p>
                        <p>Workshop on Web Development - Nov 8, 2024</p>
                        <p>Data Science Summit - Dec 15, 2024</p>
                    </div>
                </div>

                <div className="home-home-section home-job-postings">
                    <h2 className="home-h2">Recently Posted Jobs</h2>
                    <div className="home-job-card">
                        <p>Full-Stack Developer at XYZ Company</p>
                        <p>Data Analyst at ABC Corp</p>
                        <p>Frontend Engineer at TechStart</p>
                    </div>
                </div>
                <div className="home-home-section home-quick-links">
                    <h2 className="home-h2">Quick Links</h2>
                    <div className="home-link-card">
                        <p><a href="/mentee-requests">View Mentorship Program Requests</a></p>
                        <p><a href="/your-mentees">Manage your Mentees</a></p>
                        <p><a href="/forums">Forums</a></p>
                        <p><a href="/groups">Groups</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MentorHomePage;