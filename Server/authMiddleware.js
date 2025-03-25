require('dotenv').config();

module.exports = function isAuthenticated(req, res, next) {
  console.log("🔍 Checking authentication...");
  console.log("📌 Session Data:", req.session);

  if (req.session && req.session.user) {
    console.log("✅ User authenticated via session:", req.session.user);
    return next();
  }

  const clientApiKey = req.headers['x-api-key'];
  console.log("🔑 API Key Provided:", clientApiKey);

  if (clientApiKey && clientApiKey === process.env.CLIENT_API_KEY) {
    console.log("✅ User authenticated via API key.");
    return next();
  }

  console.log("❌ Unauthorized access attempt. No session or API key.");
  return res.status(401).json({ message: "Unauthorized. Please log in." });
};
