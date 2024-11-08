import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";
import { users } from "../data/loadData"; 
import GuestHeader from "../components/Header";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    console.log("User ID from session storage:", userId);

    if (userId) {
      const user = Object.values(users).find(user => user.user_id.toString() === userId);
      console.log("User found:", user);
      if (user) {
        const routes = {
          Admin: "/admin",
          Advisor: "/advisor",
          Mentor: "/mentor",
          Student: "/home",
        };
        router.replace(routes[user.user_type] || "/login");
      }
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = Object.values(users).find(user => user.email === email && user.password === password);
    if (user) {
      sessionStorage.setItem('userId', user.user_id);
      sessionStorage.setItem('userRole', user.user_type);
      console.log("User logged in:", user);
      const routes = {
        Admin: "/admin",
        Advisor: "/advisor",
        Mentor: "/mentor",
        Student: "/home",
      };
      router.replace(routes[user.user_type] || "/login");
    } else {
      setError('Invalid email or password');
      console.log("Login failed: Invalid email or password");
    }
  };

  return (
    <>
      <GuestHeader />
      <div className={styles.loginFlex}>
        <Link href="/">
          <Image src="/assets/eduverse.jpg" alt="EduVerse" className={styles.loginCustomImage} width={550} height={100} style={{height: 'auto'}}/>
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
            <button type="submit" className={styles.loginSubmitButton}>Submit</button>
            <div className={styles.loginLinks}>
              <Link href="/forgotPassword" className={styles.loginLink}>Forgot Password?</Link>
              <br />
              <Link href="/register" className={styles.loginLink}>New User? Create An Account</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}