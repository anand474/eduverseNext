import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import styles from "@/styles/ManageOpportunities.module.css";

export default function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    description: "",
    link: "",
  });

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      window.location.href = "/login";
    } else {
      fetchOpportunities();
    }
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch("/api/opportunities");
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      } else {
        console.error("Failed to fetch opportunities");
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`/api/opportunities?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOpportunities((prev) =>
          prev.filter((opportunity) => opportunity.oid !== id)
        );
      } else {
        console.error("Failed to delete opportunity");
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error);
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    if (
      !newJob.title ||
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
          title: newJob.title,
          company: newJob.company,
          location: newJob.location,
          type: newJob.type,
          description: newJob.description,
          link: newJob.link,
          uid: sessionStorage.getItem("userId") || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOpportunities((prev) => [...prev, { ...newJob, oid: data.id }]);
        setModalOpen(false);
        setNewJob({
          title: "",
          company: "",
          location: "",
          description: "",
          link: "",
          type: "",
        });
      } else {
        console.error("Failed to create opportunity");
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className={styles.manageOpportunities}>
        <h2 className="pageTitle">Manage Opportunities</h2>
        <button
          className={styles.createOpportunityButton}
          onClick={() => setModalOpen(true)}
        >
          Create Opportunity
        </button>
        <table className={styles.opportunityTable}>
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => (
              <tr key={opportunity.oid}>
                <td>{opportunity.oid}</td>
                <td>{opportunity.oname}</td>
                <td>{opportunity.company}</td>
                <td>{opportunity.location}</td>
                <td>{opportunity.type}</td>
                <td className={styles.actionsCell}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(opportunity.oid)}
                  >
                    {" "}
                    Delete{" "}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <div className={styles.oppModalOverlay}>
            <div className={styles.oppModalContent}>
              <h2>Create Opportunity</h2>
              <form onSubmit={handleCreateOpportunity}>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={newJob.title}
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
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
                ></textarea>
                <input
                  type="text"
                  placeholder="Link"
                  value={newJob.link}
                  onChange={(e) =>
                    setNewJob({ ...newJob, link: e.target.value })
                  }
                  required
                />
                <button type="submit">Submit</button>
                <button
                  type="button"
                  className={styles.oppCancelButton}
                  onClick={() => setModalOpen(false)}
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
