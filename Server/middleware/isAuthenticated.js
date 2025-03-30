function isAuthenticated(req, res, next) {
  // Bypass authentication for preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Check if a valid user session exists using optional chaining
  if (req.session?.user) {
    return next();
  }

  // Check for a valid API key in the request headers
  const clientApiKey = req.headers['x-api-key'];
  if (clientApiKey && clientApiKey === process.env.CLIENT_API_KEY) {
    return next();
  }

  // Log unauthorized access attempts for debugging purposes
  console.warn(`Unauthorized access attempt. Request IP: ${req.ip}`);
  return res.status(401).json({ message: "Unauthorized. Please log in." });
}

module.exports = isAuthenticated;
