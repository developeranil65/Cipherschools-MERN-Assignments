/**
 * @fileoverview CampusTrends page.
 * Dashboard with activity chart, mood cloud, and stats cards.
 * Uses real confession data when available, falls back to dummy data
 */

import { useState, useEffect, useCallback } from "react";
import { getAllConfessions } from "../services/api";
import { FiMessageSquare, FiHeart, FiUsers } from "react-icons/fi";
import "./CampusTrends.css";

/* Dummy hourly distribution for a realistic-looking chart */
const DUMMY_HOURS = [
    2, 1, 1, 0, 0, 1, 3, 8, 14, 18, 22, 20,
    17, 15, 13, 16, 19, 24, 28, 26, 21, 15, 9, 5,
];

function CampusTrends({ refreshKey }) {
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConfessions = useCallback(async () => {
        try {
            const data = await getAllConfessions();
            setConfessions(data);
        } catch (error) {
            console.error("Failed to load confessions:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfessions();
    }, [fetchConfessions, refreshKey]);

    const hasRealData = confessions.length > 0;

    /* Compute stats from real data */
    const totalReactions = confessions.reduce(
        (sum, c) =>
            sum +
            (c.reactions?.like || 0) +
            (c.reactions?.love || 0) +
            (c.reactions?.laugh || 0),
        0
    );

    /* Hourly activity — use real data if available, else dummy */
    const hourlyData = (() => {
        if (!hasRealData) return DUMMY_HOURS;
        const hours = Array(24).fill(0);
        confessions.forEach((c) => {
            const hour = new Date(c.createdAt).getHours();
            hours[hour]++;
        });
        return hours;
    })();
    const maxHourly = Math.max(...hourlyData, 1);

    /* Category distribution — use real data if available, else dummy */
    const categoryCount = hasRealData
        ? confessions.reduce(
            (acc, c) => {
                const cat = c.category || "secret";
                if (acc[cat] !== undefined) acc[cat]++;
                return acc;
            },
            { crush: 0, study: 0, funny: 0, secret: 0 }
        )
        : { crush: 12, study: 8, funny: 15, secret: 6 };

    /* Display stats — use real data or dummy */
    const displayConfessions = hasRealData ? confessions.length : 14204;
    const displayReactions = hasRealData ? totalReactions : 85400;
    const displayCategories = hasRealData
        ? Object.values(categoryCount).filter((v) => v > 0).length
        : 4;

    const formatCount = (n) => {
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return n.toString();
    };

    if (loading) {
        return (
            <div className="trends-loading">
                <div className="feed-loader" />
                <p>Loading trends</p>
            </div>
        );
    }

    return (
        <div className="trends-page">
            <h1 className="trends-heading">Campus Trends</h1>

            {/* Chart panels */}
            <div className="trends-charts">
                {/* Most Active Hours */}
                <div className="trends-chart-card">
                    <h3 className="trends-chart-title">MOST ACTIVE HOURS</h3>
                    <div className="activity-chart">
                        {hourlyData.map((count, hour) => (
                            <div key={hour} className="activity-bar-group">
                                <div className="activity-bar-wrapper">
                                    <div
                                        className="activity-bar"
                                        style={{
                                            height: `${(count / maxHourly) * 100}%`,
                                        }}
                                    />
                                </div>
                                {hour % 4 === 0 && (
                                    <span className="activity-label">
                                        {hour === 0
                                            ? "12a"
                                            : hour < 12
                                                ? `${hour}a`
                                                : hour === 12
                                                    ? "12p"
                                                    : `${hour - 12}p`}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Mood Cloud */}
                <div className="trends-chart-card">
                    <h3 className="trends-chart-title">WEEKLY MOOD CLOUD</h3>
                    <div className="mood-cloud">
                        <span
                            className="mood-word mood-word--crush"
                            style={{
                                fontSize: `${Math.max(16, Math.min(38, categoryCount.crush * 2 + 16))}px`,
                            }}
                        >
                            Crush
                        </span>
                        <span
                            className="mood-word mood-word--study"
                            style={{
                                fontSize: `${Math.max(16, Math.min(38, categoryCount.study * 2 + 16))}px`,
                            }}
                        >
                            Study
                        </span>
                        <span
                            className="mood-word mood-word--funny"
                            style={{
                                fontSize: `${Math.max(16, Math.min(38, categoryCount.funny * 2 + 16))}px`,
                            }}
                        >
                            Funny
                        </span>
                        <span
                            className="mood-word mood-word--secret"
                            style={{
                                fontSize: `${Math.max(16, Math.min(38, categoryCount.secret * 2 + 16))}px`,
                            }}
                        >
                            Secret
                        </span>
                        <span className="mood-word mood-word--misc" style={{ fontSize: "18px" }}>
                            Exams
                        </span>
                        <span className="mood-word mood-word--misc" style={{ fontSize: "15px" }}>
                            Late Night
                        </span>
                        <span className="mood-word mood-word--misc" style={{ fontSize: "20px" }}>
                            Friends
                        </span>
                        <span className="mood-word mood-word--misc" style={{ fontSize: "14px" }}>
                            Campus Life
                        </span>
                        <span className="mood-word mood-word--misc" style={{ fontSize: "16px" }}>
                            Hostel
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats cards */}
            <div className="trends-stats">
                <div className="stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-label">Total Confessions</span>
                        <span className="stat-card-value">
                            {formatCount(displayConfessions)}
                        </span>
                    </div>
                    <div className="stat-card-icon stat-card-icon--confessions">
                        <FiMessageSquare />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-label">Support Given</span>
                        <span className="stat-card-value">
                            {formatCount(displayReactions)}
                        </span>
                    </div>
                    <div className="stat-card-icon stat-card-icon--support">
                        <FiHeart />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-label">Categories Active</span>
                        <span className="stat-card-value">{displayCategories}</span>
                    </div>
                    <div className="stat-card-icon stat-card-icon--campuses">
                        <FiUsers />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampusTrends;
