
(async () => {
    // Service Worker 中监听消息
    chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
        console.log("收到消息:", message);
        if (message.action === "greet") {
            console.log("收到消息:", message.data);
            sendResponse({ reply: "Hi from Service Worker!" });
        }
        return true; // 保持异步通道开启（如需异步回复）
    });

    chrome.proxy.settings.set({
        value: {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: "127.0.0.1",
                    port: 1082,

                },
                bypassList: ["localhost", "127.0.0.1", "192.168.1.100", "cnryb.com"]
            }
        },
        scope: "regular"
    })

    const config = await chrome.proxy.settings.get({})
    console.log(config)



})()