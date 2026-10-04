import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicPage from './pages/PublicPage';
import ChatPage from './pages/ChatPage';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerLoginPage from './pages/OwnerLoginPage';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PublicPage />} />
      <Route path="/c/:ownerId/:qrId" element={<ChatPage />} />
      <Route path="/owner-login" element={<OwnerLoginPage />} />
      <Route path="/owner" element={<OwnerDashboard />} />
      <Route path="*" element={<PublicPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
