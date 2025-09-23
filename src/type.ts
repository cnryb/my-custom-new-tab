
export enum MessageAction { 
  GET_PROXY_CONFIG = "getProxyConfig",
  SET_PROXY_CONFIG = "setProxyConfig",
  CLEAR_PROXY_CONFIG = "clearProxyConfig"
}

export interface Message {
  action: MessageAction;
  data: any;
}


