/**
 * @fileoverview LoginPage component.
 * Full-page login screen shown to unauthenticated users.
 * Features the app branding and a Google Sign-In button.
 */

import { useAuth } from "../context/AuthContext";
import { FaGoogle, FaUserSecret } from "react-icons/fa";
import "./LoginPage.css";

/** LoginPage — Centered full-page login with Google OAuth. */
function LoginPage() {
    const { login } = useAuth();

    return (
        <div className="login-page">
            {/* Background decoration */}
            <div className="login-bg-decoration" />

            <div className="login-card">
                {/* Branding */}
                <div className="login-logo">
                    <FaUserSecret className="login-logo-icon" />
                </div>
                <h1 className="login-title">Confess</h1>
                <p className="login-tagline">ANONYMOUS WALL</p>

                <p className="login-description">
                    Share your secrets anonymously. React, connect, and be part of a
                    supportive campus community
                </p>

                {/* Feature pills */}
                <div className="login-features">
                    <span className="login-feature">🔒 100% Anonymous</span>
                    <span className="login-feature">❤️ React & Support</span>
                    <span className="login-feature">🤫 Secret Codes</span>
                </div>

                {/* Google Sign-In */}
                <button className="login-google-btn" onClick={login}>
                    <FaGoogle className="login-google-icon" />
                    <span>Sign in with Google</span>
                </button>

                <p className="login-disclaimer">
                    Your identity stays anonymous — we only use Google for authentication
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
