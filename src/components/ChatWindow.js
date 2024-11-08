import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/ChatWindow.module.css';

export default function ChatWindow({ chat }) {
  const [messages, setMessages] = useState([
    { sender: 'Alice', text: 'Hi there!', time: '10:01 AM', type: 'received' },
    { sender: 'You', text: 'Hello!', time: '10:02 AM', type: 'sent' },
    { sender: 'Alice', text: 'How are you?', time: '10:03 AM', type: 'received' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        sender: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sent',
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={styles.chatWindow}>
      <h2 style={{borderBottom: '1px solid gray'}}>Chat with {chat.name}</h2>
      <div className={styles.pmChatMessages}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.chatMessage} ${styles[msg.type]}`}>
            <p className={styles.messageText}>{msg.text}</p>
            <span className={styles.messageTime}>{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.messageInputSection}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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