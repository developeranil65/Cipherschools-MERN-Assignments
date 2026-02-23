/**
 * @fileoverview Root App component.
 * Renders the main application layout with sidebar navigation,
 * top bar, and routed page content. Shows a login page for
 * unauthenticated users. Manages the "Write Secret" modal state
 * at the app level so both the Sidebar button and pages can trigger it.
 */

import { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import CampusFeed from "./pages/CampusFeed";
import CampusTrends from "./pages/CampusTrends";
import MyHistory from "./pages/MyHistory";
import LoginPage from "./pages/LoginPage";
import WriteSecretModal from "./components/WriteSecretModal";
import "./App.css";

/**
 * App — The root layout component.
 * If auth is loading, shows a spinner. If the user is not logged in,
 * renders the login page. Otherwise, renders the full dashboard layout.
 */
function App() {
  const { user, loading } = useAuth();
  const [writeModalOpen, setWriteModalOpen] = useState(false);

  /**
   * refreshKey is incremented after posting a confession to trigger
   * a re-fetch in whichever page is currently mounted.
   */
  const [refreshKey, setRefreshKey] = useState(0);

  /** Called after a new confession is successfully posted. */
  const handlePostSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  /* Show a loading spinner while checking the session */
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loader" />
      </div>
    );
  }

  /* Show the login page when no user is authenticated */
  if (!user) {
    return <LoginPage />;
  }

  /* Main authenticated layout */
  return (
    <div className="app-layout">
      <Sidebar onWriteClick={() => setWriteModalOpen(true)} />
      <div className="app-main">
        <TopBar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<CampusFeed refreshKey={refreshKey} />} />
            <Route path="/trends" element={<CampusTrends refreshKey={refreshKey} />} />
            <Route path="/history" element={<MyHistory refreshKey={refreshKey} />} />
          </Routes>
        </div>
      </div>

      {/* Global Write Secret Modal — triggered from the Sidebar */}
      <WriteSecretModal
        isOpen={writeModalOpen}
        onClose={() => setWriteModalOpen(false)}
        onPost={handlePostSuccess}
      />
    </div>
  );
}

export default App;
