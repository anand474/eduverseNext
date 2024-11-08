import { useState, useEffect } from 'react';
import styles from '@/styles/MenteeRequests.module.css';
import Header from '@/components/Header';

export default function MentorshipRequests() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      mentor: 'Mentor 1',
      reason: 'I need help with career guidance.',
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      mentor: 'Mentor 1',
      reason: 'Looking for support in coding interviews.',
    },
  ]);

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

  const acceptRequest = (id) => {
    const acceptedRequest = requests.find(request => request.id === id);
    alert(`Request from ${acceptedRequest.studentName} has been accepted!`);
    setRequests(requests.filter(request => request.id !== id));
  };

  const deleteRequest = (id) => {
    const updatedRequests = requests.filter(request => request.id !== id);
    setRequests(updatedRequests);
    alert('Request has been deleted.');
  };

  return (
    <>
      <Header />
      <div className={styles.requestsContainer}>
        <h2 className={styles.requestsHeading}>Mentorship Program Requests</h2>

        {requests.length > 0 ? (
          <div className={styles.requestsList}>
            {requests.map((request) => (
              <div className={styles.requestCard} key={request.id}>
                <p><strong>Student Name:</strong> {request.studentName}</p>
                <p><strong>Email:</strong> {request.email}</p>
                <p><strong>Phone:</strong> {request.phone}</p>
                <p><strong>Selected Mentor:</strong> {request.mentor}</p>
                <p><strong>Reason:</strong> {request.reason}</p>

                <div className={styles.requestActions}>
                  <button className={styles.mentorAcceptButton} onClick={() => acceptRequest(request.id)}>Accept</button>
                  <button className={styles.mentorDeleteButton} onClick={() => deleteRequest(request.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No mentorship requests available.</p>
        )}
      </div>
    </>
  );
}