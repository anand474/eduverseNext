import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/ChatWindow.module.css';

export default function ChatWindow({ chat, messageText, setMessageText, onSendMessage }) {
  const messagesEndRef = useRef(null);
  const [userId, setUser] = useState(null);

  console.log("in Chat", chat);

  function handleSendMessage() {
    if (messageText.trim()) {
      console.log("handleSendMessage inside", messageText);
      onSendMessage(messageText);
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
    return Date(a.timestamp) - Date(b.timestamp);
  });

  const adjustTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    date.setHours(date.getHours() - 6);
    return date.toLocaleString(); 
  };

  console.log("Unsorted messages:", chat.messages);
  console.log("Sorted messages:", sortedMessages);

  return (
    <div className={styles.chatWindow}>
      <h2 style={{ borderBottom: '1px solid gray' }}>Chat with {chat.name}</h2>
      <div className={styles.pmChatMessages}>
        {sortedMessages.map((msg, index) => {
          console.log("printing the Timestamp : ", msg, msg.timestamp);
          return (
            <div key={index} className={`${styles.chatMessage} ${styles[msg.type]}`}>
              <p className={styles.messageText}>{msg.message}</p>
              <span className={styles.messageTime}>
                {adjustTimestamp(msg.timestamp)}
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
              console.log("Send clicked");
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
