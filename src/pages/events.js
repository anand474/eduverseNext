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
  const [userName,setUserName] = useState(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserRole = sessionStorage.getItem("userRole");
    const userName = sessionStorage.getItem("userName");

    if (!storedUserId) {
      alert("Please login to continue");
      window.location.href = "/login";
    } else {
      setUserId(storedUserId);
      setUserRole(storedUserRole);
      setUserName(userName);
      fetchEvents(storedUserId, storedUserRole);
    }
  }, []);

  const fetchEvents = async (userId, userRole) => {
    try {
      const response = await fetch(
        `/api/events?userId=${userId}&userRole=${userRole}`
      );
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
        // setEvents([...events, { eid: data.id, ...newEvent }]);
        fetchEvents(userId, userRole);
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to create event:", errorData.error);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  const handleRegister = async (eid,title,formattedDate,timeRange,location,userId,eventuid) => {
    try {
      const emailResponse = await fetch(`/api/registerEvent?userId=${userId}`);
      const emailData = await emailResponse.json();
      const adminId=eventuid;
      const emailResponse1 = await fetch(`/api/registerEvent?userId=${adminId}`);
      const emailData1 = await emailResponse1.json();
  
      if (emailResponse.ok && emailResponse1.ok) {
        const userEmail = emailData.emailId;
        const adminEmail = emailData1.emailId;
      const userEmailData = {
        to: userEmail,
        subject: `Registration Confirmation for ${title}`,
        message: `You have successfully registered for the event: ${title} on ${formattedDate} from ${timeRange}, located at ${location}.`,
      };

      const adminEmailData = {
        to: adminEmail,
        subject: `New Event Registration for ${title}`,
        message: `User ${userName} has registered for the event: ${title} on ${formattedDate} from ${timeRange}, located at ${location}.`,
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
      const response = await fetch("/api/registerEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          eid: eid, 
        }),
      });
      const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to register for the event");
    }
  }else{
    throw new Error("Failed to fetch user email");
  }
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("An error occurred while registering for the event.");
    }
  };


  const handleDeleteEvent = async (id) => {
    let flag = window.confirm("Are you sure you want to delete this event?");
    if (flag) {
      try {
        const response = await fetch(`/api/events?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchEvents(userId, userRole);
        } else {
          alert("Failed to delete event");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      (event.ename &&
        event.ename.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.place &&
        event.place.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              title="Use the Embedded code option for the Google Maps link when adding a location."
              
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
              uid={event.uid}
              onDelete={() => handleDeleteEvent(event.eid)}
              onRegister={() => handleRegister(event.eid,event.ename,event.date ? new Date(event.date).toLocaleDateString("en-GB") : "",event.start_time,event.place,userId,event.uid)}
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
