const preventBackAfterLogout = (req, res, next) => {
    if (!res.headersSent) {
      // Clear any previous no-cache headers
      res.set('Cache-Control', '');
  
      // Set a no-cache header
      res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    }
    next();
  }

  module.exports = preventBackAfterLogout;