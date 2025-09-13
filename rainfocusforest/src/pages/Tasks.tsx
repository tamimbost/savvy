import { useEffect, useMemo, useState } from 'react';
import { addTask, bulkRemove, listTasks, markCompleted, removeTask, tasksCompletedByDay7, updateTask } from '../modules/tasks';
import type { Task, TaskPriority, TaskStatus } from '../modules/tasks';
import { useForm } from 'react-hook-form';
import { MdDelete, MdEdit, MdSave, MdSearch } from 'react-icons/md';
import { BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';

type FormValues = { title: string; description?: string; priority: TaskPriority; dueDate?: string; status: TaskStatus };

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | TaskStatus>('All');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: { priority: 'Medium', status: 'Pending' } });

  useEffect(() => { setTasks(listTasks()); }, []);

  const onSubmit = (v: FormValues) => {
    const t = addTask({ ...v });
    setTasks(prev => [t, ...prev]);
    reset({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Pending' });
  };

  const filtered = useMemo(() => {
    return tasks.filter(t =>
      (!query || t.title.toLowerCase().includes(query.toLowerCase())) &&
      (filterStatus === 'All' || t.status === filterStatus)
    );
  }, [tasks, query, filterStatus]);

  const chartData = useMemo(() => tasksCompletedByDay7().map(d => ({ day: d.date.slice(5), count: d.count })), [tasks]);

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selected);
    bulkRemove(ids);
    setTasks(listTasks());
    setSelected(new Set());
  };

  const handleComplete = (id: string) => {
    markCompleted(id);
    setTasks(listTasks());
  };

  const startEdit = (id: string) => setEditingId(id);
  const saveEdit = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    setEditingId(null);
    setTasks(listTasks());
  };

  return (
    <div className="grid gap-6">
      <div className="bg-surface rounded-xl p-4 shadow">
        <h2 className="font-bold mb-3">Add Task</h2>
        <form className="grid grid-cols-1 md:grid-cols-6 gap-3" onSubmit={handleSubmit(onSubmit)}>
          <input className="border rounded p-2 md:col-span-2" placeholder="Title" required {...register('title')} />
          <input className="border rounded p-2 md:col-span-2" placeholder="Description" {...register('description')} />
          <select className="border rounded p-2" {...register('priority')}>
            {(['Low','Medium','High'] as const).map(p => <option key={p}>{p}</option>)}
          </select>
          <input className="border rounded p-2" type="date" {...register('dueDate')} />
          <select className="border rounded p-2" {...register('status')}>
            {(['Pending','Completed'] as const).map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn-primary md:col-span-1" type="submit">Add</button>
        </form>
      </div>

      <div className="bg-surface rounded-xl p-4 shadow grid gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 border rounded px-2">
            <MdSearch />
            <input className="p-2 outline-none" placeholder="Search" value={query} onChange={e=>setQuery(e.target.value)} />
          </div>
          <select className="border rounded p-2" value={filterStatus} onChange={e=>setFilterStatus(e.target.value as any)}>
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
          <button className="btn-secondary" onClick={handleBulkDelete} disabled={selected.size===0}>Bulk Delete</button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Select</th>
                <th className="p-2">Title</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Due</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-t">
                  <td className="p-2"><input type="checkbox" checked={selected.has(t.id)} onChange={()=>toggleSelect(t.id)} /></td>
                  <td className="p-2">
                    {editingId===t.id ? (
                      <input className="border rounded p-1" defaultValue={t.title} onBlur={(e)=>saveEdit(t.id, { title: e.target.value })} />
                    ) : t.title}
                  </td>
                  <td className="p-2">{t.priority}</td>
                  <td className="p-2">{t.dueDate || '-'}</td>
                  <td className="p-2">{t.status}</td>
                  <td className="p-2 flex gap-2">
                    <button className="btn-secondary" onClick={()=>startEdit(t.id)} title="Edit"><MdEdit /></button>
                    <button className="btn-secondary" onClick={()=>handleComplete(t.id)} disabled={t.status==='Completed'} title="Complete"><MdSave /></button>
                    <button className="btn-secondary" onClick={()=>{ removeTask(t.id); setTasks(listTasks()); }} title="Delete"><MdDelete /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-4 shadow h-80">
        <h2 className="font-bold mb-2">Tasks Completed (7 days)</h2>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="rgb(var(--primary))" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

