/**
 * @fileoverview MyHistory page.
 * Displays the logged-in user's confessions with profile stats,
 * and provides edit/delete actions authenticated by secret codes.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getMyConfessions,
    updateConfession,
    deleteConfession,
} from "../services/api";
import ConfessionCard from "../components/ConfessionCard";
import SecretCodePrompt from "../components/SecretCodePrompt";
import "./MyHistory.css";

/**
 * MyHistory — Personal space showing user profile + their confessions.
 * Handles edit and delete flows via SecretCodePrompt modal.
 *
 * @param {{ refreshKey: number }} props
 */
function MyHistory({ refreshKey }) {
    const { user } = useAuth();
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);

    /* Secret code prompt state */
    const [promptOpen, setPromptOpen] = useState(false);
    const [promptAction, setPromptAction] = useState("edit");
    const [selectedConfession, setSelectedConfession] = useState(null);
    const [promptError, setPromptError] = useState("");

    /* Edit mode state */
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [editCode, setEditCode] = useState("");

    /** Fetches the user's confessions from the API. */
    const fetchMyConfessions = useCallback(async () => {
        try {
            const data = await getMyConfessions();
            setConfessions(data);
        } catch (error) {
            console.error("Failed to load your confessions:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyConfessions();
    }, [fetchMyConfessions, refreshKey]);

    /* ---------- Edit Flow ---------- */

    /** Opens the secret code prompt for editing. */
    const handleEditClick = (confession) => {
        setSelectedConfession(confession);
        setPromptAction("edit");
        setPromptError("");
        setPromptOpen(true);
    };

    /** Verifies the secret code, then enters inline edit mode. */
    const handleEditVerify = (code) => {
        setEditCode(code);
        setEditingId(selectedConfession._id);
        setEditText(selectedConfession.text);
        setPromptOpen(false);
    };

    /** Saves the edited confession to the API. */
    const handleEditSave = async () => {
        try {
            await updateConfession(editingId, {
                secretCode: editCode,
                text: editText,
            });
            setEditingId(null);
            setEditText("");
            setEditCode("");
            fetchMyConfessions();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update. Check your secret code.");
            setEditingId(null);
        }
    };

    /** Cancels inline edit mode without saving. */
    const handleEditCancel = () => {
        setEditingId(null);
        setEditText("");
        setEditCode("");
    };

    /* ---------- Delete Flow ---------- */

    /** Opens the secret code prompt for deletion. */
    const handleDeleteClick = (confession) => {
        setSelectedConfession(confession);
        setPromptAction("delete");
        setPromptError("");
        setPromptOpen(true);
    };

    /** Verifies the code and deletes the confession. */
    const handleDeleteVerify = async (code) => {
        try {
            await deleteConfession(selectedConfession._id, code);
            setPromptOpen(false);
            fetchMyConfessions();
        } catch (err) {
            setPromptError(
                err.response?.data?.message || "Incorrect secret code."
            );
        }
    };

    /* ---------- Prompt Submit Router ---------- */

    /** Routes the secret code submit to either edit or delete handler. */
    const handlePromptSubmit = (code) => {
        if (promptAction === "edit") {
            handleEditVerify(code);
        } else {
            handleDeleteVerify(code);
        }
    };

    /* ---------- Stats ---------- */
    const totalReactions = confessions.reduce(
        (sum, c) =>
            sum +
            (c.reactions?.like || 0) +
            (c.reactions?.love || 0) +
            (c.reactions?.laugh || 0),
        0
    );

    return (
        <>
            <div className="history-layout">
                <h1 className="history-heading">My Personal Space</h1>

                <div className="history-content">
                    {/* ---- Profile Card ---- */}
                    <div className="profile-card">
                        <img
                            className="profile-avatar"
                            src={user?.avatar}
                            alt={user?.displayName}
                            referrerPolicy="no-referrer"
                        />
                        <h2 className="profile-name">{user?.displayName}</h2>
                        <p className="profile-subtitle">Anonymous Confessor</p>
                        <div className="profile-stats">
                            <div className="profile-stat">
                                <span className="profile-stat-value">{confessions.length}</span>
                                <span className="profile-stat-label">SECRETS</span>
                            </div>
                            <div className="profile-stat">
                                <span className="profile-stat-value profile-stat-value--accent">
                                    {totalReactions}
                                </span>
                                <span className="profile-stat-label">HEARTS</span>
                            </div>
                        </div>
                    </div>

                    {/* ---- Confessions List ---- */}
                    <div className="history-list">
                        {loading ? (
                            <div className="history-loading">
                                <div className="feed-loader" />
                                <p>Loading your confessions...</p>
                            </div>
                        ) : confessions.length === 0 ? (
                            <div className="history-empty">
                                <span className="history-empty-icon">✍️</span>
                                <h3>No confessions yet</h3>
                                <p>Share your first secret anonymously!</p>
                            </div>
                        ) : (
                            confessions.map((confession) =>
                                editingId === confession._id ? (
                                    /* Inline edit form */
                                    <div key={confession._id} className="edit-inline">
                                        <textarea
                                            className="edit-textarea"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            rows={3}
                                        />
                                        <div className="edit-actions">
                                            <button className="edit-save" onClick={handleEditSave}>
                                                Save
                                            </button>
                                            <button className="edit-cancel" onClick={handleEditCancel}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <ConfessionCard
                                        key={confession._id}
                                        confession={confession}
                                        editable
                                        onEdit={() => handleEditClick(confession)}
                                        onDelete={() => handleDeleteClick(confession)}
                                        onUpdate={fetchMyConfessions}
                                    />
                                )
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Secret Code Prompt */}
            <SecretCodePrompt
                isOpen={promptOpen}
                action={promptAction}
                onClose={() => setPromptOpen(false)}
                onSubmit={handlePromptSubmit}
                error={promptError}
            />

        </>
    );
}

export default MyHistory;
