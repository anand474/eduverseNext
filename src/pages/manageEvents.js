import { useState, useEffect } from "react";
import styles from "@/styles/ManageEvents.module.css";
import AdminHeader from "@/components/AdminHeader";
import EventModal from "@/components/EventModal";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userRole, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserRole = sessionStorage.getItem("userRole");

    if (!storedUserId || !storedUserRole) {
      alert("Please login to continue");
      window.location.href = "/login";
      return;
    }

    setRole(storedUserRole);
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userRole && userId) {
      fetchEvents();
    }
  }, [userRole, userId]);

  async function fetchEvents() {
    try {
      const response = await fetch(
        `/api/events?userRole=${userRole}&userId=${userId}`
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }

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
        setModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to create event:", errorData.error);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((event) => event.eid !== id));
      } else {
        console.error("Failed to delete event:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <AdminHeader />
      <div className={styles.manageEvents}>
        <h2 className="pageTitle">Manage Events</h2>
        <button
          className={styles.createEventButton}
          onClick={() => setModalOpen(true)}
        >
          Create Event
        </button>
        <table className={styles.eventTable}>
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Title</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.eid}>
                <td>{event.eid}</td>
                <td>{event.ename}</td>
                <td>{event.date}</td>
                <td>{event.start_time}</td>
                <td>{event.end_time}</td>
                <td>{event.place}</td>
                <td className={styles.actionsCell}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(event.eid)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateEvent}
        />
      </div>
    </>
  );
}
