
function getSiteInfo () {
    
    let popularSite = [
        {hostname: 'youtube.com', searchPath: 'results', searchParam: 'searchQuery'},
        {hostname: 'facebook.com', searchPath: 'search', searchParam: 'q'},
        {hostname: 'instagram.com', searchPath: 'explore/tags', searchParam: ''},
        {hostname: 'stackoverflow.com', searchPath: 'search', searchParam: 'q'},
    ];
    let currentHostname = handleHostname(window.location.hostname);

    let siteObj = popularSite.find( site => site.hostname === currentHostname);

    if(siteObj !== undefined) {
        siteObj.isPopularSite = true;
        return siteObj;
    }
    return false;
}

function popularSiteSotsGenerator(siteObj,selectedText = 'sots') {
    let siteParam = siteObj.searchParam !== '' ? `?${siteObj.searchParam}=${selectedText}` : `/${selectedText}`;
    return `http://${siteObj.hostname}/${siteObj.searchPath}${siteParam}`
}

function handleHostname(hostname) {
    splittedHostname = hostname.split('.');
    if(splittedHostname[0] === 'www') {
        splittedHostname.shift()
    }
    return splittedHostname.join('.')
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.clickedSots) {
            let sots = `http://www.google.com/search?q=${request.selectedText}`;
            let siteObj = getSiteInfo();
            if(siteObj.isPopularSite) {
                sots = popularSiteSotsGenerator(siteObj,request.selectedText);
            }
            
            sendResponse({"openNewTab": true, "url": sots})
        }
    }
);