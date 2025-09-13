import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { readLS, writeLS } from '../lib/storage';

type NType = 'Info' | 'Warning' | 'Success' | 'Error';
type N = { id: string; type: NType; message: string; createdAt: string };
const KEY = 'notifications_data';

export default function Notifications() {
  const [list, setList] = useState<N[]>(readLS(KEY, []));
  const [type, setType] = useState<NType>('Info');
  const [msg, setMsg] = useState('');
  useEffect(()=>{ writeLS(KEY, list); }, [list]);

  const add = () => {
    if (!msg.trim()) return;
    setList([{ id: crypto.randomUUID(), type, message: msg, createdAt: new Date().toISOString() }, ...list]);
    setMsg('');
  };
  const clearAll = () => setList([]);
  const remove = (id: string) => setList(list.filter(n => n.id !== id));

  return (
    <div className="grid gap-6">
      <div className="bg-surface rounded-xl p-4 shadow flex flex-wrap items-center gap-2">
        <select className="border rounded p-2" value={type} onChange={e=>setType(e.target.value as NType)}>
          {(['Info','Warning','Success','Error'] as const).map(t => <option key={t}>{t}</option>)}
        </select>
        <input className="border rounded p-2 flex-1" placeholder="Message" value={msg} onChange={e=>setMsg(e.target.value)} />
        <button className="btn-primary" onClick={add}>Add</button>
        <button className="btn-secondary" onClick={clearAll}>Clear all</button>
      </div>
      <div className="bg-surface rounded-xl p-4 shadow">
        <AnimatePresence>
          {list.map(n => (
            <motion.div key={n.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`p-3 rounded mb-2 border`}
              style={{ borderColor: n.type==='Error'?'#ef4444':n.type==='Warning'?'#f59e0b':n.type==='Success'?'#10b981':'#60a5fa', background: 'rgba(0,0,0,0.02)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{n.type}</div>
                  <div>{n.message}</div>
                </div>
                <button className="btn-secondary" onClick={()=>remove(n.id)}>Close</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

