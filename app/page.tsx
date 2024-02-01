"use client"

import { useState } from 'react';
import { Center, Text, Title, Stack, Textarea, Button } from '@mantine/core';
import Link from 'next/link';
import { useKeyPair } from './providers/KeyPairContext';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [uuid, setUUID] = useState<string | null>(null)
  const publicKey = useKeyPair()!.publicKey;

  async function handleSendMessage() {

    const encodedMessage = new TextEncoder().encode(message);
    const encryptedMessage = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      encodedMessage
    );

    const encryptedMessageBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedMessage)));

    const response = await fetch('http://127.0.0.1:3001/messages/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: encryptedMessageBase64 }),
    });

    const result = await response.json();
    setUUID(result.uuid);
  } 

  return (
    <Center>
      <Stack>
        <Title order={2}>Send a message</Title>
        <Text>Enter your message below and click send.</Text>
        <Stack p={100}>
          <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your Message"/>
          <Button onClick={handleSendMessage}>Encrypt</Button>
      
          {uuid && (
            <Link href={`${window.location.origin}/m/${uuid}`}>
              <Text>{window.location.origin}/m/{uuid}</Text>
            </Link>
          )}
        </Stack>
      </Stack>
    </Center>
  );
}