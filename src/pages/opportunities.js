import React, { useState, useEffect } from "react";
import Header from "../components/Header"; 
import SearchBar from "../components/SearchBar"; 
import JobListing from "../components/JobListing"; 
import styles from "../styles/Opportunities.module.css"; 
import { useRouter } from 'next/router';

export default function Opportunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobListings, setJobListings] = useState([
    {
      title: "Data Analyst",
      company: "PayCom Inc.",
      location: "Boston, VA",
      description: "Data Analyst for Human Resources based applications",
      type: "Full-Time",
      link: "#"
    },
    {
      title: "Graduate Internship",
      company: "Salesforce",
      location: "Dallas, TX",
      description: "New Grad Intern",
      type: "Internship",
      link: "#"
    },
    {
      title: "Software Developer",
      company: "Google",
      location: "Arlington, VA",
      description: "Entry Level Developer",
      type: "Full-Time",
      link: "#"
    },
    {
      title: "Software Development Engineer",
      company: "Microsoft",
      location: "Arlington, VA",
      description: "Developer with minimum one year experience",
      type: "Full-Time",
      link: "#"
    },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", company: "", location: "", description: "", link: "", type: "" });

  const router = useRouter();
  const [userId, setUserId] = useState(null); 
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = sessionStorage.getItem("userId");
      const role = sessionStorage.getItem("userRole");
      
      if (!userId) {
        alert("Please login to continue");
        router.push("/login");
      }
      setUserId(userId);
      setUserRole(role);
    }
  }, [router]);

  const filteredListings = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (index) => {
    setJobListings((prevListings) => prevListings.filter((_, i) => i !== index));
  };

  const handleCreateOpportunity = (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.description || !newJob.link || !newJob.type) {
      alert("Please fill in all fields.");
      return;
    }

    setJobListings((prev) => [...prev, newJob]);
    setModalOpen(false);
    setNewJob({ title: "", company: "", location: "", description: "", link: "", type: "" });
  };

  return (
    <>
      <Header />
      <div className={styles.opportunityOpportunities}>
        <h2 className="pageTitle">Opportunities</h2>
        <SearchBar onSearch={setSearchTerm} />
        {userRole !== "Student" && (
          <button className={styles.createOpportunityButton} onClick={() => setModalOpen(true)}>
            Create Opportunity
          </button>
        )}
        <div className={styles.opportunityJobListings}>
          {filteredListings.map((job, index) => (
            <JobListing
              key={index}
              title={job.title}
              company={job.company}
              location={job.location}
              description={job.description}
              link={job.link}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
        {isModalOpen && (
          <div className={styles.oppModalOverlay}>
            <div className={styles.oppModalContent}>
              <form onSubmit={handleCreateOpportunity}>
                <h2>Create Opportunity</h2>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  required
                />
                <select
                  value={newJob.type}
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                  required
                >
                  <option value="">Select Opportunity Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Internship">Internship</option>
                </select>
                <input
                  type="text"
                  placeholder="Location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Job Link"
                  value={newJob.link}
                  onChange={(e) => setNewJob({ ...newJob, link: e.target.value })}
                  required
                />

                <button type="submit" className={styles.oppCreateButton}>Create</button>
                <button type="button" onClick={() => setModalOpen(false)} className={styles.oppCancelButton}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}