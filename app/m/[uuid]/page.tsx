"use client"

import { useState, useEffect } from 'react';
import { Center } from '@mantine/core';
import { useKeyPair } from '../../providers/KeyPairContext';

interface MessagePageProps {
  params: {
    uuid: string;
  };
}

export default function MessagePage({ params }: MessagePageProps) {
  const [message, setMessage] = useState('');
  const privateKey = useKeyPair()!.privateKey;

  useEffect(() => {
    async function fetchMessage() {
      const response = await fetch(`http://127.0.0.1:3001/messages/get`, {
        headers: {
          "uuid": params.uuid
        }
      });

      let { encryptedMessage } = await response.json();

      encryptedMessage = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0)).buffer;

      const decryptedMessage = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedMessage
      );

      const decodedMessage = new TextDecoder().decode(decryptedMessage);
 
  
      setMessage(decodedMessage);
    }

    fetchMessage();
  });

  return (
    <Center>
      {message && <div dangerouslySetInnerHTML={{ __html: message }} />}
    </Center>
  );
}