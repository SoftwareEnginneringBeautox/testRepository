// Middleware to check if a user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      // User is authenticated, proceed to the next middleware/route handler
      return next();
    }
    // User is not authenticated, send an error response
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }
  
  module.exports = isAuthenticated;