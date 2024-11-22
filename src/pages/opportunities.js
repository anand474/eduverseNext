import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import JobListing from "../components/JobListing";
import styles from "../styles/Opportunities.module.css";
import { useRouter } from "next/router";

export default function Opportunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobListings, setJobListings] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    oname: "",
    company: "",
    location: "",
    description: "",
    link: "",
    type: "",
  });

  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = sessionStorage.getItem("userId");
      const userRole = sessionStorage.getItem("userRole");

      if (!userId) {
        alert("Please login to continue");
        router.push("/login");
      } else {
        setUserId(userId);
        setUserRole(userRole);
        fetchJobListings(userId, userRole);
      }
    }
  }, [router]);

  const fetchJobListings = async (userId, userRole) => {
    try {
      const response = await fetch(`/api/opportunities?userId=${userId}&userRole=${userRole}`);

      if (response.ok) {
        const data = await response.json();
        console.log("Opportunities fetched.", data);
        setJobListings(data);
      } else {
        const errorData = await response.json();
        console.error("Error fetching job listings:", errorData.error);
      }
    } catch (error) {
      console.error("Error fetching job listings:", error);
    }
  };

  const filteredListings = jobListings.filter(
    (job) =>
      (job.oname &&
        job.oname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.company &&
        job.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id) => {
    let flag = window.confirm("Are you sure you want to delete this opportunity?");
    if (flag) {
      try {
        const response = await fetch(`/api/opportunities?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setJobListings((prevListings) =>
            prevListings.filter((job) => job.id !== id)
          );
        } else {
          alert("Failed to delete opportunity");
        }
      } catch (error) {
        console.error("Error deleting opportunity:", error);
      }
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();

    if (
      !newJob.oname ||
      !newJob.company ||
      !newJob.location ||
      !newJob.description ||
      !newJob.link ||
      !newJob.type
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oname: newJob.oname,
          company: newJob.company,
          location: newJob.location,
          type: newJob.type,
          description: newJob.description,
          link: newJob.link,
          uid: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setJobListings((prev) => [...prev, { ...newJob, id: data.id }]);
        setModalOpen(false);
        setNewJob({
          oname: "",
          company: "",
          location: "",
          description: "",
          link: "",
          type: "",
        });
      } else {
        alert(data.error || "Failed to create opportunity");
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
      alert("An error occurred while creating the opportunity");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.opportunityOpportunities}>
        <h2 className="pageTitle">Opportunities</h2>
        <SearchBar onSearch={setSearchTerm} />
        {userRole !== "Student" && (
          <button
            className={styles.createOpportunityButton}
            onClick={() => setModalOpen(true)}
          >
            Create Opportunity
          </button>
        )}
        <div className={styles.opportunityJobListings}>
          {filteredListings.map((job) => (
            <JobListing
              key={job.oid}
              oname={job.oname}
              company={job.company}
              location={job.location}
              description={job.description}
              link={job.link}
              onDelete={() => {
                console.log(`Deleting job with ID: ${job.oid}`);
                handleDelete(job.oid);
              }}
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
                  value={newJob.oname}
                  onChange={(e) =>
                    setNewJob({ ...newJob, oname: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newJob.company}
                  onChange={(e) =>
                    setNewJob({ ...newJob, company: e.target.value })
                  }
                  required
                />
                <select
                  value={newJob.type}
                  onChange={(e) =>
                    setNewJob({ ...newJob, type: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewJob({ ...newJob, location: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Job Link"
                  value={newJob.link}
                  onChange={(e) =>
                    setNewJob({ ...newJob, link: e.target.value })
                  }
                  required
                />

                <button type="submit" className={styles.oppCreateButton}>
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={styles.oppCancelButton}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
