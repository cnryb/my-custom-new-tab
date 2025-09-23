import { Message, MessageAction } from "./type";

(async () => {
    // Service Worker 中监听消息
    chrome.runtime.onMessage.addListener((message: Message, sender: any, sendResponse: (response: any) => void) => {
        if (message.action === MessageAction.GET_PROXY_CONFIG) {
            chrome.proxy.settings.get({}).then((config: chrome.types.ChromeSettingGetResult<chrome.proxy.ProxyConfig>) => {
                // config.value.rules?.singleProxy?.host
                sendResponse(config);
            })
        } else if (message.action === MessageAction.SET_PROXY_CONFIG) {
            chrome.proxy.settings.set({
                value: message.data,
                scope: "regular"
            }, () => {
                sendResponse({ success: true });
            });
        } else if (message.action === MessageAction.CLEAR_PROXY_CONFIG) {
            chrome.proxy.settings.clear({});
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, error: "Unknown action" });
        }
        return true; // 保持异步通道开启（如需异步回复）
    });

    // chrome.proxy.settings.set({
    //     value: {
    //         mode: "fixed_servers",
    //         rules: {
    //             singleProxy: {
    //                 scheme: "http",
    //                 host: "127.0.0.1",
    //                 port: 1082,

    //             },
    //             bypassList: ["localhost", "127.0.0.1", "192.168.1.100", "cnryb.com"]
    //         }
    //     },
    //     scope: "regular"
    // })

    // const config = await chrome.proxy.settings.get({})
    // console.log(config)



})()