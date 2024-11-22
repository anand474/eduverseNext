import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import EventListing from "../components/EventListing";
import EventModal from "../components/EventModal";
import styles from "../styles/Events.module.css";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      fetchEvents(storedUserId, storedUserRole);
    }
  }, []);

  const fetchEvents = async (userId, userRole) => {
    try {
      const response = await fetch(`/api/events?userId=${userId}&userRole=${userRole}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCreateEvent = async (newEvent) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newEvent,
          uid: userId,
          link: newEvent.link || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvents([...events, { eid: data.id, ...newEvent }]);
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to create event:", errorData.error);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteEvent = async (eid) => {
    let flag = window.confirm("Are you sure you want to delete this event?");
    if (flag) {
      alert("Delete");
    }
  }

  const filteredEvents = events.filter(
    (event) =>
      (event.ename &&
        event.ename.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.place &&
        event.place.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  console.log("filteredEvents:", filteredEvents);

  return (
    <>
      <Header />
      <div className={styles.events}>
        <h2 className="pageTitle">Events</h2>
        <SearchBar onSearch={setSearchTerm} />
        {userRole !== "Student" && (
          <div className={styles.buttonCenter}>
            <button
              className={styles.createEventButton}
              onClick={() => setIsModalOpen(true)}
            >
              Create Event
            </button>
          </div>
        )}
        <div className={styles.eventListings}>
          {filteredEvents.map((event) => (
            <EventListing
              key={event.eid}
              title={event.ename}
              location={event.place}
              date={event.date}
              startTime={event.start_time}
              endTime={event.end_time}
              description={event.description}
              link={event.link}
              onDelete={() => handleDeleteEvent(event.eid)}
            />
          ))}
        </div>
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateEvent}
        />
      </div>
    </>
  );
}
