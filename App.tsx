
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import EventsPage from './pages/EventsPage';
import BlogPage from './pages/BlogPage';
import KontakPage from './pages/KontakPage';
import PlaceholderPage from './pages/PlaceholderPage';
import AllCardsPage from './pages/AllCardsPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProgramsPage from './pages/ProgramsPage';
import ForumPage from './pages/ForumPage';
import ForumThreadPage from './pages/ForumThreadPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import EventDetailPage from './pages/EventDetailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordConfirmationPage from './pages/ResetPasswordConfirmationPage';
import ChatAssistant from './components/ChatAssistant';

// Route Guards
import AdminRoute from './components/admin/AdminRoute';
import UserRoute from './components/UserRoute';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
import ForumModerationPage from './pages/admin/ForumModerationPage';
import SettingsPage from './pages/admin/SettingsPage';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes - Proteksi Admin */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="content" element={<ContentManagementPage />} />
          <Route path="forum" element={<ForumModerationPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Public & User Routes */}
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </HashRouter>
  );
};

const MainApp = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="bg-white text-gray-800 font-sans flex flex-col min-h-screen relative">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <div className="flex-grow">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Proteksi Halaman User */}
            <Route path="/profile" element={
              <UserRoute>
                <ProfilePage />
              </UserRoute>
            } />
            
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password-confirmation" element={<ResetPasswordConfirmationPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/:threadId" element={<ForumThreadPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:productId" element={<ProductDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:articleId" element={<ArticleDetailPage />} />
            <Route path="/contact" element={<KontakPage />} />
            <Route path="/all-cards" element={<AllCardsPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
      <ChatAssistant isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};

export default App;
