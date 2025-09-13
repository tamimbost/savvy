import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { readLS, writeLS } from '../lib/storage';

type MediaItem = { id: string; title?: string; favorite?: boolean; addedAt: string };

const KEY = 'media_history';

export default function Media() {
  const [playlist, setPlaylist] = useState<MediaItem[]>(readLS(KEY, []));
  const [currentId, setCurrentId] = useState<string | null>(playlist[0]?.id || null);
  const [input, setInput] = useState('');
  const [fullscreenOnly, setFullscreenOnly] = useState(false);

  useEffect(()=>{ writeLS(KEY, playlist); }, [playlist]);

  const parseId = (urlOrId: string) => {
    const m = urlOrId.match(/v=([\w-]{6,})/); return m ? m[1] : urlOrId;
  };

  const add = () => {
    if (!input.trim()) return;
    const id = parseId(input.trim());
    const item = { id, addedAt: new Date().toISOString() } as MediaItem;
    setPlaylist(p => [item, ...p]);
    setCurrentId(id);
    setInput('');
  };

  const opts = { width: '100%', playerVars: { autoplay: 1 } } as any;

  return (
    <div className="grid gap-6">
      <div className="bg-surface rounded-xl p-4 shadow grid gap-3">
        <div className="flex items-center gap-2">
          <input className="border rounded p-2 flex-1" placeholder="YouTube URL or ID" value={input} onChange={e=>setInput(e.target.value)} />
          <button className="btn-primary" onClick={add}>Add</button>
          <label className="flex items-center gap-2 ml-auto"><input type="checkbox" checked={fullscreenOnly} onChange={e=>setFullscreenOnly(e.target.checked)} /> Distraction blocker</label>
        </div>
        {currentId && (!fullscreenOnly || document.fullscreenElement) && (
          <div className="aspect-video">
            <YouTube videoId={currentId} opts={opts} />
          </div>
        )}
      </div>

      <div className="bg-surface rounded-xl p-4 shadow">
        <h3 className="font-bold mb-2">Playlist</h3>
        <div className="flex flex-wrap gap-2">
          {playlist.map(item => (
            <button key={item.id} className={`px-3 py-2 rounded border ${currentId===item.id?'bg-app/20':''}`} onClick={()=>setCurrentId(item.id)}>
              {item.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

