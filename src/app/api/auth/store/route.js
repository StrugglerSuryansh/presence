export default function handler(req, res) {
    const { id, rawId, response, type } = req.body;
  
    // Implement logic to store the credential in the database
    // For simplicity, this example assumes successful storage
  
    res.status(200).json({ success: true });
  }
  