/**
 * @fileoverview Sidebar navigation component.
 * Displays the app branding, nav links (Campus Feed, My History),
 * a "Write Secret" CTA button, and the currently logged-in user's info.
 */

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiHome, FiClock, FiTrendingUp, FiEdit2, FiLogOut } from "react-icons/fi";
import { FaUserSecret } from "react-icons/fa";
import "./Sidebar.css";

/**
 * Sidebar — Persistent left-side navigation panel.
 * @param {{ onWriteClick: Function }} props
 *   - onWriteClick: callback to open the Write Secret modal
 */
function Sidebar({ onWriteClick }) {
    const { user, logout } = useAuth();

    return (
        <aside className="sidebar">
            {/* ---- Branding ---- */}
            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    <FaUserSecret className="sidebar-logo-icon" />
                </div>
                <div className="sidebar-brand-text">
                    <span className="sidebar-brand-name">Confess</span>
                    <span className="sidebar-brand-tagline">ANONYMOUS WALL</span>
                </div>
            </div>

            {/* ---- Navigation Links ---- */}
            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "sidebar-link--active" : ""}`
                    }
                >
                    <FiHome className="sidebar-link-icon" />
                    <span>Campus Feed</span>
                </NavLink>

                <NavLink
                    to="/trends"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "sidebar-link--active" : ""}`
                    }
                >
                    <FiTrendingUp className="sidebar-link-icon" />
                    <span>Campus Trends</span>
                </NavLink>

                <NavLink
                    to="/history"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "sidebar-link--active" : ""}`
                    }
                >
                    <FiClock className="sidebar-link-icon" />
                    <span>My History</span>
                </NavLink>
            </nav>

            {/* ---- Write Secret Button ---- */}
            <button className="sidebar-write-btn" onClick={onWriteClick}>
                <FiEdit2 className="sidebar-write-icon" />
                <span>Write Secret</span>
            </button>

            {/* ---- User Profile ---- */}
            {user && (
                <div className="sidebar-user">
                    <img
                        className="sidebar-avatar"
                        src={user.avatar}
                        alt={user.displayName}
                        referrerPolicy="no-referrer"
                    />
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{user.displayName}</span>
                        <span className="sidebar-user-status">Online</span>
                    </div>
                    <button
                        className="sidebar-logout-btn"
                        onClick={logout}
                        title="Log out"
                    >
                        <FiLogOut />
                    </button>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
