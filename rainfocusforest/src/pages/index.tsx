export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-4 shadow">Total Tasks</div>
        <div className="bg-surface rounded-xl p-4 shadow">Focus Hours</div>
        <div className="bg-surface rounded-xl p-4 shadow">Prayer Logs</div>
        <div className="bg-surface rounded-xl p-4 shadow">Habit Streaks</div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl p-4 shadow h-80">Charts area</div>
        <div className="bg-surface rounded-xl p-4 shadow h-80">Recent activity</div>
      </div>
    </div>
  );
}

