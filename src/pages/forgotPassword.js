import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import GuestHeader from "@/components/Header";
import styles from "@/styles/ForgotPassword.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValidated, setOtpValidated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let userId = sessionStorage.getItem('userId');
    if (userId) {
      router.replace('/home');
    }
  }, [router]);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!email) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    try {
      const usersResponse = await fetch(`/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!usersResponse.ok) {
        setError("Unable to verify email. Please try again later.");
        setLoading(false);
        return;
      }

      const users = await usersResponse.json();
      const user = users.find((u) => u.emailId === email);

      if (!user) {
        setError("Email not found. Please enter a valid registered email.");
        setLoading(false);
        return;
      }

      setUserId(user.uid);

      const otp = generateOtp();
      setGeneratedOtp(otp);

      const emailResponse = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Password Reset Request",
          html: `
            <div style="font-family: Arial, sans-serif; text-align: left; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
              <h2 style="color: #4CAF50; text-align: center;">Password Reset Request</h2>
              <p style="font-size: 16px; color: #333;">Dear User,</p>
              <p style="font-size: 16px; color: #333;">
                We have received a request to reset your password for your Eduverse account.
                Please use the following OTP to reset your password:
              </p>
              <div style="text-align: center; margin-top: 20px;">
                <h3 style="display: inline-block; padding: 12px 24px; font-size: 20px; font-weight: bold; color: white; background-color: #4CAF50; border-radius: 5px;">
                  ${otp}
                </h3>
              </div>
              <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: center;">
                If you did not request a password reset, please ignore this email.
              </p>
              <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: center;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          `,
        }),
      });

      if (emailResponse.ok) {
        alert("OTP has been sent to your email! Please check your inbox.");
        setOtpSent(true);
      } else {
        setError("There was an error sending the OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while sending the OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateOtp = () => {
    setError(null);
    if (enteredOtp !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setOtpValidated(true);
    setSuccess("OTP validated successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 16) {
      setError("Password should be 8-16 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          updates: { password: newPassword },
        }),
      });

      if (response.ok) {
        setSuccess("Password reset successfully!");
        alert("Password reset successfully!");
        router.push("/login");
      } else {
        const result = await response.json();
        setError(result.error || "An error occurred while resetting the password.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while resetting the password.");
    } finally {
      setLoading(false);
    }
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
          {loading && <div className="loadingSpinner"></div>}
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.forgetInputBox}
                placeholder="Enter your Email"
                disabled={otpSent}
              />
              {!otpSent && (
                <button type="submit" onClick={handleSendOtp} className={styles.forgetSubmitButton}>
                  Send OTP
                </button>
              )}
            </div>
            {otpSent && !otpValidated && (
              <div>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  required
                  className={styles.forgetInputBox}
                  placeholder="Enter OTP"
                />
                <button type="button" onClick={handleValidateOtp} className={styles.forgetSubmitButton}>
                  Validate OTP
                </button>
              </div>
            )}
            {otpValidated && (
              <>
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
              </>
            )}
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