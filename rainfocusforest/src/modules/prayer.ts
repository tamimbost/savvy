import { readLS, writeLS } from '../lib/storage';

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export type PrayerSettings = {
  times: Record<PrayerName, string>; // HH:MM 24h
  volume: number; // 0-1
  rainBackground: boolean;
  azanBase64?: string;
  logs: Record<string, PrayerName[]>; // yyyy-MM-dd -> list completed
};

const DEFAULT: PrayerSettings = {
  times: { Fajr: '05:00', Dhuhr: '12:30', Asr: '16:00', Maghrib: '18:30', Isha: '20:00' },
  volume: 0.5,
  rainBackground: false,
  logs: {},
};

const KEY = 'prayer_times';

export function readPrayer(): PrayerSettings {
  return readLS(KEY, DEFAULT);
}

export function savePrayer(ps: PrayerSettings) {
  writeLS(KEY, ps);
}

export function markPrayerDone(name: PrayerName, dateISO = new Date()): void {
  const ps = readPrayer();
  const key = dateISO.toISOString().slice(0,10);
  const arr = ps.logs[key] ?? [];
  if (!arr.includes(name)) arr.push(name);
  ps.logs[key] = arr;
  savePrayer(ps);
}

export function getNextPrayer(now = new Date()): { name: PrayerName; msLeft: number } {
  const ps = readPrayer();
  const candidates: { name: PrayerName; at: Date }[] = (['Fajr','Dhuhr','Asr','Maghrib','Isha'] as PrayerName[]).map(name => {
    const [h,m] = ps.times[name].split(':').map(Number);
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return { name, at: d };
  });
  let next = candidates.find(c => c.at.getTime() > now.getTime());
  if (!next) {
    // next day's Fajr
    const [h,m] = ps.times.Fajr.split(':').map(Number);
    const d = new Date(now);
    d.setDate(d.getDate()+1);
    d.setHours(h, m, 0, 0);
    next = { name: 'Fajr', at: d };
  }
  return { name: next.name, msLeft: next.at.getTime() - now.getTime() };
}

