export default function handler(req, res) {
  res.json({ 
    message: 'Simple API working',
    method: req.method,
    timestamp: Date.now()
  });
}