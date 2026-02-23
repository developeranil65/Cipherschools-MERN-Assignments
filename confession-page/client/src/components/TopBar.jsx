/**
 * @fileoverview TopBar component.
 * Horizontal header bar with welcome greeting, search, and notifications
 */

import { FiSearch, FiBell } from "react-icons/fi";
import "./TopBar.css";

function TopBar() {
    return (
        <header className="topbar">
            <div className="topbar-greeting">
                <span className="topbar-dot" />
                <span>Welcome back, friend</span>
            </div>

            <div className="topbar-right">
                <div className="topbar-search">
                    <FiSearch className="topbar-search-icon" />
                    <input
                        type="text"
                        placeholder="Search topics (e.g., #exams)..."
                        className="topbar-search-input"
                    />
                </div>
                <button className="topbar-bell" aria-label="Notifications">
                    <FiBell />
                </button>
            </div>
        </header>
    );
}

export default TopBar;
