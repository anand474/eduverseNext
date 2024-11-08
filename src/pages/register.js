import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import GuestHeader from "./Header";
import { users } from "./loadData"; 
import styles from '../styles/Register.module.css';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
        router.replace(routes[user.user_type] || "/home");
      }
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log('Full Name:', fullName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Phone Number:', phoneNumber);
  };

  return (
    <>
      <GuestHeader/>
      <div className={`${styles.flex} ${styles.minHScreen} ${styles.p4}`} style={{ backgroundColor: "rgba(168,237,215,0.2)" }}>
        <a href="/">
          <Image
            src="/assets/eduverse.jpg"
            alt="EduVerse"
            className={`${styles.mb6} ${styles.customImage}`}
            width={550} 
            height={100} 
          />
        </a>
        <div className={`${styles.bgWhite} ${styles.p8} ${styles.flex} ${styles.mt4}`}>
          <h1 className={`${styles.text4xl} ${styles.mdText5xl} ${styles.heading}`}>Register</h1>
          <form onSubmit={handleSubmit} className={styles.wFull}>
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={styles.inputBox}
                placeholder="Full Name"
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.inputBox}
                placeholder="Enter your Email"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputBox}
                placeholder="Enter your Password"
              />
            </div>
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.inputBox}
                placeholder="Re-enter your Password"
              />
            </div>
            <div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className={styles.inputBox}
                placeholder="Phone Number"
              />
            </div>
            <button type="submit" className={`${styles.submitButton}`}>
              Submit
            </button>
            <div className={`${styles.mt4} ${styles.textCenter}`}>
              <a href="/" className={`${styles.textBlue} ${styles.hoverUnderline}`}>Already have an account? Login</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}