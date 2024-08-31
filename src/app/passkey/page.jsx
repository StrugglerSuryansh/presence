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
      // Check if the browser supports biometric authentication
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        setCheckinStatus('Biometric authentication is not available on this device.');
        return;
      }

      // Create a challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Create public key credential request options
      const publicKeyCredentialRequestOptions = {
        challenge: challenge,
        timeout: 60000,
        userVerification: "required"
      };

      // Request the credential
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (assertion) {
        setCheckinStatus('Checked in successfully!');
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