import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import styles from "@/styles/ManageArticles.module.css";
import { useRouter } from "next/router";

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      router.push("/login");
    } else {
      fetchArticles();
    }
  }, [router]);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`/api/articles?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArticles(articles.filter((article) => article.aid !== id));
      } else {
        console.error("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

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
                <td>{article.posted_date}</td>
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
