import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/AdminUserRequests.module.css";
import AdminHeader from "@/components/AdminHeader";
import { userRequestsData } from "@/data/loadData";

export default function AdminUserRequests() {
  const [requests, setRequests] = useState(userRequestsData);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      router.push("/login");
    }
  }, [router]);

  const handleReplyChange = (id, value) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, replyMessage: value } : request
      )
    );
  };

  const handleReplySubmit = (id) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, replied: true } : request
      )
    );
    setActiveAccordion(null);
  };

  const handleDeleteRequest = (id) => {
    setRequests(requests.filter((request) => request.id !== id));
  };

  const toggleAccordion = (id) => {
    setActiveAccordion((prevActive) => (prevActive === id ? null : id));
  };

  return (
    <div>
      <AdminHeader />
      <div className={styles.adminRequestsContainer}>
        <h2>User Queries</h2>
        {requests.length === 0 ? (
          <p>No user queries available.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className={styles.accordionCard}>
              <div className={styles.accordionHeader} onClick={() => toggleAccordion(request.id)}>
                <h3>{`${request.firstName} ${request.lastName}`}</h3>
                <p><strong>Message:</strong> {request.message}</p>
              </div>
              {activeAccordion === request.id && (
                <div className={styles.accordionContent}>
                  <p><strong>Phone:</strong> {request.phone}</p>
                  <p><strong>Email:</strong> {request.email}</p>
                  {request.replied ? (
                    <div className={styles.replySection}>
                      <h4>Reply Sent:</h4>
                      <p>{request.replyMessage}</p>
                    </div>
                  ) : (
                    <div className={styles.replySection}>
                      <textarea
                        placeholder="Type your reply here"
                        value={request.replyMessage}
                        onChange={(e) => handleReplyChange(request.id, e.target.value)}
                      ></textarea>
                      <button
                        className={styles.replyBtn}
                        onClick={() => handleReplySubmit(request.id)}
                      >
                        Send Reply
                      </button>
                    </div>
                  )}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteRequest(request.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}