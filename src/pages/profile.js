import { useState, useEffect } from "react";
import styles from "@/styles/Profile.module.css";
import Header from "@/components/Header";
import AdminHeader from "@/components/AdminHeader";
import defaultProfileImage from "/public/assets/profileImage.jpg";
import { FaPencilAlt } from "react-icons/fa";
import { users } from "@/data/loadData";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserRole = sessionStorage.getItem("userRole");

    if (!storedUserId) {
      alert("Please login to continue");
      router.push("/login");
    } else {
      setUserId(storedUserId);
      setUserRole(storedUserRole);
    }
  }, [router]);

  const currentUser = users[userId] || {};
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    ...currentUser,
    academic_interests: "Enter your academic interests.",
    research_interests: "Enter your research interests."
  });

  console.log('currentUser', currentUser);
  console.log('formData', formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleProfileEdit = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone_number)) {
      alert("Phone number must be 10 digits.");
      return;
    }
    setEditMode(false);
    alert("Profile saved successfully!");
  };

  return (
    <div>
      {userRole === "Admin" ? <AdminHeader /> : <Header />}
      <div className={styles.profileCard}>
        <div className={styles.image}>
          <Image src={profileImage} alt="Profile" width={150} height={150} />

          <div className={styles.icon}>
            <FaPencilAlt
              onClick={() => document.getElementById("imageUpload").click()}
            />
          </div>

          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            onChange={handleProfileImageChange}
            style={{ display: "none" }}
          />
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