/**
 * @fileoverview CampusMood component.
 * Right-side panel showing reaction stats with progress bars.
 * Only uses real data from confessions — no hardcoded values
 */

import "./CampusMood.css";

function CampusMood({ confessions = [] }) {
    const totals = confessions.reduce(
        (acc, c) => ({
            like: acc.like + (c.reactions?.like || 0),
            love: acc.love + (c.reactions?.love || 0),
            laugh: acc.laugh + (c.reactions?.laugh || 0),
        }),
        { like: 0, love: 0, laugh: 0 }
    );

    const grandTotal = totals.like + totals.love + totals.laugh || 1;
    const pct = (count) => Math.round((count / grandTotal) * 100);

    return (
        <div className="mood-panel">
            <h3 className="mood-title">Campus Mood</h3>

            <div className="mood-stats">
                <div className="mood-stat">
                    <div className="mood-stat-header">
                        <span className="mood-stat-label">❤️ Liked</span>
                        <span className="mood-stat-value">{pct(totals.like)}%</span>
                    </div>
                    <div className="mood-bar">
                        <div
                            className="mood-bar-fill mood-bar-fill--like"
                            style={{ width: `${pct(totals.like)}%` }}
                        />
                    </div>
                </div>

                <div className="mood-stat">
                    <div className="mood-stat-header">
                        <span className="mood-stat-label">💖 Loved</span>
                        <span className="mood-stat-value">{pct(totals.love)}%</span>
                    </div>
                    <div className="mood-bar">
                        <div
                            className="mood-bar-fill mood-bar-fill--love"
                            style={{ width: `${pct(totals.love)}%` }}
                        />
                    </div>
                </div>

                <div className="mood-stat">
                    <div className="mood-stat-header">
                        <span className="mood-stat-label">😄 Funny</span>
                        <span className="mood-stat-value">{pct(totals.laugh)}%</span>
                    </div>
                    <div className="mood-bar">
                        <div
                            className="mood-bar-fill mood-bar-fill--laugh"
                            style={{ width: `${pct(totals.laugh)}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="mood-summary">
                <div className="mood-summary-item">
                    <span className="mood-summary-value">{confessions.length}</span>
                    <span className="mood-summary-label">Confessions</span>
                </div>
                <div className="mood-summary-item">
                    <span className="mood-summary-value">
                        {totals.like + totals.love + totals.laugh}
                    </span>
                    <span className="mood-summary-label">Reactions</span>
                </div>
            </div>
        </div>
    );
}

export default CampusMood;
