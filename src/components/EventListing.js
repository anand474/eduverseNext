import React, { useState, useEffect } from "react";
import styles from "../styles/EventListing.module.css";
import { FaTrash, FaMapMarkerAlt } from "react-icons/fa";

export default function EventListing({ title, location, date, time, link, mapUrl, onDelete, index }) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const toggleMap = () => {
    setIsMapOpen(!isMapOpen);
  };

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
    <div className={styles.eventCard}>
      <div className={styles.eventCardInfo}>
        <h3 className={styles.eventCardTitle}>{title}</h3>
        <p className={styles.eventCardLocation}>{location}</p>
        {link && (
          <p className={styles.eventCardLink}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              Link for meeting
            </a>
          </p>
        )}
        <p className={styles.eventCardDate}>Date: {date}</p>
        <p className={styles.eventCardTime}>Time: {time}</p>
      </div>

      <div className={styles.eventCardButtons}>
        {mapUrl ? (
          <FaMapMarkerAlt onClick={toggleMap} className={styles.eventMapIcon} title="Map" />
        ) : (
          <FaMapMarkerAlt className={styles.eventMapIconHide} title="Map" />
        )}
        <button className={styles.eventInterestedButton}>Register</button>
        {(userRole !== "Student") && (
          <FaTrash onClick={() => onDelete(index)} className={styles.eventDeleteIcon} title="Delete Event" />
        )}
      </div>
      {mapUrl && (
        <div className={`${styles.eventCardMapContainer} ${isMapOpen ? styles.open : ""}`}>
          <h4>Location Map</h4>
          <iframe
            title="Event Location"
            src={mapUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}
    </div>
  );
}