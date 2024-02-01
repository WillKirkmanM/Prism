
"use client"

import React, { createContext, useState, useEffect, useContext } from 'react';

const KeyPairContext = createContext<CryptoKeyPair | null>(null);

export default function KeyPairProvider({ children }: { children: React.ReactNode }) {
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      setKeyPair(keyPair);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <KeyPairContext.Provider value={keyPair}>
      {children}
    </KeyPairContext.Provider>
  );
}

export function useKeyPair() {
  return useContext(KeyPairContext);
}