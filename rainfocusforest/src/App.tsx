import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SidebarLayout } from './layouts/SidebarLayout';
import DashboardPage from './pages';
import Tasks from './pages/Tasks';
import Prayer from './pages/Prayer';
import Media from './pages/Media';
import Reports from './pages/Reports';
import Habit from './pages/Habit';
import Timer from './pages/Timer';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import { readLS } from './lib/storage';

export default function App() {
  const isLoggedIn = readLS('isLoggedIn', false);
  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn && (
          <Route path="/login" element={<Login />} />
        )}
        <Route
          path="/"
          element={isLoggedIn ? <SidebarLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<DashboardPage />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="prayer" element={<Prayer />} />
          <Route path="media" element={<Media />} />
          <Route path="reports" element={<Reports />} />
          <Route path="habit" element={<Habit />} />
          <Route path="timer" element={<Timer />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to={isLoggedIn ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
