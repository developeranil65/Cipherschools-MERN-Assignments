
/**
 * Redirects user to Google consent screen.
 * Handled by Passport middleware in the route definition — this controller
 * is a no-op placeholder since Passport.authenticate() does the redirect.
 */
const googleLogin = (req, res) => {
    // Passport middleware handles the redirect — this line is never reached
    res.redirect("/");
};

/**
 * Callback handler after Google redirects back to our server.
 * On success, redirects the user to the frontend application.
 */
const googleCallback = (req, res) => {
    res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
};

/**
 * Logs the user out by destroying the session and clearing the cookie.
 */
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed." });
        }
        res.json({ message: "Logged out successfully." });
    });
};

/**
 * Returns the currently authenticated user or null if not logged in.
 * Used by the frontend to check login status on page load.
 */
const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
        return res.json(req.user);
    }
    res.json(null);
};

module.exports = { googleLogin, googleCallback, logout, getCurrentUser };
