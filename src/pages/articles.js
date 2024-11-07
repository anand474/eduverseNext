import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { FaTrashAlt } from 'react-icons/fa';
import { articles as initialArticles } from "../data/loadData";
import styles from "../styles/Articles.module.css";

export default function Articles() {
  const [showForm, setShowForm] = useState(false);
  const [articles, setArticles] = useState(initialArticles);
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
    }
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleCreateArticle = (event) => {
    event.preventDefault();
    const newArticle = {
      id: articles.length + 1,
      name: event.target.name.value,
      postedBy: event.target.postedBy.value,
      description: event.target.description.value,
      link: event.target.link.value,
      date: new Date().toLocaleDateString(),
    };
    setArticles([...articles, newArticle]);
    setShowForm(false);
  };

  const handleDeleteArticle = (id) => {
    const updatedArticles = articles.filter((article) => article.id !== id);
    setArticles(updatedArticles);
  };

  const filteredArticles = articles.filter((article) =>
    article.name.toLowerCase().includes(searchTerm) ||
    article.description.toLowerCase().includes(searchTerm)
  );

  return (
    <>
      <Header />
      <div className={styles.articlesPage}>
        <h1 className="pageTitle">Articles</h1>
        <SearchBar onSearch={handleSearch} />
        {(userRole !== "Student") &&
          <button className={styles.createArticleButton} onClick={() => setShowForm(true)}>
            Create Article
          </button>
        }
        {showForm && (
          <div className={styles.formOverlay}>
            <div className={styles.formPopup}>
              <form className={styles.articleForm} onSubmit={handleCreateArticle}>
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
                  <button type="submit" className={styles.submitButton}>Submit</button>
                  <button type="button" className={styles.closeButton} onClick={() => setShowForm(false)}>Close</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className={styles.articlesList}>
          {filteredArticles.map((article) => (
            <div className={styles.articleCard} key={article.id}>
              <div className={styles.articleDetailsLeft}>
                <h3>{article.name}</h3>
                <p className={styles.description}>{article.description}</p>
              </div>
              <div className={styles.articleDetailsRight}>
                <p><strong>Posted By:</strong> {article.postedBy}</p>
                <p>{article.date}</p>
              </div>
              <div className={styles.readMore}>
                <a href={article.link} target="_blank" rel="noopener noreferrer">Read More</a>
              </div>
              {(userRole !== "Student") &&
                <button className={styles.deleteButton} onClick={() => handleDeleteArticle(article.id)}>
                  <FaTrashAlt size={20} color="red" />
                </button>
              }
            </div>
          ))}
        </div>
      </div>
    </>
  );
}