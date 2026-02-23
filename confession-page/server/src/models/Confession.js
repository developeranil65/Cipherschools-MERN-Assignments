
const mongoose = require("mongoose");

/**
 * @typedef {Object} Confession
 * @property {string}  text       - The confession text content
 * @property {string}  secretCode - Bcrypt-hashed secret code for edit/delete
 * @property {string}  category   - One of: Crush, Study, Funny, Secret
 * @property {Object}  reactions  - Counters for like, love, and laugh reactions
 * @property {string}  userId     - Google account ID of the confession author
 * @property {Date}    createdAt  - Timestamp of when the confession was posted
 */
const confessionSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, "Confession text is required"],
            trim: true,
            maxlength: [1000, "Confession cannot exceed 1000 characters"],
        },
        secretCode: {
            type: String,
            required: [true, "Secret code is required"],
        },
        category: {
            type: String,
            enum: ["Crush", "Study", "Funny", "Secret"],
            default: "Secret",
        },
        reactions: {
            like: { type: Number, default: 0 },
            love: { type: Number, default: 0 },
            laugh: { type: Number, default: 0 },
        },
        comments: [
            {
                text: { type: String, required: true, trim: true, maxlength: 500 },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        userId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model("Confession", confessionSchema);
