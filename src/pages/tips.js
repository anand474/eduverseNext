import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaTrashAlt } from "react-icons/fa";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { users, tips as InitialTips } from "../data/loadData";
import styles from "../styles/Tips.module.css";
import Link from "next/link";

export default function Tips() {
  const router = useRouter();
  const [tips, setTips] = useState(InitialTips);
  const [randomTip, setRandomTip] = useState(null);
  const [newTip, setNewTip] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const role = sessionStorage.getItem("userRole");

    if (!userId) {
      alert("Please login to continue");
      router.push("/login");
    } else {
      setUserId(userId);
      setUserRole(role);
    }
  }, [router]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[randomIndex]);
  }, [tips]);

  const handleDeleteTips = (tipId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tip?");
    if (confirmDelete) {
      setTips(tips.filter((tip) => tip.id !== tipId));
    }
  };

  const handleCreateTip = () => {
    if (newTip.trim() && shortDescription.trim()) {
      const newTipObj = {
        id: tips.length + 1,
        shortDescription: shortDescription.substring(0, 50),
        content: newTip,
        postedBy: 1,
        postedDate: new Date().toISOString().split("T")[0],
      };
      setTips([...tips, newTipObj]);
      setNewTip("");
      setShortDescription("");
      setShowCreateForm(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.tipsPage}>
        {userRole === "Student" && randomTip && (
          <div className={styles.randomTip}>
            <h2 className="pageTitle">Tip of the Day</h2>
            <div className={styles.tipCard}>
              <p>{randomTip.content}</p>
              <div className={styles.tipPoster}>
                {users[randomTip.postedBy] ? (
                  <span>{`Posted by: ${users[randomTip.postedBy].user_name} on ${randomTip.postedDate}`}</span>
                ) : (
                  <span>User not found</span>
                )}
              </div>
            </div>
          </div>
        )}
        <h2 className="pageTitle">All Tips</h2>
        {userRole !== "Student" && (
          <button className={styles.createTipButton} onClick={() => setShowCreateForm(true)}>
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
                  <button type="button" className={styles.submitTipButton} onClick={handleCreateTip}>
                    Submit
                  </button>
                  <button type="button" onClick={() => setShowCreateForm(false)} className={styles.cancelTipButton}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <SearchBar />
        <div className={styles.tipsList}>
          {tips.map((tip) => (
            <div key={tip.id} className={styles.tipCard}>
              <div className={styles.tipContent}>
                <h3>{tip.shortDescription}</h3>
                <p>
                  {tip.content.length > 100 ? (
                    <>
                      {tip.content.substring(0, 100)}...
                      <Link href={`/tips/${tip.id}`} className={styles.viewFullContent} target="_blank">
                        View Full Content
                      </Link>
                    </>
                  ) : (
                    tip.content
                  )}
                </p>
              </div>
              <div className={styles.tipPoster}>
                {users[tip.postedBy] ? (
                  <span>{`Posted by: ${users[tip.postedBy].user_name} on ${tip.postedDate}`}</span>
                ) : (
                  <span>User not found</span>
                )}
              </div>
              {userRole !== "Student" && (
                <button className={styles.deleteButton} onClick={() => handleDeleteTips(tip.id)}>
                  <FaTrashAlt size={15} color="red" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}