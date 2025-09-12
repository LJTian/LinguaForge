import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Games from './pages/Games';
import Words from './pages/Words';
import AdventureGame from './pages/AdventureGame';
import DefenseGame from './pages/DefenseGame';
import DubbingGame from './pages/DubbingGame';

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// 公开路由组件（已登录用户重定向到首页）
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const App: React.FC = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Routes>
        {/* 公开路由 */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 受保护的路由 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <Layout>
                <Games />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/games/adventure"
          element={
            <ProtectedRoute>
              <AdventureGame />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/games/defense"
          element={
            <ProtectedRoute>
              <DefenseGame />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/games/dubbing"
          element={
            <ProtectedRoute>
              <DubbingGame />
            </ProtectedRoute>
          }
        />

        <Route
          path="/words"
          element={
            <ProtectedRoute>
              <Layout>
                <Words />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 默认重定向 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;