import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import styles from "../styles/JobListing.module.css";

export default function JobListing({ title, company, location, description, link, onDelete }) {

  const [userRole, setUserRole] = useState();
  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);
  }, []);
  return (
    <div className={styles.jobCard}>
      <div className={styles.buttonContainer}>
        <a href={link} target="_blank" rel="noopener noreferrer" className={styles.interestedButton}>
          {(userRole == "Student" ? "Interested" : "View")}
        </a>
        {typeof window !== "undefined" && sessionStorage.getItem("userRole") !== "Student" && (
          <button className={styles.deleteButton} onClick={onDelete}>
            <FaTrash />
          </button>
        )}
      </div>

      <div className={styles.jobCardInfo}>
        <h3 className={styles.jobCardTitle}>{title}</h3>
        <a href="#" className={styles.company}>
          {company}
        </a>
        <p className={styles.description}>{description}</p>
        <p className={styles.location}>{location}</p>
      </div>
    </div>
  );
}