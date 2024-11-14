import React, { useState } from "react";
import styles from "../styles/Events.module.css";

export default function EventModal({ isOpen, onClose, onCreate }) {
  const [ename, setEname] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ename || !place || !date || !start_time || !end_time || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    onCreate({ ename, place, date, start_time, end_time, description, link });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setEname("");
    setPlace("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setLink("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.eventModalOverlay}>
      <div className={styles.eventModalContent}>
        <h2 className={styles.eventCenter}>Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Title"
            value={ename}
            onChange={(e) => setEname(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
          <input
            type="time"
            placeholder="Start Time (e.g., 09:00)"
            value={start_time}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <input
            type="time"
            placeholder="End Time (e.g., 17:00)"
            value={end_time}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.sameSizeField}
            required
          />
          <input
            type="url"
            placeholder="Link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={styles.sameSizeField}
          />
          <button type="submit" className={styles.eventModalSubmitButton}>
            Create Event
          </button>
          <button
            type="button"
            onClick={handleClose}
            className={styles.eventModalCloseButton}
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
}
