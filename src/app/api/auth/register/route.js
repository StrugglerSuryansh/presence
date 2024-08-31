import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  const { user } = req.body;

  const challenge = uuidv4();
  req.session.challenge = challenge;

  const publicKey = {
    challenge: Buffer.from(challenge, 'utf8').toString('base64'),
    rp: { name: "Your Company" },
    user: {
      id: Buffer.from(user.id, 'utf8').toString('base64'),
      name: user.name,
      displayName: user.displayName,
    },
    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
    authenticatorSelection: { authenticatorAttachment: "platform" },
    timeout: 60000,
    attestation: "direct",
  };

  res.status(200).json(publicKey);
}
