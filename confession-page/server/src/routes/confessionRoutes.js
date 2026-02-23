/**
 * @fileoverview Confession routes.
 * Defines REST API endpoints for creating, reading, updating,
 * deleting confessions and adding reactions.
 */

const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth");
const {
    createConfession,
    getAllConfessions,
    getUserConfessions,
    updateConfession,
    deleteConfession,
    addReaction,
    addComment,
} = require("../controllers/confessionController");

/**
 * @route   POST /api/confessions
 * @desc    Create a new anonymous confession (requires login)
 * @access  Private
 */
router.post("/", ensureAuthenticated, createConfession);

/**
 * @route   GET /api/confessions
 * @desc    Retrieve all confessions (newest first)
 * @access  Public
 */
router.get("/", getAllConfessions);

/**
 * @route   GET /api/confessions/mine
 * @desc    Retrieve confessions belonging to the logged-in user
 * @access  Private
 */
router.get("/mine", ensureAuthenticated, getUserConfessions);

/**
 * @route   PUT /api/confessions/:id
 * @desc    Update a confession (requires correct secret code)
 * @access  Public (secret code acts as authorization)
 */
router.put("/:id", updateConfession);

/**
 * @route   DELETE /api/confessions/:id
 * @desc    Delete a confession (requires correct secret code)
 * @access  Public (secret code acts as authorization)
 */
router.delete("/:id", deleteConfession);

/**
 * @route   POST /api/confessions/:id/react
 * @desc    Add a reaction (like, love, or laugh) to a confession
 * @access  Public
 */
router.post("/:id/react", addReaction);

/**
 * @route   POST /api/confessions/:id/comment
 * @desc    Add an anonymous comment to a confession
 * @access  Public
 */
router.post("/:id/comment", addComment);

module.exports = router;
