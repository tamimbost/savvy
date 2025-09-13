import { useEffect, useMemo, useRef, useState } from 'react';

export default function Timer() {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(workMin*60);
  const intervalRef = useRef<number | null>(null);

  useEffect(()=>{ if(!isBreak) setSecondsLeft(workMin*60); }, [workMin]);
  useEffect(()=>{ if(isBreak) setSecondsLeft(breakMin*60); }, [breakMin]);

  useEffect(()=>{
    if(!isRunning) return;
    intervalRef.current = window.setInterval(()=>{
      setSecondsLeft(s=>{
        if(s<=1){
          if(isBreak){ setIsBreak(false); return workMin*60; }
          else { setIsBreak(true); return breakMin*60; }
        }
        return s-1;
      });
    }, 1000);
    return ()=>{ if(intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isBreak, workMin, breakMin]);

  const percent = useMemo(()=>{
    const total = (isBreak?breakMin:workMin)*60;
    return ((total - secondsLeft)/total)*100;
  }, [secondsLeft, isBreak, workMin, breakMin]);

  const mm = Math.floor(secondsLeft/60).toString().padStart(2,'0');
  const ss = (secondsLeft%60).toString().padStart(2,'0');

  return (
    <div className="grid gap-6">
      <div className="bg-surface rounded-xl p-4 shadow flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">Work <input className="border rounded p-1 w-20" type="number" min={1} value={workMin} onChange={e=>setWorkMin(parseInt(e.target.value||'25'))} /> min</label>
        <label className="flex items-center gap-2">Break <input className="border rounded p-1 w-20" type="number" min={1} value={breakMin} onChange={e=>setBreakMin(parseInt(e.target.value||'5'))} /> min</label>
        <button className="btn-primary" onClick={()=>setIsRunning(r=>!r)}>{isRunning?'Pause':'Start'}</button>
        <button className="btn-secondary" onClick={()=>{ setIsRunning(false); setIsBreak(false); setSecondsLeft(workMin*60); }}>Reset</button>
      </div>
      <div className="bg-surface rounded-xl p-6 shadow grid place-items-center">
        <div className="relative w-56 h-56 grid place-items-center">
          <svg className="absolute inset-0" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle cx="50" cy="50" r="45" stroke="rgb(var(--primary))" strokeWidth="8" fill="none" strokeDasharray={2*Math.PI*45} strokeDashoffset={(1-percent/100)*2*Math.PI*45} transform="rotate(-90 50 50)" />
          </svg>
          <div className="text-3xl font-bold">{mm}:{ss}</div>
          <div className="text-xs text-app-2">{isBreak ? 'Break' : 'Work'}</div>
        </div>
      </div>
    </div>
  );
}

