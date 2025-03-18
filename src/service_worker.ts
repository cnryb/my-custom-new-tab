
(async () => {
    chrome.proxy.settings.set({
        value: {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: "127.0.0.1",
                    port: 1082
                }
            }
        },
        scope: "regular"
    })

    const config = await chrome.proxy.settings.get({})
    console.log(config)
    
})()