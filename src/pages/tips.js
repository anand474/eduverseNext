import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaTrashAlt } from "react-icons/fa";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import styles from "../styles/Tips.module.css";
import Link from "next/link";

export default function Tips() {
  const router = useRouter();
  const [tips, setTips] = useState([]);
  const [randomTip, setRandomTip] = useState(null);
  const [newTip, setNewTip] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [uname, setUname] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const role = sessionStorage.getItem("userRole");
    const uname = sessionStorage.getItem("userName");

    if (!userId) {
      alert("Please login to continue");
      router.push("/login");
    } else {
      setUserId(userId);
      setUserRole(role);
      setUname(uname);
      fetchTips(userId, role);
    }
  }, [router]);

  const fetchTips = async (userId, userRole) => {
    try {
      const response = await fetch(
        `/api/tips?userId=${userId}&userRole=${userRole}`
      );
      if (response.ok) {
        const data = await response.json();
        setTips(data);
        setRandomTip(data[Math.floor(Math.random() * data.length)]);
      } else {
        console.error("Failed to fetch tips");
      }
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };

  const handleDeleteTips = async (tipId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tip?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/tips?id=${tipId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchTips(userId, userRole);
        } else {
          console.error("Failed to delete tip");
        }
      } catch (error) {
        console.error("Error deleting tip:", error);
      }
    }
  };

  const handleCreateTip = async () => {
    if (newTip.trim() && shortDescription.trim()) {
      const newTipObj = {
        title: shortDescription.substring(0, 50),
        tip_content: newTip,
        posted_date: new Date(),
        postedBy: uname,
        uid_created: userId,
      };
      try {
        const response = await fetch("/api/tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTipObj),
        });
        if (response.ok) {
          fetchTips(userId, userRole);
          setShowCreateForm(false);
        } else {
          console.error("Failed to create tip");
        }
      } catch (error) {
        console.error("Error creating tip:", error);
      }
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredTips = tips.filter(
    (tip) =>
      (tip.title && tip.title.toLowerCase().includes(searchTerm)) ||
      (tip.tip_content && tip.tip_content.toLowerCase().includes(searchTerm))
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Header />
      <div className={styles.tipsPage}>
        {userRole === "Student" && randomTip && (
          <div className={styles.randomTip}>
            <h2 className="pageTitle">Tip of the Day</h2>
            <div className={styles.tipCard}>
              <p>{randomTip.tip_content}</p>
              <div className={styles.tipPoster}>
                <span>{`Posted by: ${randomTip.postedBy} on ${formatDate(
                  randomTip.posted_date
                )}`}</span>
              </div>
            </div>
          </div>
        )}
        <h2 className="pageTitle">All Tips</h2>
        <SearchBar onSearch={handleSearch} />
        {userRole !== "Student" && (
          <button
            className={styles.createTipButton}
            onClick={() => setShowCreateForm(true)}
          >
            Create Tip
          </button>
        )}
        {showCreateForm && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Add Your Tip</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Enter short description"
                  className={styles.createTipInput}
                  required
                />
                <textarea
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="Enter your tip here"
                  className={styles.createTipInput}
                  required
                />
                <div>
                  <button
                    type="button"
                    className={styles.submitTipButton}
                    onClick={handleCreateTip}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className={styles.cancelTipButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className={styles.tipsList}>
          {filteredTips.map((tip) => (
            <div key={tip.tid} className={styles.tipCard}>
              <div className={styles.tipContent}>
                <h3>{tip.title}</h3>
                <p>
                  {tip.tip_content.length > 100 ? (
                    <>
                      {tip.tip_content.substring(0, 100)}...
                      <Link
                        href={`/tips/${tip.tid}`}
                        className={styles.viewFullContent}
                        target="_blank"
                      >
                        View Full Content
                      </Link>
                    </>
                  ) : (
                    tip.tip_content
                  )}
                </p>
              </div>
              <div className={styles.tipPoster}>
                <span>{`Posted by: ${tip.postedBy} on ${formatDate(
                  tip.posted_date
                )}`}</span>
              </div>
              {userRole !== "Student" && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteTips(tip.tid)}
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
