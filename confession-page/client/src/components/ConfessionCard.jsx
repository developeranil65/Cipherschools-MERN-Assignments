/**
 * @fileoverview ConfessionCard component.
 * Renders an individual confession with its category badge, text,
 * anonymous identifier, time ago, and reaction buttons.
 * Optionally shows edit/delete actions when in "editable" mode.
 */

import { useState } from "react";
import { FiHeart, FiSmile, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { addReaction } from "../services/api";
import "./ConfessionCard.css";

/** Maps category names to their CSS modifier class and emoji. */
const CATEGORY_MAP = {
    Crush: { emoji: "❤️", className: "category--crush" },
    Study: { emoji: "📚", className: "category--study" },
    Funny: { emoji: "🤣", className: "category--funny" },
    Secret: { emoji: "🤫", className: "category--secret" },
};

/**
 * Converts a Date string into a human-readable "time ago" label.
 * @param {string} dateString - ISO date string from the server
 * @returns {string} e.g. "2m ago", "3h ago", "5d ago"
 */
function timeAgo(dateString) {
    const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

/**
 * Generates a short anonymous identifier from a confession ID.
 * @param {string} id - MongoDB ObjectId string
 * @returns {string} e.g. "Anon #8F3"
 */
function anonTag(id) {
    return `Anon #${id.slice(-3).toUpperCase()}`;
}

/**
 * ConfessionCard — Displays a single confession entry.
 * @param {Object} props
 * @param {Object}   props.confession  - The confession data object
 * @param {boolean}  props.editable    - Whether to show edit/delete buttons
 * @param {Function} props.onEdit      - Called when the edit button is clicked
 * @param {Function} props.onDelete    - Called when the delete button is clicked
 * @param {Function} props.onUpdate    - Called after a reaction to refresh data
 */
function ConfessionCard({ confession, editable, onEdit, onDelete, onUpdate, onClick }) {
    const [animatingReaction, setAnimatingReaction] = useState(null);
    const category = CATEGORY_MAP[confession.category] || CATEGORY_MAP.Secret;

    /**
     * Sends a reaction to the API and triggers a brief pop animation.
     * @param {string} type - "like", "love", or "laugh"
     */
    const handleReaction = async (type, e) => {
        if (e) e.stopPropagation();
        setAnimatingReaction(type);
        try {
            await addReaction(confession._id, type);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Reaction failed:", error);
        }
        setTimeout(() => setAnimatingReaction(null), 400);
    };

    return (
        <div className="confession-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
            {/* ---- Header: category badge + time ago ---- */}
            <div className="confession-header">
                <span className={`confession-category ${category.className}`}>
                    {category.emoji} {confession.category}
                </span>
                <span className="confession-time">{timeAgo(confession.createdAt)}</span>
            </div>

            {/* ---- Body: confession text ---- */}
            <p className="confession-text">{confession.text}</p>

            {/* ---- Footer: anon tag + reactions + actions ---- */}
            <div className="confession-footer">
                <span className="confession-anon">
                    🔒 {anonTag(confession._id)}
                </span>

                <div className="confession-reactions">
                    {/* Like */}
                    <button
                        className={`reaction-btn ${animatingReaction === "like" ? "reaction-btn--pop" : ""}`}
                        onClick={(e) => handleReaction("like", e)}
                        title="Like"
                    >
                        <FiHeart className="reaction-icon reaction-icon--like" />
                        <span>{confession.reactions?.like || 0}</span>
                    </button>

                    {/* Love */}
                    <button
                        className={`reaction-btn ${animatingReaction === "love" ? "reaction-btn--pop" : ""}`}
                        onClick={(e) => handleReaction("love", e)}
                        title="Love"
                    >
                        <FaHeart className="reaction-icon reaction-icon--love" />
                        <span>{confession.reactions?.love || 0}</span>
                    </button>

                    {/* Laugh */}
                    <button
                        className={`reaction-btn ${animatingReaction === "laugh" ? "reaction-btn--pop" : ""}`}
                        onClick={(e) => handleReaction("laugh", e)}
                        title="Laugh"
                    >
                        <FiSmile className="reaction-icon reaction-icon--laugh" />
                        <span>{confession.reactions?.laugh || 0}</span>
                    </button>
                </div>

                {/* Edit / Delete — only visible in My History */}
                {editable && (
                    <div className="confession-actions">
                        <button className="action-btn action-btn--edit" onClick={onEdit} title="Edit">
                            <FiEdit2 />
                        </button>
                        <button className="action-btn action-btn--delete" onClick={onDelete} title="Delete">
                            <FiTrash2 />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConfessionCard;
