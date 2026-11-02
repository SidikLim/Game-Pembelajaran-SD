import { get, set } from 'idb-keyval';
import type { Profile } from './types';

const KEY = 'edugame:v1';

export interface SaveData {
  profiles: Profile[];
  activeId: string | null;
  muted: boolean;
}

export const emptySave = (): SaveData => ({ profiles: [], activeId: null, muted: false });

/** IndexedDB lewat idb-keyval; bila tak tersedia (mode privat) jatuh ke localStorage. */
export async function loadSave(): Promise<SaveData> {
  try {
    const data = await get<SaveData>(KEY);
    if (data) return { ...emptySave(), ...data };
  } catch { /* lanjut ke localStorage */ }
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...emptySave(), ...(JSON.parse(raw) as SaveData) };
  } catch { /* abaikan */ }
  return emptySave();
}

export async function persistSave(data: SaveData): Promise<void> {
  try {
    await set(KEY, data);
    return;
  } catch { /* lanjut */ }
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch { /* penyimpanan penuh/diblokir: progres hanya di memori */ }
}
