import { useState, useEffect } from "react";
import styles from "@/styles/Profile.module.css";
import Header from "@/components/Header";
import AdminHeader from "@/components/AdminHeader";
import { FaPencilAlt } from "react-icons/fa";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    user_type: '',
    academic_interests: '',
    research_interests: '',
    phone_number: '',
  });

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserRole = sessionStorage.getItem("userRole");

    if (!storedUserId) {
      alert("Please login to continue");
      router.push("/login");
    } else {
      setUserId(storedUserId);
      setUserRole(storedUserRole);
      fetchUserData(storedUserId);  
    }
  }, [router]);

  const fetchUserData = async (userId) => {  
    try {
      const response = await fetch(`/api/profile`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        setFormData({
          user_name: data.fullName || '',
          email: data.emailId || '',
          user_type: data.type || '',
          academic_interests: data.academic_interests || "Enter your academic interests.",
          research_interests: data.research_interests || "Enter your research interests.",
          phone_number: data.phoneNo || '',
        });
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleProfileEdit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.phone_number)) {
      alert("Phone number must be 10 digits.");
      return;
    }

    try {
      const response = await fetch(`/api/profile`, {  
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userId,user_name: formData.user_name,
          email: formData.email,
          academic_interests: formData.academic_interests,
          research_interests: formData.research_interests,
          phone_number: formData.phone_number,}),
      });
      if (response.ok) {
        setEditMode(false);
        alert("Profile saved successfully!");
      } else {
        alert("Failed to save profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const firstLetter = formData.user_name ? formData.user_name.charAt(0).toUpperCase() : '';

  return (
    <div>
      {userRole === "Admin" ? <AdminHeader /> : <Header />}
      <div className={styles.profileCard}>
        <div className={styles.image}>
          <div className={styles.profileIcon}>{firstLetter}</div>
          
        </div>

        <div className={styles.info}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.user_name}
            readOnly
            className={styles.input}
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className={styles.input}
          />
          <label>User Role</label>
          <input
            type="text"
            name="user_type"
            value={formData.user_type}
            readOnly
            className={styles.input}
          />
          <label>Academic Interests</label>
          <textarea
            name="academic_interests"
            value={formData.academic_interests}
            onChange={handleInputChange}
            className={`${styles.textarea} ${editMode ? styles.editable : styles.readOnly}`}
            placeholder="Your academic interests"
            readOnly={!editMode}
          />
          <label>Research Interests</label>
          <textarea
            name="research_interests"
            value={formData.research_interests}
            onChange={handleInputChange}
            className={`${styles.textarea} ${editMode ? styles.editable : styles.readOnly}`}
            placeholder="Your research interests"
            readOnly={!editMode}
          />
          <label>Mobile Number</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className={`${styles.input} ${editMode ? styles.editable : styles.readOnly}`}
            readOnly={!editMode}
          />
        </div>

        <div className={styles.buttons}>
          {!editMode ? (
            <button className={styles.editBtn} onClick={toggleEditMode}>
              Edit Profile
            </button>
          ) : (
            <button className={styles.saveBtn} onClick={handleProfileEdit}>
              Save Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
