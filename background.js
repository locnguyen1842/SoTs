let extensionMenu = {
    id: 'sots',
    contexts: ["selection"],
    title: 'Search on This site',
}

let now = Date.now()

const resource = 'https://gist.githubusercontent.com/locnguyen1842/ef92ec60a6cc748073b154f5c467faa5/raw/sites.json?cachebust=' + now

chrome.contextMenus.create(extensionMenu);

chrome.runtime.onInstalled.addListener(() => {
    initSites()
});

const initSites = async () => {
    chrome.storage.local.set({sotsSites: await getResource(resource), cachedAt: now})
}

chrome.contextMenus.onClicked.addListener(function(info,tab) {
    chrome.tabs.sendMessage(tab.id, {event: "onClickedSots"}, res => {
        chrome.storage.local.get(['sotsSites'], result => {
            const url = result.sotsSites?.[res.hostname?.replace('www.', '')]
            handleContextMenuClick(info, tab, url)
        })
    })
})

const handleContextMenuClick = (info, tab, url) => {
    url ? searchOnAvailableSite(url, info.selectionText, ++tab.index) : searchOnDefaultProvider(info.selectionText, "NEW_TAB")
}

const getResource = async (resource) => {
    const response = await fetch(resource)
    return await response.json()
}

const searchOnAvailableSite = (url, text, tabIndex) => {
    chrome.tabs.create({"url": url.replace(/%s/g, text), "index": tabIndex})
}

const searchOnDefaultProvider = (text, disposition) => {
    chrome.search.query({disposition: disposition, text: text})
}