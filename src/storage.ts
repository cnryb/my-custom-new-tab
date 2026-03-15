import {
  NewTabSettings,
  Shortcut,
  STORAGE_KEY_SETTINGS,
  STORAGE_KEY_SHORTCUTS,
  DEFAULT_SETTINGS,
} from "./type";

export async function loadSettings(): Promise<NewTabSettings> {
  const result = await chrome.storage.local.get(STORAGE_KEY_SETTINGS);
  const saved = result[STORAGE_KEY_SETTINGS];
  if (!saved) return { ...DEFAULT_SETTINGS };
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
  };
}

export async function saveSettings(patch: Partial<NewTabSettings>): Promise<NewTabSettings> {
  const current = await loadSettings();
  const updated = { ...current, ...patch };
  await chrome.storage.local.set({ [STORAGE_KEY_SETTINGS]: updated });
  return updated;
}

export async function loadShortcuts(): Promise<Shortcut[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY_SHORTCUTS);
  const shortcuts: Shortcut[] = result[STORAGE_KEY_SHORTCUTS] || [];
  return shortcuts.sort((a, b) => a.order - b.order);
}

export async function saveShortcuts(shortcuts: Shortcut[]): Promise<void> {
  const ordered = shortcuts.map((s, i) => ({ ...s, order: i }));
  await chrome.storage.local.set({ [STORAGE_KEY_SHORTCUTS]: ordered });
}
