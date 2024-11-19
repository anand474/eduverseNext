import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import GuestHeader from "@/components/Header";
import { users } from "@/data/loadData";
import styles from "@/styles/ForgotPassword.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
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

  const userName = sessionStorage.getItem("userName");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 16) {
      setError("Password should be 8-16 characters long");
      return;
    }

    // Assuming we send the email here:
    //   const emailResponse = await fetch("/api/sendEmail", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       to: email,
    //       subject: "Password Reset Request",
    //       html: `
    //         <div style="font-family: Arial, sans-serif; text-align: left; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    //           <h2 style="color: #4CAF50; text-align: center;">Password Reset Request</h2>
    //           <p style="font-size: 16px; color: #333;">Dear ${userName},</p>
    //           <p style="font-size: 16px; color: #333;">
    //             We have received a request to reset your password for your Eduverse account. 
    //             Please click the link below to reset your password:
    //           </p>
    //           <div style="text-align: center; margin-top: 20px;">
    //             <a href="http://localhost:3000/forgotPassword" 
    //                style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; 
    //                       color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
    //               Reset Your Password
    //             </a>
    //           </div>
    //           <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: center;">
    //             If you did not request a password reset, please ignore this email.
    //           </p>
    //           <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: center;">
    //             This is an automated message. Please do not reply to this email.
    //           </p>
    //         </div>
    //       `,
    //     }),
    //   });

    //   if (emailResponse.ok) {
    //     alert('Password reset link has been sent to your email! If you didn`t receive email, please check the email id provided.');
    //     router.push("/login");
    //   } else {
    //     alert('There was an error sending the reset email.');
    //   }
  };

  return (
    <>
      <GuestHeader />
      <div className={`${styles.forgetFlex} ${styles.forgetMinHScreen} bg-[rgba(168,237,215,0.2)] p-4`}>
        <Link href="/">
          <Image src="/assets/eduverse.jpg" alt="EduVerse" className={styles.forgetCustomImage} width={550} height={100} />
        </Link>
        <div className={styles.forgetBgWhite}>
          <h1 className={`${styles.forgetTextCenter} ${styles.forgetTextGray800} ${styles.forgetText4xl} ${styles.forgetFontBold}`}>
            Forgot Password
          </h1>
          {error && <p className={styles.error}>{error}</p>}
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