import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import GuestHeader from "@/components/Header";
import styles from "@/styles/Register.module.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [academicInterests, setAcademicInterests] = useState("");
  const [researchInterests, setResearchInterests] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");
    if (userId) {
      const routes = {
        Admin: "/admin",
        Advisor: "/advisor",
        Mentor: "/mentor",
        Student: "/home",
      };
      router.replace(routes[userRole] || "/home");
    }
  },[router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError("Password should be 8-16 characters long");
      return;
    }

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      setError("Phone number must be 10 digits");
      return;
    }

    try {
      const adminId=process.env.NEXT_PUBLIC_ADMIN_ID;
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phoneNumber,
          type: "",
          academicInterests,
          researchInterests,
          adminId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User registered successfully:", data);

        const adminEmail = "admin@eduverse.com";
        const loginPageUrl = "http://localhost:3000/login";
        const emailResponse = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: adminEmail,
            subject: "New User Registration",
            html: `
              <div style="font-family: Arial, sans-serif; text-align: left; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #4CAF50; text-align: center;">New User Registration</h2>
                <p style="font-size: 16px; color: #333;">Dear ${fullName},</p>
                <p style="font-size: 16px; color: #333;">
                  A new user has just registered on the platform. Below are their details:
                </p>
                <ul style="font-size: 16px; line-height: 1.6; color: #555;">
                  <li><strong>Name:</strong> ${fullName}</li>
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Phone Number:</strong> ${phoneNumber}</li>
                </ul>
                <p style="font-size: 16px; color: #333;">
                  Please review the registration and assign a role to the user at your earliest convenience.
                </p>
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${loginPageUrl}" 
                     style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; 
                            color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                    Login to Admin Dashboard
                  </a>
                </div>
                <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: center;">
                  This is an automated message. Please do not reply to this email.
                </p>
              </div>
            `,
          }),
        });

        if (emailResponse.ok) {
          console.log("Email sent to admin successfully");
        } else {
          console.error("Failed to send email to admin");
        }

        alert("Registration successful! Your account is under review. Please wait for the admin to assign your role and activate your profile before you can log in.");
        router.push("/login");
      } else {
        console.log(JSON.stringify(data));
        alert(data.error || "Error registering user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <GuestHeader />
      <div
        className={`${styles.flex} ${styles.minHScreen} ${styles.p4}`}
        style={{ backgroundColor: "rgba(168,237,215,0.2)" }}
      >
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
          <h1 className={`${styles.text4xl} ${styles.mdText5xl} ${styles.heading}`}>
            Register
          </h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.wFull}>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={styles.inputBox}
              placeholder="Full Name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputBox}
              placeholder="Enter your Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputBox}
              placeholder="Enter your Password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.inputBox}
              placeholder="Re-enter your Password"
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className={styles.inputBox}
              placeholder="Phone Number"
              minLength={10}
              maxLength={10}
            />
            <input
              type="text"
              value={academicInterests}
              onChange={(e) => setAcademicInterests(e.target.value)}
              className={styles.inputBox}
              placeholder="Academic Interests"
            />
            <input
              type="text"
              value={researchInterests}
              onChange={(e) => setResearchInterests(e.target.value)}
              className={styles.inputBox}
              placeholder="Research Interests"
            />
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
            <div className={`${styles.mt4} ${styles.textCenter}`}>
              <a
                href="/"
                className={`${styles.textBlue} ${styles.hoverUnderline}`}
              >
                Already have an account? Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}