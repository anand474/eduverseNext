import React, { useState, useEffect } from "react";
import styles from "../styles/EventListing.module.css";
import { FaTrash, FaMapMarkerAlt } from "react-icons/fa";

export default function EventListing({ eid, title, location, date, startTime, endTime, description, link, onDelete, }) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  var mapUrl = "";

  if(location.toLowerCase() !== 'remote'){
    mapUrl = link;
    link = "";
  }

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

  const formattedDate = date ? new Date(date).toLocaleDateString("en-GB") : "";

  const timeRange = `${startTime || "N/A"} - ${endTime || "N/A"}`;

  const toggleMap = () => {
    setIsMapOpen(!isMapOpen);
  };

  const handleRegister = async () => {
    try {
      const userEmailData = {
        to: "anandmanohar023@gmail.com",
        subject: `Registration Confirmation for ${title}`,
        message: `You have successfully registered for the event: ${title} on ${formattedDate} from ${timeRange}, located at ${location}.`,
      };

      const adminEmailData = {
        to: "anandmanohar7@gmail.com",
        subject: `New Event Registration for ${title}`,
        message: `User ${userId} has registered for the event: ${title} on ${formattedDate} from ${timeRange}, located at ${location}.`,
      };

      await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userEmailData),
      });

      await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminEmailData),
      });

      alert(
        "You have successfully registered for the event. A confirmation email has been sent."
      );
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("An error occurred while registering for the event.");
    }
  };

  return (
    <div className={styles.eventCard}>
      <div className={styles.eventCardInfo}>
        <h3 className={styles.eventCardTitle}>{title}</h3>
        <p className={styles.eventCardLocation}>{location}</p>
        {link && (
          <p className={styles.eventCardLink}>
            <a href={link} rel="noopener noreferrer">
              Link for meeting
            </a>
          </p>
        )}
        <p className={styles.eventCardDate}>Date: {formattedDate}</p>
        <p className={styles.eventCardTime}>Time: {timeRange}</p>
      </div>

      <div className={styles.eventCardButtons}>
        {mapUrl ? (
          <FaMapMarkerAlt
            onClick={toggleMap}
            className={styles.eventMapIcon}
            title="Map"
          />
        ) : (
          <FaMapMarkerAlt className={styles.eventMapIconHide} title="Map" />
        )}
        <button
          className={styles.eventInterestedButton}
          onClick={handleRegister}
        >
          Register
        </button>
        {userRole !== "Student" && (
          <FaTrash
            onClick={() => onDelete(eid)}
            className={styles.eventDeleteIcon}
            title="Delete Event"
          />
        )}
      </div>

      {mapUrl && (
        <div
          className={`${styles.eventCardMapContainer} ${isMapOpen ? styles.open : ""
            }`}
        >
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