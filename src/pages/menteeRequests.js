import { useState, useEffect } from "react";
import styles from "@/styles/MenteeRequests.module.css";
import Header from "@/components/Header";

export default function MentorshipRequests() {
  const [requests, setRequests] = useState([]);
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

    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/mentorship-requests?mentorId=${storedUserId}`);
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        } else {
          alert("Failed to fetch mentorship requests");
        }
      } catch (error) {
        alert("An error occurred while fetching mentorship requests.");
      }
    };

    if (storedUserId) {
      fetchRequests();
    }
  }, [userId]);

  const acceptRequest = async (id) => {
    const acceptedRequest = requests.find(request => request.studentId === id);
    try {
      const response = await fetch(`/api/mentorship-requests`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          isAccepted: 1,
        }),
      });
      
      if (response.ok) {
        alert(`Request from ${acceptedRequest.studentName} has been accepted!`);
        setRequests((prevRequests) => prevRequests.filter((req) => req.studentId !== id));

      } else {
        alert("Failed to accept request");
      }
    } catch (error) {
      alert("An error occurred while accepting the request.");
    }
  };
  
  const deleteRequest = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this request?");
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await fetch(`/api/mentorship-requests`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        setRequests(requests.filter(request => request.studentId !== id));
        alert("Request has been deleted.");
      } else {
        alert("Failed to delete request.");
      }
    } catch (error) {
      alert("An error occurred while deleting the request.");
    }
  };
  

  return (
    <>
      <Header />
      <div className={styles.requestsContainer}>
        <h2 className={styles.requestsHeading}>Mentorship Program Requests</h2>

        {requests.length > 0 ? (
          <div className={styles.requestsList}>
            {requests.map((request) => (
              <div className={styles.requestCard} key={request.studentId}>
                <p><strong>Student Name:</strong> {request.studentName}</p>
                <p><strong>Email:</strong> {request.studentEmail}</p>
                <p><strong>Phone:</strong> {request.studentPhone}</p>
                <p><strong>Selected Mentor:</strong> {request.mentorName}</p>
                <p><strong>Reason:</strong> {request.reason}</p>

                <div className={styles.requestActions}>
                  <button className={styles.mentorAcceptButton} onClick={() => acceptRequest(request.studentId)}>Accept</button>
                  <button className={styles.mentorDeleteButton} onClick={() => deleteRequest(request.studentId)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{textAlign:"center"}}>No mentorship requests available.</p>
        )}
      </div>
    </>
  );
}
