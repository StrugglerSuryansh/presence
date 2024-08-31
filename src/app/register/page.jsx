"use client";
import React, { useState } from 'react';

const RegisterFingerprint = () => {
  const [registerStatus, setRegisterStatus] = useState('');

  const handleRegister = async () => {
    if (!window.PublicKeyCredential) {
      setRegisterStatus('WebAuthn is not supported in this browser.');
      return;
    }

    try {
      // Request registration options from the server
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { id: 'user-id', name: 'user@example.com', displayName: 'User Name' } }),
      });
      const publicKey = await res.json();

      // Register the credential
      const credential = await navigator.credentials.create({
        publicKey: {
          ...publicKey,
          challenge: Uint8Array.from(atob(publicKey.challenge), c => c.charCodeAt(0)),
        },
      });

      // Send the credential to the server for storage
      await fetch('/api/auth/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credential),
      });

      setRegisterStatus('Registration successful!');
    } catch (error) {
      console.error('Error:', error);
      setRegisterStatus('Registration failed. ' + error.message);
    }
  };

  return (
    <div>
      <button onClick={handleRegister}>Register Fingerprint</button>
      <p>{registerStatus}</p>
    </div>
  );
};

export default RegisterFingerprint;
