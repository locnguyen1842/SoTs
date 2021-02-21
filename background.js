let sotsMenuItem = {
    id: 'sots',
    contexts: ["selection"],
    title: 'Search on This site'
}

chrome.contextMenus.create(sotsMenuItem);

chrome.contextMenus.onClicked.addListener(function(info,tab) {
    
    if(info.menuItemId === 'sots' && info.selectionText) {
        chrome.tabs.sendMessage(tab.id,{"clickedSots": true, "selectedText": info.selectionText},function(res) {
            if(res.openNewTab) {
                chrome.tabs.create({"url": res.url, "index": tab.index + 1});
            }
        })
    }
})
