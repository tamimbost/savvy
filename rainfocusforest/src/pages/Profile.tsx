import { useEffect, useState } from 'react';
import { readLS, writeLS } from '../lib/storage';

type ProfileData = {
  name: string;
  email: string;
  bio?: string;
  focusGoal?: string;
  avatarBase64?: string;
  bannerBase64?: string;
};

const KEY = 'user_profile';

export default function Profile() {
  const [data, setData] = useState<ProfileData>(readLS(KEY, { name: '', email: '' } as ProfileData));
  useEffect(()=>{ writeLS(KEY, data); }, [data]);

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const onAvatar = async (f: File) => setData({ ...data, avatarBase64: await toBase64(f) });
  const onBanner = async (f: File) => setData({ ...data, bannerBase64: await toBase64(f) });

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'profile.json'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6">
      <div className="bg-surface rounded-xl p-4 shadow grid gap-4">
        <div className="h-32 rounded bg-app/10 relative overflow-hidden">
          {data.bannerBase64 && <img src={data.bannerBase64} alt="banner" className="w-full h-full object-cover" />}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-app/10 overflow-hidden">
            {data.avatarBase64 && <img src={data.avatarBase64} alt="avatar" className="w-full h-full object-cover" />}
          </div>
          <div className="grid gap-2">
            <label className="btn-secondary">Upload Avatar <input hidden type="file" accept="image/*" onChange={e=>e.target.files&&onAvatar(e.target.files[0])} /></label>
            <label className="btn-secondary">Upload Banner <input hidden type="file" accept="image/*" onChange={e=>e.target.files&&onBanner(e.target.files[0])} /></label>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-4 shadow grid gap-3">
        <label className="grid gap-1"><span className="text-sm text-app-2">Name</span><input className="border rounded p-2" value={data.name} onChange={e=>setData({...data, name: e.target.value})} /></label>
        <label className="grid gap-1"><span className="text-sm text-app-2">Email</span><input className="border rounded p-2" value={data.email} onChange={e=>setData({...data, email: e.target.value})} /></label>
        <label className="grid gap-1"><span className="text-sm text-app-2">Bio</span><textarea className="border rounded p-2" value={data.bio||''} onChange={e=>setData({...data, bio: e.target.value})} /></label>
        <label className="grid gap-1"><span className="text-sm text-app-2">Focus Goal</span><input className="border rounded p-2" value={data.focusGoal||''} onChange={e=>setData({...data, focusGoal: e.target.value})} /></label>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={exportJson}>Export JSON</button>
        </div>
      </div>
    </div>
  );
}

