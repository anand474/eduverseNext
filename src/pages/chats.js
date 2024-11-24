import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import Header from '@/components/Header';
import AdminHeader from '@/components/AdminHeader';
import styles from '@/styles/ChatApp.module.css';

const socket = io('http://localhost:3001');

export default function ChatApp() {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);

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
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        console.log("Fetched all users", data);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    const fetchChats = async () => {
      try {
        const response = await fetch(`/api/chats?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch chats');
        const data = await response.json();

        console.log("Fetched all chats", data);

        const chatsMap = new Map();

        data.forEach((msg) => {
          const senderId = msg.sender_id;
          const receiverId = msg.receiver_id;
          const senderName = msg.sender_name;
          const receiverName = msg.receiver_name;
          const timestamp = msg.timestamp;
          const message = msg.message;

          console.log(message, timestamp);

          const isCurrentUserSender = senderId == userId;
          const otherUserId = isCurrentUserSender ? receiverId : senderId;
          const otherUserName = isCurrentUserSender ? receiverName : senderName;

          const chatKey = [Math.min(senderId, receiverId), Math.max(senderId, receiverId)].join('-');

          if (!chatsMap.has(chatKey)) {
            chatsMap.set(chatKey, {
              id: chatKey,
              name: otherUserName,
              receiver_id: otherUserId,
              receiver_name: otherUserName,
              messages: [],
            });
          }

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

        const processedChats = Array.from(chatsMap.values());

        setChats(processedChats);
        console.log(processedChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    }
    if (userId) {
      setLoading(true);
      fetchUsers();
      fetchChats();
      setLoading(false);
    }

    socket.on('receiveMessage', (data) => {
      if (selectedChat && selectedChat.chatId === data.chatId) {
        let msg = data.message;
        let isCurrentUserSender = msg.sender_id == userId;
        msg.type = isCurrentUserSender ? 'sent' : 'received';
        setSelectedChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, msg],
        }));
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userId, selectedChat]);

  async function handleSendMessage() {
    console.log("handleSendMessage outside", messageText, selectedChat);

    if (selectedChat && messageText.trim()) {
      const newMessage = {
        chatId: selectedChat.chatId,
        sender_id: userId,
        sender_name: userName,
        receiver_id: selectedChat.receiver_id,
        receiver_name: selectedChat.receiver_name,
        message: messageText,
        timestamp: (new Date().toISOString()).slice(0, -1) + "-06:00"
      };

      console.log('Message to send:', newMessage);

      socket.emit('sendMessage', newMessage);

      setMessageText('');
    }

    console.log("handleSendMessage outside DONE");
  };

  return (
    <>
      {userRole === 'Admin' ? <AdminHeader /> : <Header />}
      <div className={styles.chatApp}>
        {loading && <div className="loadingSpinner"></div>}
        <div className={styles.chatListSection}>
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