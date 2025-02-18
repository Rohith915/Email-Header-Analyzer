chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getAuthToken") {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                console.error("Auth Error:", chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
                console.log("Token received:", token);
                sendResponse({ success: true, token });
            }
        });
        return true; // Required for async response
    }
});
