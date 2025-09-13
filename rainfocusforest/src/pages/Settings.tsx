import { useTheme } from '../providers/ThemeProvider';
import { setLanguage } from '../providers/LangProvider';

export default function Settings() {
  const { theme, setTheme, accentRgb, setAccentRgb } = useTheme();
  return (
    <div className="grid gap-6">
      <div className="bg-surface rounded-xl p-4 shadow">
        <h2 className="font-bold mb-2">Theme</h2>
        <div className="flex gap-2 flex-wrap">
          {(['rainforest','light','night','dark','ocean'] as const).map(t => (
            <button key={t} onClick={() => setTheme(t)} className={`px-3 py-2 rounded border ${theme===t?'bg-app/20':''}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="bg-surface rounded-xl p-4 shadow">
        <h2 className="font-bold mb-2">Accent</h2>
        <input type="text" className="border rounded p-2" value={accentRgb} onChange={(e)=>setAccentRgb(e.target.value)} />
        <div className="mt-2 h-8 w-24 rounded" style={{ backgroundColor: `rgb(${accentRgb})` }} />
      </div>
      <div className="bg-surface rounded-xl p-4 shadow">
        <h2 className="font-bold mb-2">Language</h2>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={()=>setLanguage('en')}>English</button>
          <button className="btn-secondary" onClick={()=>setLanguage('bn')}>বাংলা</button>
          <button className="btn-secondary" onClick={()=>setLanguage('ar')}>العربية</button>
        </div>
      </div>
    </div>
  );
}

