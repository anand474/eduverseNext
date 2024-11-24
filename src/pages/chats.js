import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import AdminHeader from '@/components/AdminHeader';
import styles from '@/styles/ChatApp.module.css';

const socket = io('http://localhost:3001');

export default function ChatApp() {
  const [users, setUsers] = useState([]); // List of all users
  const [chats, setChats] = useState([]); // Custom chat structure
  // const [filteredUsers, setFilteredUsers] = useState([]); // Filtered list of users based on search term
  const [selectedChat, setSelectedChat] = useState(null); // Currently selected chat
  // const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering users
  const [messageText, setMessageText] = useState(''); // Text of the new message to send
  const [userId, setUserId] = useState(null); // Logged-in user's ID
  const [userName, setUserName] = useState(null); // Logged-in user's name
  const [userRole, setUserRole] = useState(null); // Logged-in user's role (Admin or User)

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    const storedUserName = sessionStorage.getItem('userName');
    const storedUserRole = sessionStorage.getItem('userRole');

    if (!storedUserId) {
      alert('Please login to continue');
      window.location.href = '/login';
    } else {
      setUserId(storedUserId);
      setUserName(storedUserName);
      setUserRole(storedUserRole);
    }
  }, []);

  useEffect(() => {
    // Fetch users
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        console.log("Fetched all users", data);
        setUsers(data);
        // setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    // Fetch chats and process them into the custom structure
    async function fetchChats() {
      try {
        const response = await fetch(`/api/chats?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch chats');
        const data = await response.json();

        console.log("Fetched all chats", data);

        // Create a Map to group the messages by unique pairs of (sender_id, receiver_id)
        const chatsMap = new Map();

        data.forEach((msg) => {
          // Extract sender and receiver details
          const senderId = msg.sender_id;
          const receiverId = msg.receiver_id;
          const senderName = msg.sender_name;
          const receiverName = msg.receiver_name;
          const timestamp = msg.timestamp;
          const message = msg.message;

          // Check if the current message is between the current user and another user
          const isCurrentUserSender = senderId == userId;
          const otherUserId = isCurrentUserSender ? receiverId : senderId;
          const otherUserName = isCurrentUserSender ? receiverName : senderName;

          // Create a unique key for the chat (this key will be the combination of both user ids)
          const chatKey = [Math.min(senderId, receiverId), Math.max(senderId, receiverId)].join('-');

          // If this chatKey is not in the map, add a new chat object
          if (!chatsMap.has(chatKey)) {
            chatsMap.set(chatKey, {
              id: chatKey,
              name: otherUserName,
              receiver_id: otherUserId,
              receiver_name: otherUserName,
              messages: [],
            });
          }

          // Push the message to the chat object's messages array
          const chat = chatsMap.get(chatKey);
          chat.messages.push({
            sender_id: senderId,
            receiver_id: receiverId,
            message,
            timestamp,
            sender_name: senderName,
            receiver_name: receiverName,
            type: isCurrentUserSender ? 'sent' : 'received'
          });
        });

        // Convert Map values to an array and set it to the state
        const processedChats = Array.from(chatsMap.values());

        setChats(processedChats); // Update the state with processed chats
        console.log(processedChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    }
    if (userId) {
      fetchUsers();
      fetchChats();
    }

    socket.on('receiveMessage', (data) => {
      if (selectedChat && selectedChat.chatId === data.chatId) {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, data.message],
        }));
      } else {
        setChats((prevChats) => {
          const updatedChats = [...prevChats];
          const chatIndex = updatedChats.findIndex((chat) => chat.chatId === data.chatId);
          if (chatIndex !== -1) {
            updatedChats[chatIndex].lastMessage = data.message.text;
          }
          return updatedChats;
        });
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userId, selectedChat]);

  const handleSendMessage = async () => {
    console.log(messageText, selectedChat);

    if (selectedChat && messageText.trim()) {
      const newMessage = {
        chatId: selectedChat.chatId,
        sender_id: userId,
        sender_name: userName,
        receiver_id: selectedChat.receiver_id,
        receiver_name: selectedChat.receiver_name,
        message: messageText,
        timestamp: new Date().toTimeString()
      };

      console.log('Message to send:', newMessage);

      socket.emit('sendMessage', newMessage);

      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: [
          ...prevChat.messages,
          { ...newMessage, type: 'sent' },
        ],
      }));

      setMessageText('');
    }
  };


  return (
    <>
      {userRole === 'Admin' ? <AdminHeader /> : <Header />}
      <div className={styles.chatApp}>
        <div className={styles.chatListSection}>
          {/* <SearchBar onSearch={handleSearch} /> */}
          <ChatList chats={chats} setSelectedChat={setSelectedChat} />
        </div>
        <div className={styles.chatWindowSection}>
          {selectedChat ? (

            <ChatWindow
              chat={selectedChat}
              messageText={messageText}
              setMessageText={setMessageText}
              onSendMessage={handleSendMessage}
              userId={userId}
            />
          ) : (
            <div>Select a chat to start messaging</div>
          )}
        </div>
      </div>
    </>
  );
}