import React, { useState, useEffect } from "react";
import GroupChat from "@/components/GroupChat";
import Header from "@/components/Header";
import styles from "@/styles/GroupsPage.module.css";

const usersData = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
    { id: 5, name: "Eve" },
];

const groupsData = [
    { id: 1, name: "AI & Machine Learning", description: "Discuss AI trends, ML techniques.", academicInterest: "Artificial Intelligence" },
    { id: 2, name: "Career Development", description: "Grow your career with advice and resources.", academicInterest: "Career Counseling" },
    { id: 3, name: "Academic Research", description: "Collaborate on academic papers and projects.", academicInterest: "Research Methodology" },
    { id: 4, name: "Web Development", description: "Talk about web development tips and tools.", academicInterest: "Computer Science" },
];

export default function GroupsPage() {
    const [joinedGroups, setJoinedGroups] = useState([groupsData[0]]);
    const [availableGroups, setAvailableGroups] = useState(groupsData.filter(group => group.id !== 1));
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: "", description: "", academicInterest: "", members: [] });
    const [searchTerm, setSearchTerm] = useState("");

    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        const storedUserRole = sessionStorage.getItem("userRole");

        if (!storedUserId) {
            alert("Please login to continue");
            window.location.href = "/login";
        } else {
            setUserId(storedUserId);
            setUserRole(storedUserRole);
        }
    }, []);

    const handleGroupClick = (group) => {
        setSelectedGroup(group);
    };

    const handleJoinGroup = (groupToJoin) => {
        setJoinedGroups([...joinedGroups, groupToJoin]);
        setAvailableGroups(availableGroups.filter(group => group.id !== groupToJoin.id));
    };

    const handleBack = () => {
        setSelectedGroup(null);
    };

    const handleLeaveGroup = (groupToLeave) => {
        setJoinedGroups(joinedGroups.filter(group => group.id !== groupToLeave.id));
        setAvailableGroups([...availableGroups, groupToLeave]);
        setSelectedGroup(null);
    };

    const handleDeleteGroup = (groupToDelete) => {
        setJoinedGroups(joinedGroups.filter(group => group.id !== groupToDelete.id));
        setSelectedGroup(null);
    };

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
        const selectedMembers = Array.from(options).filter(option => option.selected).map(option => option.value);
        setNewGroup({ ...newGroup, members: selectedMembers });
    };

    const handleCreateGroup = (e) => {
        e.preventDefault();
        if (newGroup.name.trim() && newGroup.description.trim()) {
            const groupId = Math.max(...groupsData.map(g => g.id)) + 1;
            const createdGroup = { ...newGroup, id: groupId };
            setJoinedGroups([...joinedGroups, createdGroup]);
            setAvailableGroups(availableGroups.filter(group => group.id !== createdGroup.id));
            toggleModal();
        }
    };

    const filteredUsers = usersData.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <Header />
            <div className={styles.groupsPage}>
                <h1 className="pageTitle">Interest-Based Groups</h1>
                {!selectedGroup && (userRole !== "Student") && (
                    <button className={styles.createGroupButton} onClick={toggleModal}>
                        Create Group
                    </button>
                )}
                {selectedGroup ? (
                    <GroupChat
                        group={selectedGroup}
                        handleLeaveGroup={handleLeaveGroup}
                        handleBack={handleBack}
                        handleDeleteGroup={handleDeleteGroup}
                    />
                ) : (
                    <div>
                        <div>
                            <h2 className={styles.textCenter}>Your Groups</h2>
                            <div className={styles.groupsList}>
                                {joinedGroups.length === 0 ? (
                                    <p className={styles.textCenter}>You haven't joined any groups yet.</p>
                                ) : (
                                    joinedGroups.map((group) => (
                                        <div key={group.id} className={styles.groupTile} onClick={() => handleGroupClick(group)}>
                                            <h2>{group.name}</h2>
                                            <p>{group.description}</p>
                                            <p><strong>Academic Interest:</strong> {group.academicInterest}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div>
                            <h2 className={styles.textCenter}>You might like these Groups</h2>
                            <div className={styles.groupsList}>
                                {availableGroups.length === 0 ? (
                                    <p>No more groups available to join.</p>
                                ) : (
                                    availableGroups.map((group) => (
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
                                    onChange={handleGroupInputChange}
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
                                <select id="members" multiple onChange={handleMemberChange} className={styles.groupModalSelect}>
                                    {filteredUsers.map((user) => (
                                        <option key={user.id} value={user.name}>
                                            {user.name}
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