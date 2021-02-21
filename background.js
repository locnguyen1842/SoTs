let extensionMenu = {
    id: 'sots',
    contexts: ["selection"],
    title: 'Search on This site',
}
const resourceSite = "https://raw.githubusercontent.com/locnguyen1842/SoTs/master/resources/sites.json"

chrome.contextMenus.create(extensionMenu);

chrome.runtime.onInstalled.addListener(() => {
    initSites()
});

const initSites = async () => {
    chrome.storage.local.set({sotsSites: await getResource(resourceSite), cachedAt: Date.now()})
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