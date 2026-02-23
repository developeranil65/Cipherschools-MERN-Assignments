/**
 * @fileoverview HotTopics component.
 * Sidebar panel showing trending hashtags/categories
 */

import { FiTrendingUp } from "react-icons/fi";
import "./HotTopics.css";

function HotTopics({ confessions = [] }) {
    /* Count categories from real data */
    const catCounts = {};
    confessions.forEach((c) => {
        const cat = (c.category || "Secret").toLowerCase();
        catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    /* Build tag list — real categories + static popular tags */
    const tags = [
        ...Object.entries(catCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => ({ tag: `#${tag}`, count, hot: count >= 3 })),
        { tag: "#latenight", count: null, hot: false },
        { tag: "#exams", count: null, hot: false },
        { tag: "#hosteldiaries", count: null, hot: false },
        { tag: "#campuslife", count: null, hot: false },
    ];

    return (
        <div className="hottopics-panel">
            <h3 className="hottopics-title">
                <FiTrendingUp className="hottopics-title-icon" />
                Hot Topics
            </h3>
            <div className="hottopics-list">
                {tags.map((t) => (
                    <span
                        key={t.tag}
                        className={`hottopics-tag ${t.hot ? "hottopics-tag--hot" : ""}`}
                    >
                        {t.tag}
                        {t.count !== null && (
                            <span className="hottopics-count">{t.count}</span>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default HotTopics;
