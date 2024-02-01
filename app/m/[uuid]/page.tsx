"use client"
import { useState, useEffect } from 'react';
import { Center } from '@mantine/core';

interface MessagePageProps {
  params: {
    uuid: string;
  };
}

export default function MessagePage({ params }: MessagePageProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchMessage() {
      const response = await fetch(`http://127.0.0.1:3001/messages/get`, {
        headers: {
          "uuid": params.uuid
        }
      });

      const { encryptedMessage } = await response.json();
      setMessage(encryptedMessage);
    }

    fetchMessage();
  });

  return (
    <Center>
      {message && <div dangerouslySetInnerHTML={{ __html: message }} />}
    </Center>
  );
}