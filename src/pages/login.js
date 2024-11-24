import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";
import GuestHeader from "../components/Header";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (userId && userRole) {
      const routes = {
        Admin: "/admin",
        Advisor: "/advisor",
        Mentor: "/mentor",
        Student: "/home",
      };
      router.replace(routes[userRole] || "/login");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {

        if(!data.userRole){
          alert("Your account is being reviewed by Admin. Please wait until you get email confirmation for your access.");
          return;
        }
        
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("userRole", data.userRole);
        sessionStorage.setItem("userName", data.name);
        sessionStorage.setItem("lightTheme",data.isLightTheme===1?"dark":"light");
        sessionStorage.setItem("enableEmail",data.enableEmail);
        

        console.log("User logged in:", data);

        const routes = {
          Admin: "/admin",
          Advisor: "/advisor",
          Mentor: "/mentor",
          Student: "/home",
        };
        router.replace(routes[data.userRole] || "/login");
        
        document.body.setAttribute("data-theme", sessionStorage.getItem("lightTheme"));
      } else {
        setError(data.error || "An error occurred. Please try again.");
        console.error("Login error:", data.error);
      }
    } catch (err) {
      setError("An error occurred. Please check your connection and try again.");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GuestHeader />
      <div className={styles.loginFlex}>
        <Link href="/">
          <Image
            src="/assets/eduverse.jpg"
            alt="EduVerse"
            className={styles.loginCustomImage}
            width={550}
            height={100}
            style={{ height: "auto" }}
          />
        </Link>
        <div className={styles.loginBgWhite}>
          <h1 className={styles.loginHeader}>Login</h1>
          {error && <p className={styles.loginError}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.loginInputBox}
              placeholder="Enter your Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.loginInputBox}
              placeholder="Enter your Password"
            />
            <button
              type="submit"
              className={styles.loginSubmitButton}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Submit"}
            </button>
            <div className={styles.loginLinks}>
              <Link href="/forgotPassword" className={styles.loginLink}>
                Forgot Password?
              </Link>
              <br />
              <Link href="/register" className={styles.loginLink}>
                New User? Create An Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}