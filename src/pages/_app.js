import '@/styles/global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Head from 'next/head';
import { useState, useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
    const [theme, setTheme] = useState("light");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const applyTheme = () => {
          const savedTheme = sessionStorage.getItem("lightTheme") || "light";
          setTheme(savedTheme);
          document.body.setAttribute("data-theme", savedTheme);
      };

      // Initial theme application
      applyTheme();

      // Listener for sessionStorage changes (optional, for multiple tabs/windows)
      window.addEventListener("storage", applyTheme);

      const userLoggedIn = sessionStorage.getItem("userId") !== null; 
      setIsLoggedIn(userLoggedIn);

      return () => {
          window.removeEventListener("storage", applyTheme);
      };
  }, []);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        document.body.setAttribute("data-theme", newTheme);
        if (newTheme === "light") {
            sessionStorage.removeItem("lightTheme"); // Remove theme from sessionStorage when switching to light
        } else {
            sessionStorage.setItem("lightTheme", newTheme); // Save dark theme to sessionStorage
        }
    };

    return (
        <>
            <Head>
                <title>EduVerse</title>
                <link rel="icon" href="../public/favicon.ico" />
            </Head>
            <Component {...pageProps} toggleTheme={toggleTheme} theme={theme} isLoggedIn={isLoggedIn} />
        </>
    );
}
