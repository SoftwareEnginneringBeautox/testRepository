// middleware/isAuthenticated.js
require('dotenv').config(); // Load environment variables

function isAuthenticated(req, res, next) {
  // Check if a valid user session exists
  if (req.session && req.session.user) {
    return next();
  }

  // Check for a valid API key in the request headers
  const clientApiKey = req.headers['x-api-key'];
  if (clientApiKey && clientApiKey === process.env.CLIENT_API_KEY) {
    return next();
  }

  // If neither check passes, return an unauthorized error
  return res.status(401).json({ message: "Unauthorized. Please log in." });
}

module.exports = isAuthenticated;
