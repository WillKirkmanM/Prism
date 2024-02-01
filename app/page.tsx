"use client"

import { useState } from 'react';
import { Center, Text, Title, Stack, Textarea, Button } from '@mantine/core';
import Link from 'next/link';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [uuid, setUUID] = useState<string | null>(null)

  async function handleSendMessage() {
    const response = await fetch('http://127.0.0.1:3001/messages/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
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