import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/ChatWindow.module.css';

export default function ChatWindow({ chat, messageText, setMessageText, onSendMessage }) {
  const messagesEndRef = useRef(null);
  const [userId, setUser] = useState(null);

  console.log("in Chat", chat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage();
    }
  };

  useEffect(() => {
    let logged = sessionStorage.getItem("userId");
    if (logged) {
      setUser(logged);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat.messages]);

  const sortedMessages = chat.messages.slice().sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  console.log("Unsorted messages:", chat.messages);
  console.log("Sorted messages:", sortedMessages);

  return (
    <div className={styles.chatWindow}>
      <h2 style={{ borderBottom: '1px solid gray' }}>Chat with {chat.name}</h2>
      <div className={styles.pmChatMessages}>
        {sortedMessages.map((msg, index) => {
          return (
            <div key={index} className={`${styles.chatMessage} ${styles[msg.type]}`}>
              <p className={styles.messageText}>{msg.message}</p>
              <span className={styles.messageTime}>
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.messageInputSection}>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
