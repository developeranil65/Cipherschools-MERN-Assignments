/**
 * @fileoverview WriteSecretModal component.
 * A dialog for composing and posting a new anonymous confession.
 * Includes a text area, category ("vibe") selector, and secret code input.
 */

import { useState } from "react";
import { FiX } from "react-icons/fi";
import { createConfession } from "../services/api";
import "./WriteSecretModal.css";

/** Available confession categories with emojis. */
const VIBES = [
    { label: "Crush", emoji: "❤️" },
    { label: "Study", emoji: "📚" },
    { label: "Funny", emoji: "🤣" },
    { label: "Secret", emoji: "🤫" },
];

/**
 * WriteSecretModal — Overlay dialog for creating a confession.
 * @param {Object}   props
 * @param {boolean}  props.isOpen  - Whether the modal is visible
 * @param {Function} props.onClose - Called to close the modal
 * @param {Function} props.onPost  - Called after a confession is successfully posted
 */
function WriteSecretModal({ isOpen, onClose, onPost }) {
    const [text, setText] = useState("");
    const [category, setCategory] = useState("Secret");
    const [secretCode, setSecretCode] = useState("");
    const [error, setError] = useState("");
    const [posting, setPosting] = useState(false);

    if (!isOpen) return null;

    /** Validates inputs and submits the confession to the API. */
    const handleSubmit = async () => {
        setError("");

        if (!text.trim()) {
            setError("Please write your confession.");
            return;
        }
        if (secretCode.length < 4) {
            setError("Secret code must be at least 4 characters.");
            return;
        }

        setPosting(true);
        try {
            await createConfession({ text: text.trim(), secretCode, category });
            // Reset form and notify parent
            setText("");
            setSecretCode("");
            setCategory("Secret");
            onPost();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to post confession.");
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Share a Secret</h2>
                        <p className="modal-subtitle">What's on your mind?</p>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                {/* Text Input */}
                <textarea
                    className="modal-textarea"
                    placeholder="Type your confession here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={1000}
                    rows={5}
                />

                {/* Category Selector */}
                <div className="modal-vibes">
                    <span className="modal-vibes-label">Choose a Vibe:</span>
                    <div className="modal-vibes-list">
                        {VIBES.map(({ label, emoji }) => (
                            <button
                                key={label}
                                className={`vibe-chip ${category === label ? "vibe-chip--active" : ""}`}
                                onClick={() => setCategory(label)}
                            >
                                {emoji} {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Secret Code Input */}
                <div className="modal-secret">
                    <label className="modal-secret-label" htmlFor="secret-code">
                        🔐 Secret Code <span className="modal-secret-hint">(min 4 chars — needed to edit/delete later)</span>
                    </label>
                    <input
                        id="secret-code"
                        type="password"
                        className="modal-secret-input"
                        placeholder="Enter your secret code..."
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                    />
                </div>

                {/* Error Message */}
                {error && <p className="modal-error">{error}</p>}

                {/* Footer */}
                <div className="modal-footer">
                    <span className="modal-anonymous">🔵 Anonymous</span>
                    <button
                        className="modal-post-btn"
                        onClick={handleSubmit}
                        disabled={posting}
                    >
                        {posting ? "Posting..." : "Post Secret"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WriteSecretModal;
