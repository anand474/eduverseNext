import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminHeader from "@/components/AdminHeader";
import styles from "@/styles/ManageArticles.module.css";

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserRole = sessionStorage.getItem("userRole");

    if (!storedUserId || !storedUserRole) {
      alert("Please login to continue");
      router.push("/login");
      return;
    }

    setUserId(storedUserId);
    setUserRole(storedUserRole);
  }, [router]);

  useEffect(() => {
    if (userId && userRole) {
      fetchArticles();
    }
  }, [userId, userRole]);

  const fetchArticles = async () => {
    console.log("Fetching articles...");
    console.log("UserRole:", userRole, "UserId:", userId);

    try {
      const response = await fetch(
        `/api/articles?userId=${userId}&userRole=${userRole}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched articles:", data);
        setArticles(data);
      } else {
        console.error("Failed to fetch articles:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    let flag = window.confirm("Are you sure you want to delete this article?");
    if (flag) {
      try {
        const response = await fetch(`/api/articles?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setArticles((prev) => prev.filter((article) => article.aid !== id));
        } else {
          console.error("Failed to delete article");
        }
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <AdminHeader />
      <div className={styles.manageArticles}>
        <h2 className="pageTitle">Manage Articles</h2>
        <table className={styles.articlesTable}>
          <thead>
            <tr>
              <th>Article ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Posted By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.aid}>
                <td>{article.aid}</td>
                <td>{article.aname}</td>
                <td>{article.description}</td>
                <td>{article.postedBy}</td>
                <td>{new Date(article.posted_date).toLocaleDateString()}</td>
                <td className={styles.actionsCell}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(article.aid)}
                  >
                    Delete
                  </button>
                  <a
                    href={article.article_link}
                    className={styles.viewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
