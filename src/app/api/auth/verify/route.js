export default function handler(req, res) {
    const { id, rawId, response } = req.body;
  
    // Retrieve the expected challenge from the session
    const expectedChallenge = req.session.challenge;
  
    // Implement credential verification logic here
    // This usually involves verifying signatures and other details
  
    if (expectedChallenge !== response.clientDataJSON.challenge) {
      return res.status(400).json({ error: 'Challenge does not match.' });
    }
  
    // For simplicity, assume the verification is successful
    res.status(200).json({ verified: true });
  }
  