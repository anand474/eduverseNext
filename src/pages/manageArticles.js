import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import { articles as initialArticles } from "@/data/loadData";
import styles from "@/styles/ManageArticles.module.css";
import { useRouter } from "next/router";

export default function ManageArticles() {
    const [articles, setArticles] = useState(initialArticles);
    const router = useRouter();

    useEffect(() => {
        if (!sessionStorage.getItem("userId")) {
            alert("Please login to continue");
            router.push("/login");
        }
    }, [router]);

    const handleDeleteClick = (id) => {
        const updatedArticles = articles.filter((article) => article.id !== id);
        setArticles(updatedArticles);
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
                            <tr key={article.id}>
                                <td>{article.id}</td>
                                <td>{article.name}</td>
                                <td>{article.description}</td>
                                <td>{article.postedBy}</td>
                                <td>{article.date}</td>
                                <td className={styles.actionsCell}>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteClick(article.id)}
                                    >
                                        Delete
                                    </button>
                                    <a
                                        href={article.link}
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