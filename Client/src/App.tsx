import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import Layout from './components/common/Layout.tsx';
import HomePage from './pages/HomePage.tsx';
import QuestionsPage from './pages/QuestionsPage.tsx';
import QuestionDetailPage from './pages/QuestionDetailPage.tsx';
import AskQuestionPage from './pages/AskQuestionPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import TagsPage from './pages/TagsPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import ProtectedRoute from './components/common/ProtectedRoute.tsx';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="questions" element={<QuestionsPage />} />
                <Route path="questions/:id" element={<QuestionDetailPage />} />
                <Route path="ask" element={
                  <ProtectedRoute>
                    <AskQuestionPage />
                  </ProtectedRoute>
                } />
                <Route path="profile/:userId?" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="tags" element={<TagsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="admin/*" element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
