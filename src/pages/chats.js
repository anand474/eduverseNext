import React, { useState, useEffect } from 'react';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import AdminHeader from '@/components/AdminHeader';
import styles from '@/styles/ChatApp.module.css';
import { useRouter } from 'next/router';

export default function ChatApp() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

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

  const chats = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'David' },
    { id: 5, name: 'Eva' },
  ];

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm)
  );

  return (
    <>
      {userRole === "Admin" ? <AdminHeader /> : <Header />}
      <div className={styles.chatApp}>
        <div className={styles.chatListSection}>
          <SearchBar onSearch={handleSearch} />
          <ChatList chats={filteredChats} setSelectedChat={setSelectedChat} />
        </div>
        <div className={styles.chatWindowSection}>
          {selectedChat ? (
            <ChatWindow chat={selectedChat} />
          ) : (
            <div>Select a chat to start messaging</div>
          )}
        </div>
      </div>
    </>
  );
}