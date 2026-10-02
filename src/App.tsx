import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import PublicPage from './pages/PublicPage';
import ChatPage from './pages/ChatPage';
import OwnerDashboard from './pages/OwnerDashboard';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public-facing page */}
        <Route path="/" element={<PublicPage />} />
        
        {/* Chat page for users */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
        
        {/* Owner dashboard (the app interface) */}
        <Route path="/owner" element={<OwnerDashboard />} />
      </Routes>

      {/* Floating navigation for demo purposes */}
      <DemoNavigation />
    </HashRouter>
  );
};

const DemoNavigation: React.FC = () => {
  const [showNav, setShowNav] = React.useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setShowNav(!showNav)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-gray-800 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-700 transition-all hover:scale-110"
        title="Navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Navigation Panel */}
      {showNav && (
        <div className="fixed bottom-20 right-4 z-50 bg-white rounded-xl shadow-2xl border p-4 w-64">
          <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Navigation
          </h3>
          <div className="space-y-2">
            <Link
              to="/"
              onClick={() => setShowNav(false)}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
              <div>
                <p className="font-medium text-gray-800">Public Page</p>
                <p className="text-xs text-gray-400">Emergency landing page</p>
              </div>
            </Link>
            <Link
              to="/chat"
              onClick={() => setShowNav(false)}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
              <div>
                <p className="font-medium text-gray-800">User Chat</p>
                <p className="text-xs text-gray-400">Emergency chat interface</p>
              </div>
            </Link>
            <Link
              to="/owner"
              onClick={() => setShowNav(false)}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <div>
                <p className="font-medium text-gray-800">Owner Dashboard</p>
                <p className="text-xs text-gray-400">App interface for owner</p>
              </div>
            </Link>
          </div>
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-400 text-center">
              SafeReach - Emergency Contact System
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
