import { useEffect, useMemo, useRef, useState } from 'react';
import { getNextPrayer, markPrayerDone, readPrayer, savePrayer, type PrayerName } from '../modules/prayer';

export default function Prayer() {
  const [ps, setPs] = useState(readPrayer());
  const [msLeft, setMsLeft] = useState(getNextPrayer().msLeft);
  const intervalRef = useRef<number | null>(null);

  useEffect(()=>{
    intervalRef.current = window.setInterval(()=>setMsLeft(getNextPrayer().msLeft), 1000);
    return ()=>{ if(intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const next = useMemo(()=>getNextPrayer(), [ps, msLeft]);
  const hh = Math.floor(msLeft/3600000).toString().padStart(2,'0');
  const mm = Math.floor((msLeft%3600000)/60000).toString().padStart(2,'0');
  const ss = Math.floor((msLeft%60000)/1000).toString().padStart(2,'0');

  const updateTime = (name: PrayerName, val: string) => {
    const n = { ...ps, times: { ...ps.times, [name]: val } };
    setPs(n); savePrayer(n);
  };

  const toggleRain = () => { const n = { ...ps, rainBackground: !ps.rainBackground }; setPs(n); savePrayer(n); };
  const setVolume = (v: number) => { const n = { ...ps, volume: v }; setPs(n); savePrayer(n); };

  const complete = (name: PrayerName) => { markPrayerDone(name); setPs(readPrayer()); };

  return (
    <div className="grid gap-6">
      <div className="bg-surface rounded-xl p-4 shadow grid gap-4">
        <h2 className="font-bold">Prayer Times</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(Object.keys(ps.times) as PrayerName[]).map(k => (
            <label key={k} className="grid gap-1">
              <span className="text-sm text-app-2">{k}</span>
              <input className="border rounded p-2" type="time" value={ps.times[k]} onChange={e=>updateTime(k, e.target.value)} />
              <button className="btn-secondary" onClick={()=>complete(k)}>Mark Done</button>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">Volume <input type="range" min={0} max={1} step={0.01} value={ps.volume} onChange={e=>setVolume(parseFloat(e.target.value))} /></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={ps.rainBackground} onChange={toggleRain} /> Rain background</label>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-6 shadow grid place-items-center">
        <div className="text-sm text-app-2">Next Prayer</div>
        <div className="text-2xl font-bold">{next.name}</div>
        <div className="text-4xl font-bold mt-2">{hh}:{mm}:{ss}</div>
      </div>
    </div>
  );
}

