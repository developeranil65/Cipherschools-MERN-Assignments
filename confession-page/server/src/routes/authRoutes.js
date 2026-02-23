/**
 * @fileoverview Authentication routes.
 * Defines routes for Google OAuth login, callback, logout,
 * and checking the current authenticated user.
 */

const router = require("express").Router();
const passport = require("passport");
const {
    googleCallback,
    logout,
    getCurrentUser,
} = require("../controllers/authController");

/**
 * @route   GET /auth/google
 * @desc    Redirects the user to Google's consent screen
 * @access  Public
 */
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @route   GET /auth/google/callback
 * @desc    Google redirects here after user consents; Passport handles the token exchange
 * @access  Public
 */
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    googleCallback
);

/**
 * @route   GET /auth/logout
 * @desc    Logs the user out and destroys the session
 * @access  Private
 */
router.get("/logout", logout);

/**
 * @route   GET /auth/current-user
 * @desc    Returns the currently authenticated user (or null)
 * @access  Public
 */
router.get("/current-user", getCurrentUser);

module.exports = router;
