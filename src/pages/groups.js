import React, { useState, useEffect } from "react";
import GroupChat from "@/components/GroupChat";
import Header from "@/components/Header";
import styles from "@/styles/GroupsPage.module.css";
import { useRouter } from "next/router";

export default function GroupsPage() {
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    academicInterest: "",
    members: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const router = useRouter();

  const handleGroupClick = (group) => {
    const targetUrl = `/groups/${group.gid}`;
    router.push(targetUrl);
  };

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserRole = sessionStorage.getItem("userRole");

    if (!storedUserId) {
      alert("Please login to continue");
      window.location.href = "/login";
    } else {
      setUserId(storedUserId);
      setUserRole(storedUserRole);

      
      const fetchUserGroups = async (storedUserId) => {
        const res = await fetch(`/api/mygroups?userId=${storedUserId}`);
        const data = await res.json();
        
        if (data.groups) {
          setJoinedGroups(data.groups);
        }
        const availableRes = await fetch(`/api/mygroups?userId=${storedUserId}&excludeUserGroups=true`);
        const availableData = await availableRes.json();

        if (availableData.groups) {
          setAvailableGroups(availableData.groups); 
        }
      };
  
      fetchUserGroups(storedUserId);
    }
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      setNewGroup({ name: "", description: "", academicInterest: "", members: [] });
      setSearchTerm("");
    }
  };

  const handleGroupInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  const handleMemberChange = (e) => {
    const { options } = e.target;
    const selectedMembers = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setNewGroup({ ...newGroup, members: selectedMembers });
  };

  const handleAcademicInterestChange = async (e) => {
    const selectedInterest = e.target.value;
    setNewGroup({ ...newGroup, academicInterest: selectedInterest });

    const res = await fetch(`/api/groups?academicInterest=${selectedInterest}`);
    const data = await res.json();

    if (data.users) {
      const filtered = data.users.filter(user => user.uid !== userId);
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (newGroup.name.trim() && newGroup.description.trim()) {
      const groupData = {
        name: newGroup.name,
        description: newGroup.description,
        academicInterest: newGroup.academicInterest,
        createdUid: userId,
        members: [...newGroup.members, userId], 
      };

      const res = await fetch("/api/groups", {
        method: "POST",
        body: JSON.stringify(groupData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        setJoinedGroups([...joinedGroups, data.newGroup]);
        setAvailableGroups(availableGroups.filter(group => group.id !== data.newGroup.id));
        toggleModal();
        window.location.reload(); 
      } else {
        alert("Failed to create group");
      }
    }
  };

  const handleJoinGroup = async (group) => {
    const res = await fetch("/api/mygroups", {
      method: "PUT",
      body: JSON.stringify({ userId, groupId: group.gid }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.success) {
      setJoinedGroups([...joinedGroups, group]);
      setAvailableGroups(availableGroups.filter(g => g.gid !== group.gid));
    } else {
      alert("Failed to join group");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.groupsPage}>
        <h1 className="pageTitle">Interest-Based Groups</h1>
        {!selectedGroup && userRole !== "Student" && (
          <button className={styles.createGroupButton} onClick={toggleModal}>
            Create Group
          </button>
        )}
        {selectedGroup ? (
          <GroupChat group={selectedGroup} handleBack={() => setSelectedGroup(null)} />
        ) : (
          <div>
            <h2>Your Groups</h2>
            <div className={styles.groupsList}>
              {joinedGroups.length === 0 ? (
                <p>You haven't joined any groups yet.</p>
              ) : (
                joinedGroups.map(group => (
                  <div
                key={group.id}
                className={styles.groupTile}
                onClick={() => handleGroupClick(group)}
              >
                    <h2>{group.name}</h2>
                    <p>{group.description}</p>
                    <p><strong>Academic Interest:</strong> {group.academicInterest}</p>
                  </div>
                ))
              )}
            </div>
            <h2>You might like these Groups</h2>
            <div className={styles.groupsList}>
              {availableGroups.length === 0 ? (
                <p>No more groups available to join.</p>
              ) : (
                availableGroups.map(group => (
                  <div key={group.id} className={styles.groupTile}>
                    <h2>{group.name}</h2>
                    <p>{group.description}</p>
                    <p><strong>Academic Interest:</strong> {group.academicInterest}</p>
                    <button onClick={() => handleJoinGroup(group)} className={styles.joinButton}>
                      Join Group
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {modalOpen && (
          <div className={styles.groupModalOverlay}>
            <div className={styles.groupModalContent}>
              <h3>Create Group</h3>
              <form onSubmit={handleCreateGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Group Name"
                  value={newGroup.name}
                  onChange={handleGroupInputChange}
                  className={styles.groupModalInput}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Group Description"
                  value={newGroup.description}
                  onChange={handleGroupInputChange}
                  className={styles.groupModalTextarea}
                  required
                />
                <input
                  type="text"
                  name="academicInterest"
                  placeholder="Academic Interest"
                  value={newGroup.academicInterest}
                  onChange={handleAcademicInterestChange}
                  className={styles.groupModalInput}
                  required
                />
                <label htmlFor="members">Select Members:</label>
                <input
                  type="text"
                  placeholder="Search People"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.groupModalInput}
                />
                <select
                  id="members"
                  multiple
                  onChange={handleMemberChange}
                  className={styles.groupModalSelect}
                >
                  {filteredUsers.map(user => (
                    <option key={user.uid} value={user.uid}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
                <button type="submit" className={styles.groupModalButton}>Create</button>
                <button type="button" onClick={toggleModal} className={styles.groupModalButton}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
