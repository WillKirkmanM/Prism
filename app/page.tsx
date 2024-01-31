"use client"

import { useState } from 'react';
import { Center, Textarea, Button, Text, Title, Stack } from '@mantine/core';

export default function HomePage() {
  const [message, setMessage] = useState('');

  async function sendMessage() {
    const response = await fetch('http://127.0.0.1:3001/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'message': message
      }
    });
    const encryptedMessage = response.text()

  }

  return (
    <>
      <Center>
        <Stack>
          <Center>
          <Title>Prism</Title>
          </Center>
          <Text>Millitary Grade End to End Encrypted Messages</Text>
        </Stack>
      </Center>
      <Center>
        <Stack p={100}>
          <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your Message"/>
          <Button onClick={handleClick}>Encrypt and Decrypt</Button>
        </Stack>
      </Center>
    </>
  );
}
