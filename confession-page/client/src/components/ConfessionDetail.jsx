/**
 * @fileoverview ConfessionDetail modal.
 * Opens when clicking a confession card — shows full text,
 * reactions (Hug/Same/Share), and a comment section
 */

import { useState } from "react";
import { FiHeart, FiSmile, FiShare2, FiX, FiSend } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { addReaction, addComment } from "../services/api";
import "./ConfessionDetail.css";

const CATEGORY_MAP = {
    Crush: { emoji: "❤️", className: "detail-cat--crush" },
    Study: { emoji: "📚", className: "detail-cat--study" },
    Funny: { emoji: "🤣", className: "detail-cat--funny" },
    Secret: { emoji: "🤫", className: "detail-cat--secret" },
};

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

function ConfessionDetail({ confession, onClose, onUpdate }) {
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [animating, setAnimating] = useState(null);

    const category = CATEGORY_MAP[confession.category] || CATEGORY_MAP.Secret;
    const comments = confession.comments || [];

    const handleReaction = async (type) => {
        setAnimating(type);
        try {
            await addReaction(confession._id, type);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error("Reaction failed:", err);
        }
        setTimeout(() => setAnimating(null), 400);
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || submitting) return;
        setSubmitting(true);
        try {
            await addComment(confession._id, commentText.trim());
            setCommentText("");
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error("Comment failed:", err);
        }
        setSubmitting(false);
    };

    const handleShare = () => {
        const shareText = `"${confession.text.slice(0, 100)}..." — Anonymous Confession`;
        if (navigator.share) {
            navigator.share({ text: shareText });
        } else {
            navigator.clipboard.writeText(shareText);
        }
    };

    return (
        <div className="detail-overlay" onClick={onClose}>
            <div className="detail-card" onClick={(e) => e.stopPropagation()}>
                {/* Close */}
                <button className="detail-close" onClick={onClose}>
                    <FiX />
                </button>

                {/* Header */}
                <div className="detail-header">
                    <div className="detail-avatar">🔒</div>
                    <div className="detail-meta">
                        <span className="detail-anon">Anonymous Student</span>
                        <span className="detail-time">
                            Posted {timeAgo(confession.createdAt)}
                        </span>
                    </div>
                    <span className={`detail-category ${category.className}`}>
                        {category.emoji} {confession.category}
                    </span>
                </div>

                {/* Body */}
                <p className="detail-text">{confession.text}</p>

                {/* Tags */}
                <div className="detail-tags">
                    <span className="detail-tag">#{confession.category?.toLowerCase()}</span>
                    <span className="detail-tag">#anonymous</span>
                </div>

                {/* Reactions bar */}
                <div className="detail-reactions">
                    <button
                        className={`detail-react-btn ${animating === "like" ? "detail-react--pop" : ""}`}
                        onClick={() => handleReaction("like")}
                    >
                        <FiHeart className="detail-react-icon detail-react-icon--like" />
                        <span>Hug ({confession.reactions?.like || 0})</span>
                    </button>
                    <button
                        className={`detail-react-btn ${animating === "love" ? "detail-react--pop" : ""}`}
                        onClick={() => handleReaction("love")}
                    >
                        <FaHeart className="detail-react-icon detail-react-icon--love" />
                        <span>Same ({confession.reactions?.love || 0})</span>
                    </button>
                    <div className="detail-react-spacer" />
                    <button className="detail-react-btn" onClick={handleShare}>
                        <FiShare2 className="detail-react-icon" />
                        <span>Share</span>
                    </button>
                </div>

                {/* Comments */}
                <div className="detail-comments">
                    <h4 className="detail-comments-title">
                        Friendly Echoes ({comments.length})
                    </h4>

                    {comments.length > 0 ? (
                        <div className="detail-comments-list">
                            {comments.map((c, i) => (
                                <div key={c._id || i} className="detail-comment">
                                    <span className="detail-comment-avatar">💬</span>
                                    <div className="detail-comment-body">
                                        <span className="detail-comment-text">{c.text}</span>
                                        <span className="detail-comment-time">
                                            {timeAgo(c.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="detail-comments-empty">
                            No echoes yet — be the first to respond
                        </p>
                    )}

                    {/* Comment input */}
                    <form className="detail-comment-form" onSubmit={handleComment}>
                        <input
                            className="detail-comment-input"
                            type="text"
                            placeholder="Write an anonymous echo..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            maxLength={500}
                        />
                        <button
                            className="detail-comment-send"
                            type="submit"
                            disabled={!commentText.trim() || submitting}
                        >
                            <FiSend />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ConfessionDetail;
