let sots_menu_item = {
    id: 'sots',
    contexts: ["selection"],
    title: 'Search on This site'
}

chrome.contextMenus.create(sots_menu_item);

chrome.contextMenus.onClicked.addListener(function(info,tab) {
    
    if(info.menuItemId === 'sots' && info.selectionText) {
        chrome.tabs.sendMessage(tab.id,{"clicked_sots": true, "selected_text": info.selectionText},function(res) {
            if(res.open_new_tab) {
                chrome.tabs.create({"url": res.url, "index": tab.index + 1});
            }
        })
    }
})
