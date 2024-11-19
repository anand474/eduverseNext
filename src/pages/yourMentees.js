import { useState, useEffect } from 'react';
import styles from '@/styles/ViewYourMentees.module.css';
import Header from '@/components/Header';
import { FaTrashAlt } from 'react-icons/fa';
import SearchBar from '@/components/SearchBar';

export default function ViewYourMentees() {
  const [mentees, setMentees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Retrieve user details from session storage
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserRole = sessionStorage.getItem("userRole");

    if (!storedUserId) {
      alert("Please login to continue");
      window.location.href = "/login";
    } else {
      setUserId(storedUserId);
      setUserRole(storedUserRole);

      fetchMentees(storedUserId);
    }
  }, []);

  const fetchMentees = async (mentorId) => {
    try {
      const response = await fetch(`/api/mentees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mentorId }),
      });

      if (response.ok) {
        const data = await response.json();
        setMentees(data);
      } else {
        console.error("Failed to fetch mentees");
      }
    } catch (error) {
      console.error("An error occurred while fetching mentees:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Do you want to remove this student?")) {
      try {
        const response = await fetch(`/api/mentorship-requests`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          setMentees(mentees.filter((mentee) => mentee.studentId !== id));
          alert("Mentee removed successfully.");
        } else {
          alert("Failed to remove mentee.");
        }
      } catch (error) {
        alert("An error occurred while removing the mentee.");
      }
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredMentees = mentees.filter((mentee) => {
    const studentName = mentee.studentName || ''; 
    const email = mentee.email || ''; 
  
    const searchTermLower = searchTerm.toLowerCase(); 
  
    return (
      studentName.toLowerCase().includes(searchTermLower) ||
      email.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <>
      <Header />
      <div className={styles.menteesContainer}>
        <h2 className={styles.menteesHeading}>Your Mentees</h2>
        <SearchBar onSearch={handleSearch} />
        {filteredMentees.length > 0 ? (
          <div className={styles.menteesList}>
            {filteredMentees.map((mentee) => (
              <div key={mentee.id} className={styles.menteeCard}>
                <div className={styles.menteeCardContent}>
                <div className={styles.menteeLeft}>
                <div className={styles.menteeIcon}>
                  {mentee.fullName ? mentee.fullName.charAt(0).toUpperCase() : ''}
                </div>
                <div className={styles.menteeInfo}>
                  <p><strong>Name:</strong> {mentee.fullName}</p>
                  <p><strong>Email:</strong> {mentee.emailId}</p>
                </div>
              </div>

                  <div className={styles.menteeRight}>
                    <p><strong>Phone:</strong> {mentee.phoneNo}</p>
                    <div className={styles.menteeActions}>
                      <FaTrashAlt
                        className={styles.deleteIcon}
                        onClick={() => handleDelete(mentee.studentId)}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.menteeReason}>
                  <p><strong>Reason:</strong> {mentee.reason}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noMenteesMessage}>You currently have no mentees assigned.</p>
        )}
      </div>
    </>
  );
}
