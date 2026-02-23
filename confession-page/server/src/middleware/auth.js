
/**
 * Middleware: Ensures the request comes from an authenticated user.
 * If the user is not logged in, responds with a 401 Unauthorized status.
 *
 * @param {import('express').Request}  req  - Express request object
 * @param {import('express').Response} res  - Express response object
 * @param {import('express').NextFunction} next - Express next middleware
 */
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Please log in to access this resource." });
};

module.exports = { ensureAuthenticated };
