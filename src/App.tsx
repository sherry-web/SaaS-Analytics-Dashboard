import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PublicLayout from './components/layout/PublicLayout';
import PrivateLayout from './components/layout/PrivateLayout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        } />
        <Route path="/*" element={
          <PrivateLayout>
            <Dashboard />
          </PrivateLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;