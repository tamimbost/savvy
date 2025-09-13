import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MdDashboard, MdTask, MdSelfImprovement, MdOndemandVideo, MdAssessment,
  MdTimer, MdPerson, MdSettings, MdNotifications, MdMosque, MdMenu
} from 'react-icons/md';

const items = [
  { to: '/', labelKey: 'nav.dashboard', icon: MdDashboard },
  { to: '/tasks', labelKey: 'nav.tasks', icon: MdTask },
  { to: '/prayer', labelKey: 'nav.prayer', icon: MdMosque },
  { to: '/media', labelKey: 'nav.media', icon: MdOndemandVideo },
  { to: '/reports', labelKey: 'nav.reports', icon: MdAssessment },
  { to: '/habit', labelKey: 'nav.habit', icon: MdSelfImprovement },
  { to: '/timer', labelKey: 'nav.timer', icon: MdTimer },
  { to: '/profile', labelKey: 'nav.profile', icon: MdPerson },
  { to: '/settings', labelKey: 'nav.settings', icon: MdSettings },
  { to: '/notifications', labelKey: 'nav.notifications', icon: MdNotifications },
];

export function SidebarLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex bg-app text-app">
      <motion.aside
        animate={{ width: collapsed ? 80 : 256 }}
        className="relative overflow-hidden border-r bg-surface"
      >
        <div className="flex items-center justify-between px-4 h-16">
          <span className="font-bold">{collapsed ? 'RFF' : t('appName')}</span>
          <button className="btn-secondary" onClick={() => setCollapsed(v => !v)}>
            <MdMenu />
          </button>
        </div>
        <nav className="px-2">
          {items.map(({ to, labelKey, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `group flex items-center gap-3 my-1 px-3 py-2 rounded-md hover:shadow-accent transition ${isActive ? 'border-l-4' : 'border-l-4 border-transparent'}`}
              title={t(labelKey)}
            >
              <Icon className="text-xl" />
              {!collapsed && <span className="truncate">{t(labelKey)}</span>}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

