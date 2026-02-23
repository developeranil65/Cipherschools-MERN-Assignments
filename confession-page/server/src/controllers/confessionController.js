
const bcrypt = require("bcryptjs");
const Confession = require("../models/Confession");

/** Minimum length allowed for a secret code. */
const MIN_SECRET_CODE_LENGTH = 4;

/** Number of salt rounds used when hashing the secret code. */
const BCRYPT_SALT_ROUNDS = 10;


/**
 * Creates a new confession.
 * - Validates that text and secretCode are provided.
 * - Enforces minimum secret code length.
 * - Hashes the secret code before storing it.
 */
const createConfession = async (req, res) => {
    try {
        const { text, secretCode, category } = req.body;

        // -- Validation --
        if (!text || !secretCode) {
            return res
                .status(400)
                .json({ message: "Confession text and secret code are required." });
        }

        if (secretCode.length < MIN_SECRET_CODE_LENGTH) {
            return res.status(400).json({
                message: `Secret code must be at least ${MIN_SECRET_CODE_LENGTH} characters.`,
            });
        }

        // -- Hash the secret code so it's never stored in plain text --
        const hashedCode = await bcrypt.hash(secretCode, BCRYPT_SALT_ROUNDS);

        const confession = await Confession.create({
            text,
            secretCode: hashedCode,
            category: category || "Secret",
            userId: req.user.googleId,
        });

        // Return the confession without exposing the hashed secret code
        const response = confession.toObject();
        delete response.secretCode;

        res.status(201).json(response);
    } catch (error) {
        console.error("Create Confession Error:", error.message);
        res.status(500).json({ message: "Failed to create confession." });
    }
};

/**
 * Retrieves all confessions, sorted newest-first.
 * The secretCode field is excluded from the response for security.
 */
const getAllConfessions = async (_req, res) => {
    try {
        const confessions = await Confession.find()
            .select("-secretCode") // Never send hashed codes to the client
            .sort({ createdAt: -1 });

        res.json(confessions);
    } catch (error) {
        console.error("Get Confessions Error:", error.message);
        res.status(500).json({ message: "Failed to fetch confessions." });
    }
};

/**
 * Retrieves confessions belonging to the currently logged-in user.
 * The secretCode field is excluded from the response.
 */
const getUserConfessions = async (req, res) => {
    try {
        const confessions = await Confession.find({ userId: req.user.googleId })
            .select("-secretCode")
            .sort({ createdAt: -1 });

        res.json(confessions);
    } catch (error) {
        console.error("Get User Confessions Error:", error.message);
        res.status(500).json({ message: "Failed to fetch your confessions." });
    }
};

/**
 * Updates a confession's text after verifying the secret code.
 * Only the text and category fields can be modified.
 */
const updateConfession = async (req, res) => {
    try {
        const { secretCode, text, category } = req.body;

        if (!secretCode) {
            return res
                .status(400)
                .json({ message: "Secret code is required to edit." });
        }

        // Fetch the confession (include secretCode for verification)
        const confession = await Confession.findById(req.params.id);
        if (!confession) {
            return res.status(404).json({ message: "Confession not found." });
        }

        // Verify the secret code against the stored hash
        const isMatch = await bcrypt.compare(secretCode, confession.secretCode);
        if (!isMatch) {
            return res
                .status(403)
                .json({ message: "Incorrect secret code. Access denied." });
        }

        // Apply updates
        if (text) confession.text = text;
        if (category) confession.category = category;
        await confession.save();

        // Return updated confession without the secretCode
        const response = confession.toObject();
        delete response.secretCode;

        res.json(response);
    } catch (error) {
        console.error("Update Confession Error:", error.message);
        res.status(500).json({ message: "Failed to update confession." });
    }
};

/**
 * Deletes a confession after verifying the secret code.
 */
const deleteConfession = async (req, res) => {
    try {
        const { secretCode } = req.body;

        if (!secretCode) {
            return res
                .status(400)
                .json({ message: "Secret code is required to delete." });
        }

        const confession = await Confession.findById(req.params.id);
        if (!confession) {
            return res.status(404).json({ message: "Confession not found." });
        }

        // Verify the secret code
        const isMatch = await bcrypt.compare(secretCode, confession.secretCode);
        if (!isMatch) {
            return res
                .status(403)
                .json({ message: "Incorrect secret code. Access denied." });
        }

        await Confession.findByIdAndDelete(req.params.id);
        res.json({ message: "Confession deleted successfully." });
    } catch (error) {
        console.error("Delete Confession Error:", error.message);
        res.status(500).json({ message: "Failed to delete confession." });
    }
};

/**
 * Increments a reaction counter (like, love, or laugh) on a confession.
 * Accepts the reaction type in the request body.
 */
const addReaction = async (req, res) => {
    try {
        const { type } = req.body;
        const validTypes = ["like", "love", "laugh"];

        if (!validTypes.includes(type)) {
            return res.status(400).json({
                message: `Invalid reaction type. Must be one of: ${validTypes.join(", ")}`,
            });
        }

        // Atomically increment the specific reaction counter
        const confession = await Confession.findByIdAndUpdate(
            req.params.id,
            { $inc: { [`reactions.${type}`]: 1 } },
            { new: true }
        ).select("-secretCode");

        if (!confession) {
            return res.status(404).json({ message: "Confession not found." });
        }

        res.json(confession);
    } catch (error) {
        console.error("Add Reaction Error:", error.message);
        res.status(500).json({ message: "Failed to add reaction." });
    }
};

/**
 * Adds an anonymous comment to a confession.
 */
const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const confession = await Confession.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: { text: text.trim() } } },
            { new: true }
        ).select("-secretCode");

        if (!confession) {
            return res.status(404).json({ message: "Confession not found" });
        }

        res.json(confession);
    } catch (error) {
        console.error("Add Comment Error:", error.message);
        res.status(500).json({ message: "Failed to add comment" });
    }
};

module.exports = {
    createConfession,
    getAllConfessions,
    getUserConfessions,
    updateConfession,
    deleteConfession,
    addReaction,
    addComment,
};
