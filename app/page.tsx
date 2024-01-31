"use client"

import { useState } from 'react';
import { Center, Textarea, Button, Text, Title, Stack } from '@mantine/core';
import Link from 'next/link';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [uuid, setUUID] = useState<string | null>(null)

  async function sendMessage() {
    const encrypt = await fetch('http://127.0.0.1:3001/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
      });

    const encryptedMessage = await encrypt.text()
    console.log("Encrypted Message: ", encryptedMessage)

    const add = await fetch('http://127.0.0.1:3001/messages/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: encryptedMessage })
    })
    const { uuid } = await add.json()
    console.log("uuid: ", uuid)
    setUUID(uuid)
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
          <Button onClick={sendMessage}>Encrypt</Button>

          {uuid && (
            <Link href={`http://localhost:3000/m/${uuid}`}>
              <Text>http://localhost:3000/m/{uuid}</Text>
            </Link>
          )}
        </Stack>
      </Center>
    </>
  );
}
