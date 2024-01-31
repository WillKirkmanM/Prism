"use client"

import { Center } from '@mantine/core';
import { useEffect, useState } from 'react';

interface MessagePageProps {
  params: {
    uuid: string
  }
}

export default function MessagePage({ params }: MessagePageProps) {
const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function getMessage() {
      const response = await fetch(`http://localhost:3001/messages/get`, {
        headers: {
          'uuid': params.uuid
        }
      });

      const { encryptedMessage } = await response.json();

      const decryptResponse = await fetch('http://localhost:3001/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: encryptedMessage })
        })

      const decryptedMessage = (await decryptResponse.text()).replace(/\\n/g, '<br/>');
      setMessage(decryptedMessage);
    }

    getMessage();
  });

  return (
    <Center>
      {message && <div dangerouslySetInnerHTML={{ __html: message }} />}
    </Center>
  )
}