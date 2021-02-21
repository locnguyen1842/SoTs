
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.event === "onClickedSots") {
        sendResponse({"hostname": window.location.hostname})
    }
});
