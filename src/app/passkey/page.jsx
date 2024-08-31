"use client";
import React, { useState } from 'react';

const NativeFingerprintCheckin = () => {
  const [checkinStatus, setCheckinStatus] = useState('');

  const handleCheckin = async () => {
    if (!window.PublicKeyCredential) {
      setCheckinStatus('WebAuthn is not supported in this browser.');
      return;
    }

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions = {
        challenge: challenge,
        timeout: 60000,
        userVerification: "required"
      };

      const assertion = await navigator.credentials.get({
        publicKey: {
          ...publicKeyCredentialRequestOptions,
          challenge: Uint8Array.from(challenge)
        }
      });

      if (assertion) {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assertion),
        });

        const result = await res.json();
        if (result.verified) {
          setCheckinStatus('Checked in successfully!');
        } else {
          setCheckinStatus('Check-in failed. Please try again.');
        }
      } else {
        setCheckinStatus('Check-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setCheckinStatus('Check-in failed. ' + error.message);
    }
  };

  return (
    <div>
      <button onClick={handleCheckin}>Check In with Fingerprint</button>
      <p>{checkinStatus}</p>
    </div>
  );
};

export default NativeFingerprintCheckin;
