
function get_site_info () {
    
    let popular_site = [
        {hostname: 'youtube.com', search_path: 'results', search_param: 'search_query'},
        {hostname: 'facebook.com', search_path: 'search', search_param: 'q'},
        {hostname: 'instagram.com', search_path: 'explore/tags', search_param: ''},
        {hostname: 'stackoverflow.com', search_path: 'search', search_param: 'q'},
    ];
    let current_hostname = handle_hostname(window.location.hostname);

    let site_obj = popular_site.find( site => site.hostname === current_hostname);

    if(site_obj !== undefined) {
        site_obj.is_popular_site = true;
        return site_obj;
    }
    return false;
}

function popular_site_sots_generator(site_obj,selected_text = 'sots') {

    let site_param = site_obj.search_param !== '' ? `?${site_obj.search_param}=${selected_text}` : `/${selected_text}`;
    return `http://${site_obj.hostname}/${site_obj.search_path}${site_param}`
}

function handle_hostname(hostname) {
    splitted_hostname = hostname.split('.');
    if(splitted_hostname[0] === 'www') {
        splitted_hostname.shift()
    }
    return splitted_hostname.join('.')
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.clicked_sots) {
            let sots = `http://www.google.com/search?q=${request.selected_text}`;
            let site_obj = get_site_info();
            if(site_obj.is_popular_site) {
                sots = popular_site_sots_generator(site_obj,request.selected_text);
            }
            
            sendResponse({"open_new_tab": true, "url": sots})
        }
    }
);