import { useState } from "react";
import styles from "@/styles/Contact.module.css";
import Header from "@/components/Header";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    const { firstName, lastName, phone, email, message } = formData;

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email address";
    if (!message.trim()) newErrors.message = "Message is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        const response = await fetch("/api/contactUs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // console.log(process.env.ADMIN_ID, process.env.ADMINID);
          const notificationResponse = await fetch("/api/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: process.env.NEXT_PUBLIC_ADMIN_ID,
              message: `New Contact Us message from ${formData.firstName} ${formData.lastName} (${formData.email}): ${formData.message}`,
            }),
          });

          const notificationData = await notificationResponse.json();
          if (!notificationResponse.ok) {
            console.error(notificationData.error || "Failed to send notification");
          }

          setFormData({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            message: "",
          });
          setErrors({});
          setIsModalOpen(true);
          setLoading(false);
        } else {
          const data = await response.json();
          setErrors({ form: data.error || "Failed to submit message" });
          setLoading(false);
        }
      } catch (error) {
        setErrors({ form: "Failed to submit message" });
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div>
      <Header />

      <div className={styles.contactContainer}>
        <h2 className="pageTitle">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
            />
            {loading && <div className="loadingSpinner"></div>}
            {errors.firstName && (
              <span className={styles.errorMessage}>{errors.firstName}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <span className={styles.errorMessage}>{errors.lastName}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <span className={styles.errorMessage}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Write your message"
            ></textarea>
            {errors.message && (
              <span className={styles.errorMessage}>{errors.message}</span>
            )}
          </div>

          <div className={styles.submitBtn}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <div className={styles.contactmodalOverlay}>
          <div className={styles.contactmodal}>
            <p>Thank you! We will get back to you soon.</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
