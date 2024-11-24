import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/AdminUserRequests.module.css";
import AdminHeader from "@/components/AdminHeader";

export default function AdminUserRequests() {
  const [requests, setRequests] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      router.push("/login");
    } else {
      fetchRequests();
    }
  }, [router]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/user-queries");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error("Failed to fetch requests:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleReplyChange = (id, value) => {
    setRequests(
      requests.map((request) =>
        request.qId === id ? { ...request, replyMessage: value } : request
      )
    );
  };

  const handleReplySubmit = async (id) => {
    const request = requests.find((request) => request.qId === id);

    const replyMessage = request.replyMessage;
    const userEmail = request.emailId;
    

    

    const emailData = {
      to: userEmail,
      subject: `Reply to your query: ${request.query.substring(0, 50)}...`,
      html: `
        <p>Dear ${request.name},</p>
        <p>We have received your query and here's our response:</p>
        <p><strong>Reply:</strong> ${replyMessage}</p>
        <p>Thank you for reaching out!</p>
      `,
    };

    try {
      await fetch("/api/queryReply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const saveReplyData = {
        id: request.qId,
        replyMessage,
      };

      const response = await fetch("/api/user-queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveReplyData),
      });

      if (response.ok) {
        console.log("Reply saved to the database.");
      } else {
        console.error("Failed to save reply to the database.");
      }
    } catch (error) {
      console.error("Error sending email or saving reply:", error);
    }
    fetchRequests();
    
  };

  const handleDeleteRequest = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/user-queries?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setRequests(requests.filter((request) => request.qId !== id));
        } else {
          console.error("Failed to delete request");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const toggleAccordion = (id) => {
    setActiveAccordion((prevActive) => (prevActive === id ? null : id));
  };

  return (
    <div>
      <AdminHeader />
      <div className={styles.adminRequestsContainer}>
        <h2 className="pageTitle">User Queries</h2>
        {requests.length === 0 ? (
          <p>No user queries available.</p>
        ) : (
          requests.map((request) => (
            <div key={request.qId} className={styles.accordionCard}>
              <div
                className={styles.accordionHeader}
                onClick={() => toggleAccordion(request.qId)}
              >
                <h3>{`${request.name}`}</h3>
                <p><strong>Message:</strong> {request.query}</p>
              </div>
              {activeAccordion === request.qId && (
                <div className={styles.accordionContent}>
                  <p><strong>Phone:</strong> {request.phoneNo}</p>
                  <p><strong>Email:</strong> {request.emailId}</p>
                  {request.replied ? (
                    <div className={styles.replySection}>
                      <h4>Reply Sent:</h4>
                      <p>{request.reply_message}</p>
                    </div>
                  ) : (
                    <div className={styles.replySection}>
                      <textarea
                        placeholder="Type your reply here"
                        value={request.replyMessage}
                        onChange={(e) => handleReplyChange(request.qId, e.target.value)}
                      ></textarea>
                      <button
                        className={styles.replyBtn}
                        onClick={() => handleReplySubmit(request.qId)}
                      >
                        Send Reply
                      </button>
                    </div>
                  )}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteRequest(request.qId)}
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
