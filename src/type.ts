
export enum MessageAction { 
  GET_PROXY_CONFIG = "getProxyConfig",
  SET_PROXY_CONFIG = "setProxyConfig",
}

export interface Message {
  action: MessageAction;
  data: any;
}


