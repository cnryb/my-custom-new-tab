export enum MessageAction {
  GET_PROXY_CONFIG = "getProxyConfig",
  SET_PROXY_CONFIG = "setProxyConfig",
  CLEAR_PROXY_CONFIG = "clearProxyConfig",
}

export interface Message {
  action: MessageAction;
  data: any;
}

export type SearchEngineId = "google" | "bing" | "baidu" | "duckduckgo";

export interface SearchEngineOption {
  id: SearchEngineId;
  name: string;
  urlTemplate: string;
}

export const SEARCH_ENGINES: SearchEngineOption[] = [
  { id: "google", name: "Google", urlTemplate: "https://www.google.com/search?q={query}" },
  { id: "bing", name: "Bing", urlTemplate: "https://www.bing.com/search?q={query}" },
  { id: "baidu", name: "百度", urlTemplate: "https://www.baidu.com/s?wd={query}" },
  { id: "duckduckgo", name: "DuckDuckGo", urlTemplate: "https://duckduckgo.com/?q={query}" },
];

export interface Shortcut {
  id: string;
  title: string;
  url: string;
  order: number;
}

export interface ProxyDraft {
  scheme: string;
  host: string;
  port: number;
  bypassList: string[];
}

export interface NewTabSettings {
  searchEngine: SearchEngineId;
  showTopSites: boolean;
  theme: "light" | "dark" | "system";
  proxyDraft: ProxyDraft;
}

export const STORAGE_KEY_SETTINGS = "newTabSettings";
export const STORAGE_KEY_SHORTCUTS = "shortcuts";

export const DEFAULT_SETTINGS: NewTabSettings = {
  searchEngine: "google",
  showTopSites: true,
  theme: "system",
  proxyDraft: {
    scheme: "http",
    host: "127.0.0.1",
    port: 1080,
    bypassList: ["localhost", "127.0.0.1"],
  },
};
