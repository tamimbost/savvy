import { useMemo } from 'react';
import { listTasks } from '../modules/tasks';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const tasks = listTasks();
  const completed = tasks.filter(t => t.status==='Completed').length;
  const pending = tasks.length - completed;

  const donut = useMemo(() => ([
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending },
  ]), [completed, pending]);

  const COLORS = ['#4ade80', '#fbbf24'];

  const lineData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => ({ day: `D${i+1}`, sessions: Math.floor(Math.random()*4) }));
    return days;
  }, [tasks.length]);

  const areaData = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({ w: `W${i+1}`, prod: Math.round(20+Math.random()*80) })), [tasks.length]);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-4 shadow">
          <div className="text-sm text-app-2">Total Tasks Completed</div>
          <div className="text-3xl font-bold">{completed}</div>
        </div>
        <div className="bg-surface rounded-xl p-4 shadow">
          <div className="text-sm text-app-2">Focus Hours</div>
          <div className="text-3xl font-bold">{Math.round(completed*0.5)}</div>
        </div>
        <div className="bg-surface rounded-xl p-4 shadow">
          <div className="text-sm text-app-2">Prayer Logs</div>
          <div className="text-3xl font-bold">0</div>
        </div>
        <div className="bg-surface rounded-xl p-4 shadow">
          <div className="text-sm text-app-2">Habit Streaks</div>
          <div className="text-3xl font-bold">0</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl p-4 shadow h-80">
          <h2 className="font-bold mb-2">Daily focus sessions</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="rgb(var(--primary))" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface rounded-xl p-4 shadow h-80">
          <h2 className="font-bold mb-2">Weekly productivity</h2>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--secondary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgb(var(--secondary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="w" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="prod" stroke="rgb(var(--secondary))" fillOpacity={1} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-4 shadow h-80">
        <h2 className="font-bold mb-2">Completed vs Pending</h2>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie data={donut} innerRadius={60} outerRadius={90} paddingAngle={6} dataKey="value">
              {donut.map((d, index) => (
                <Cell key={`c-${d.name}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

