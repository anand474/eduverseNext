import React, { useState } from "react";
import styles from "../styles/SearchBar.module.css";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // onSearch(value);
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={searchTerm}
        placeholder="Search"
        onChange={handleInputChange}
        className={styles.searchInput}
      />
      <button className={styles.searchButton}>🔍</button>
    </div>
  );
}
