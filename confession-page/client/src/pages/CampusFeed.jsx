/**
 * @fileoverview CampusFeed page.
 * Displays all confessions in a grid with click-to-expand detail modal.
 * Right sidebar shows HotTopics, SafeSpaceRules, and CampusMood panels.
 */

import { useState, useEffect, useCallback } from "react";
import { getAllConfessions } from "../services/api";
import ConfessionCard from "../components/ConfessionCard";
import ConfessionDetail from "../components/ConfessionDetail";
import HotTopics from "../components/HotTopics";
import SafeSpaceRules from "../components/SafeSpaceRules";
import CampusMood from "../components/CampusMood";
import "./CampusFeed.css";

function CampusFeed({ refreshKey }) {
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConfession, setSelectedConfession] = useState(null);

    const fetchConfessions = useCallback(async () => {
        try {
            const data = await getAllConfessions();
            setConfessions(data);
            /* Keep the open detail modal in sync after re-fetch */
            setSelectedConfession((prev) => {
                if (!prev) return null;
                return data.find((c) => c._id === prev._id) || null;
            });
        } catch (error) {
            console.error("Failed to load confessions:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfessions();
    }, [fetchConfessions, refreshKey]);

    return (
        <div className="feed-layout">
            {/* Main Feed Column */}
            <div className="feed-main">
                <h1 className="feed-heading">
                    <span className="feed-heading-hash">#</span> Trending on Campus
                </h1>

                {loading ? (
                    <div className="feed-loading">
                        <div className="feed-loader" />
                        <p>Loading confessions</p>
                    </div>
                ) : confessions.length === 0 ? (
                    <div className="feed-empty">
                        <span className="feed-empty-icon">🤫</span>
                        <h3>No confessions yet</h3>
                        <p>Be the first to share a secret</p>
                    </div>
                ) : (
                    <div className="feed-grid">
                        {confessions.map((confession) => (
                            <ConfessionCard
                                key={confession._id}
                                confession={confession}
                                onUpdate={fetchConfessions}
                                onClick={() => setSelectedConfession(confession)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <aside className="feed-sidebar">
                <HotTopics confessions={confessions} />
                <SafeSpaceRules />
                <CampusMood confessions={confessions} />
            </aside>

            {/* Detail Modal — opens when clicking a card */}
            {selectedConfession && (
                <ConfessionDetail
                    confession={selectedConfession}
                    onClose={() => setSelectedConfession(null)}
                    onUpdate={fetchConfessions}
                />
            )}
        </div>
    );
}

export default CampusFeed;
