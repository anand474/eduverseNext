import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { FaTrashAlt } from "react-icons/fa";
import styles from "../styles/Articles.module.css";

export default function Articles() {
  const [showForm, setShowForm] = useState(false);
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

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
      fetchArticles(storedUserId,storedUserRole);
    }
  }, []);

  const fetchArticles = async (uid, urole) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'fetchArticles', uid, urole }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        console.error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };
  
  const handleCreateArticle = async (event) => {
    event.preventDefault();
    const newArticle = {
      action: 'createArticle',
      aname: event.target.name.value,
      postedBy: event.target.postedBy.value,
      description: event.target.description.value,
      article_link: event.target.link.value,
      posted_date: new Date().toLocaleDateString(),
      uid: userId,
    };
  
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      });
  
      if (response.ok) {
        const createdArticle = await response.json();
        setArticles([...articles, { ...newArticle, aid: createdArticle.id }]);
        setShowForm(false);
      } else {
        console.error("Failed to create article");
      }
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };
  
  
  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  

  const handleDeleteArticle = async (id) => {
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

  const filteredArticles = articles.filter(
    (article) =>
      (article.aname &&
        article.aname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.description &&
        article.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log("filteredArticles:", filteredArticles);

  return (
    <>
      <Header />
      <div className={styles.articlesPage}>
        <h1 className="pageTitle">Articles</h1>
        <SearchBar onSearch={handleSearch} />
        {userRole !== "Student" && (
          <button
            className={styles.createArticleButton}
            onClick={() => setShowForm(true)}
          >
            Create Article
          </button>
        )}
        {showForm && (
          <div className={styles.formOverlay}>
            <div className={styles.formPopup}>
              <form
                className={styles.articleForm}
                onSubmit={handleCreateArticle}
              >
                <h2>Create New Article</h2>
                <label>
                  Article Name:
                  <input type="text" name="name" required />
                </label>
                <label>
                  Posted By:
                  <input type="text" name="postedBy" required />
                </label>
                <label>
                  Description:
                  <textarea name="description" required></textarea>
                </label>
                <label>
                  Article Link:
                  <input type="url" name="link" required />
                </label>
                <div className={styles.buttonContainer}>
                  <button type="submit" className={styles.submitButton}>
                    Submit
                  </button>
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => setShowForm(false)}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className={styles.articlesList}>
          {filteredArticles.map((article) => (
            <div className={styles.articleCard} key={article.aid}>
              <div className={styles.articleDetailsLeft}>
                <h3>{article.aname}</h3>
                <p className={styles.description}>{article.description}</p>
              </div>
              <div className={styles.articleDetailsRight}>
                <p>
                  <strong>Posted By:</strong> {article.postedBy}
                </p>
                <p>{article.posted_date}</p>
              </div>
              <div className={styles.readMore}>
                <a
                  href={article.article_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
              </div>
              {userRole !== "Student" && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteArticle(article.aid)}
                >
                  <FaTrashAlt size={20} color="red" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
