import { useState, useEffect } from 'react';
import styles from '@/styles/ViewYourMentees.module.css';
import Header from '@/components/Header';
import { FaTrashAlt } from 'react-icons/fa';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'next/router';

export default function ViewYourMentees() {
  const router = useRouter();
  const [mentees, setMentees] = useState([
    { id: 1, studentName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', reason: 'Career guidance.' },
    { id: 2, studentName: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', reason: 'Coding interviews.' },
    { id: 3, studentName: 'Alice Johnson', email: 'alice@example.com', phone: '555-654-7890', reason: 'Communication skills.' },
    { id: 4, studentName: 'Emily Clark', email: 'emily@example.com', phone: '222-333-4444', reason: 'Job applications.' },
    { id: 5, studentName: 'Michael Brown', email: 'michael@example.com', phone: '888-777-6666', reason: 'Internship guidance.' },
    { id: 6, studentName: 'Sarah Wilson', email: 'sarah@example.com', phone: '444-555-6666', reason: 'Networking skills.' },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = (id) => {
    if (confirm("Do you want to remove this student?")) {
      setMentees(mentees.filter((mentee) => mentee.id !== id));
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  return (
    <>
      <Header />
      <div className={styles.menteesContainer}>
        <h2 className={styles.menteesHeading}>Your Mentees</h2>
        <SearchBar onSearch={handleSearch} />
        {mentees.length > 0 ? (
          <div className={styles.menteesList}>
            {mentees.map((mentee) => (
              <div key={mentee.id} className={styles.menteeCard}>
                <div className={styles.menteeCardContent}>
                  <div className={styles.menteeLeft}>
                    <div className={styles.menteeIcon}>
                      {mentee.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.menteeInfo}>
                      <p><strong>Name:</strong> {mentee.studentName}</p>
                      <p><strong>Email:</strong> {mentee.email}</p>
                    </div>
                  </div>

                  <div className={styles.menteeRight}>
                    <p><strong>Phone:</strong> {mentee.phone}</p>
                    <div className={styles.menteeActions}>
                      <FaTrashAlt
                        className={styles.deleteIcon}
                        onClick={() => handleDelete(mentee.id)}
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