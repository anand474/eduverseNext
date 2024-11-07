import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import GuestHeader from "../components/Header";
import { users } from "../data/loadData";
import styles from "../styles/ForgotPassword.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      const user = Object.values(users).find(user => user.user_id.toString() === userId);
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
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Password reset for:', email);
    console.log('New Password:', newPassword);
  };

  return (
    <>
      <GuestHeader />
      <div className={`${styles.forgetFlex} ${styles.forgetMinHScreen} bg-[rgba(168,237,215,0.2)] p-4`}>
        <Link href="/">
          <Image  src="/assets/eduverse.jpg"  alt="EduVerse"  className={styles.forgetCustomImage}  width={550} height={100}  />
        </Link>
        <div className={styles.forgetBgWhite}>
          <h1 className={`${styles.forgetTextCenter} ${styles.forgetTextGray800} ${styles.forgetText4xl} ${styles.forgetFontBold}`}>
            Forgot Password
          </h1>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.forgetInputBox}
                placeholder="Enter your Email"
              />
            </div>
            <div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={styles.forgetInputBox}
                placeholder="Enter your New Password"
              />
            </div>
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.forgetInputBox}
                placeholder="Re-enter your New Password"
              />
            </div>
            <button type="submit" className={styles.forgetSubmitButton}>
              Submit
            </button>
            <div className={styles.forgetMt4}>
              <Link href="/" className={`${styles.forgetTextBlue500} ${styles.forgetHoverUnderline}`}>
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}