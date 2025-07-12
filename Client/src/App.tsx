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
import Auth from './pages/Auth.tsx';
import ProtectedRoute from './components/common/ProtectedRoute.tsx';
import SettingsPage from './pages/Settings.tsx';
import MyQuestions from './pages/MyQuestions.tsx';
import EditQuestionPage from './pages/EditQuestionPage.tsx';
import AuthTest from './pages/AuthTest.tsx';

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
              <Route path="/auth" element={<Auth />} />
              <Route path="settings" element={
  <ProtectedRoute>
    <SettingsPage />
  </ProtectedRoute>
} />

              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="questions" element={<QuestionsPage />} />
                <Route path="questions/:id" element={<QuestionDetailPage />} />
                <Route path="questions/:id/edit" element={
                  <ProtectedRoute>
                    <EditQuestionPage />
                  </ProtectedRoute>
                } />
                <Route path="ask" element={
                  <ProtectedRoute>
                    <AskQuestionPage />
                  </ProtectedRoute>
                } />
                <Route path="my-questions" element={
                  <ProtectedRoute>
                    <MyQuestions />
                  </ProtectedRoute>
                } />
                <Route path="profile/:userId?" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="tags" element={<TagsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
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
