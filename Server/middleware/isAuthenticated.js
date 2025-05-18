

function isAuthenticated(req, res, next) {
  // Allow preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  // 1) If user is logged in via session, proceed
  if (req.session?.user) {
    return next();
  }

  // 2) Otherwise, if a valid API key header is present, proceed
  const clientApiKey = req.headers['x-api-key'];
  if (clientApiKey && clientApiKey === "superSecretClientKey12345") {
    return next();
  }

  // 3) Otherwise reject
  console.warn(`Unauthorized access attempt from IP ${req.ip}`);
  return res.status(401).json({ message: 'Unauthorized. Please log in or provide a valid API key.' });
}

module.exports = isAuthenticated;
