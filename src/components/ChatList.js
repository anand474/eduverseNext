import { useState, useEffect } from 'react';
import styles from '@/styles/ChatApp.module.css';

export default function ChatList({ chats, setSelectedChat }) {
  console.log("all chatt", chats);
  const [filteredChats, setFilteredChats] = useState(chats);

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  return (
    <div className={styles.chatListSection}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search chats..."
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = chats.filter((chat) =>
              chat.sender_name.toLowerCase().includes(searchTerm) ||
              chat.receiver_name.toLowerCase().includes(searchTerm)
            );
            setFilteredChats(filtered);
          }}
        />
      </div>

      <ul className={styles.chatList}>
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <li
              key={chat.id}
              className={styles.chatListItem}
              onClick={() => setSelectedChat(chat)} 
            >
              <div className={styles.chatListItemContent}>
                <div className={styles.chatName}>{chat.name}</div>

              </div>
            </li>
          ))
        ) : (
          <div className={styles.listTextCenter}>No chats available</div>
        )}
      </ul>
    </div>
  );
}