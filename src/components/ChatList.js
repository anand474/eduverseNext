import React from 'react';
import styles from '@/styles/ChatApp.module.css';

export default function ChatList({ chats, setSelectedChat }) {
  return (
    <ul className={styles.chatList}>
      {chats.map(chat => (
        <li key={chat.id} onClick={() => setSelectedChat(chat)} className={styles.listTextCenter}>
          {chat.name}
        </li>
      ))}
    </ul>
  );
}