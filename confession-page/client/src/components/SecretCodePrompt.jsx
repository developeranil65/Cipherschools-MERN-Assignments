/**
 * @fileoverview SecretCodePrompt component.
 * A small modal dialog that asks the user for their secret code
 * before allowing them to edit or delete a confession.
 */

import { useState } from "react";
import { FiX } from "react-icons/fi";
import "./SecretCodePrompt.css";

/**
 * SecretCodePrompt — Modal for entering a secret code.
 * @param {Object}   props
 * @param {boolean}  props.isOpen  - Whether the prompt is visible
 * @param {string}   props.action  - "edit" or "delete" — used in the title
 * @param {Function} props.onClose - Called to close the prompt
 * @param {Function} props.onSubmit - Called with the entered secret code
 * @param {string}   props.error   - Error message from failed verification
 */
function SecretCodePrompt({ isOpen, action, onClose, onSubmit, error }) {
    const [code, setCode] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(code);
    };

    return (
        <div className="prompt-overlay" onClick={onClose}>
            <form
                className="prompt-content"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                {/* Header */}
                <div className="prompt-header">
                    <h3 className="prompt-title">
                        🔐 Enter Secret Code to {action === "edit" ? "Edit" : "Delete"}
                    </h3>
                    <button type="button" className="prompt-close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                {/* Input */}
                <input
                    type="password"
                    className="prompt-input"
                    placeholder="Enter your secret code..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoFocus
                />

                {/* Error */}
                {error && <p className="prompt-error">{error}</p>}

                {/* Actions */}
                <div className="prompt-actions">
                    <button type="button" className="prompt-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`prompt-submit ${action === "delete" ? "prompt-submit--danger" : ""}`}
                    >
                        {action === "edit" ? "Verify & Edit" : "Verify & Delete"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SecretCodePrompt;
