"use client"

import { useState } from 'react';

export default function HomePage() {
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    const response = await fetch('http://127.0.0.1:3001/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'message': message
      }
    });

    const encryptedMessage = await response.text();
    
    const decryptedResponse = await fetch('http://127.0.0.1:3001/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'message': encryptedMessage
      }
    });

    const decryptedMessage = await decryptedResponse.text();
  };

  return (
    <div>
      Home page
      <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleClick}>Encrypt and Decrypt</button>
    </div>
  );
}