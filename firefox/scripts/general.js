// Injects local script onto page
function addScript(file) {
    var script = document.createElement('script');
    script.setAttribute('src', browser.runtime.getURL(file));
    document.body.appendChild(script);
}

// Injects download list onto page
function addDownloadList() {
    var list = document.createElement('div');
    list.style.display = 'none !important';
    list.id = 'downloadList';
    document.body.appendChild(list);
    return list;
}

// Creates button template
function createButton() {
    var container = document.createElement('span');
    container.className = '_5e4p';
    
    var button = document.createElement('button');
    button.className = 'dCJp8 afkep';
    
    var icon = document.createElement('img');
    icon.src = browser.runtime.getURL('images/download.png');
    icon.className = 'glyphsSpriteShare__outline__24__grey_9';
    icon.setAttribute('style', 'background: none !important');
    button.appendChild(icon);
    
    container.appendChild(button);
    return container;
}

// Detect page type
function getPageType() {
    var url = window.location.pathname;
    url = url.substring(1, url.length);
    url = url.substring(0, url.indexOf('/'));
    url = url.toLowerCase();
    
    if (url.length <= 0 || url.charAt(0) == '?' || url.charAt(0) == '#') {
        return 'feed';
    } else if (url == 'p') {
        return 'post';
    } else {
        return 'user';
    }
}

// Handles UI change detection
function changeHandler() {
    if (!running) {
        running = true;
        getPosts();
    }
}

// Collects posts from page
function getPosts() {
    switch (getPageType()) {
        case 'feed':
            var posts = document.getElementsByTagName('article');
            break;
        case 'user':
        case 'post':
            var posts = document.getElementsByTagName('article');
            break;
    }
    loopPosts(posts);
}

// Loops through post list
function loopPosts(posts) {
    for (i = 0; i < posts.length; i++) {
        if (posts[i] != null && !posts[i].getAttribute('data-download-button')) {
            insertButton(posts[i]);
        }
    }
    running = false;
}

// Injects download button to a post
function insertButton(post) {
    post.setAttribute('data-download-button', true);
    count++;
    post.id = 'downloadID' + count;
    var buttonArea = post.getElementsByTagName('section')[0];
    var button = downloadButton.cloneNode(true);
    button.firstChild.setAttribute('onclick', 'downloadImage('+ count +')');
    if (buttonArea && buttonArea.lastChild) {
        buttonArea.insertBefore(button, buttonArea.lastChild);
    }
}

// Starts downloading image
function startDownload() {
    if (!downloading && downloadList.lastChild) {
        downloading = true;
        var queue = downloadList.childNodes;
        var downloadUrls = [];
        var fileName = downloadList.lastChild.title;
        for (i = 0; i < queue.length; i++) {
            downloadUrls.push(queue[i].href);
        }
        while (downloadList.lastChild) {
            downloadList.removeChild(downloadList.lastChild);
        }
        downloading = false;
        browser.runtime.sendMessage({
            type: 'download',
            urls: downloadUrls
        });
    }
}

addScript('scripts/injected.js');
var downloadList = addDownloadList();
var downloadButton = createButton();
var count = 0;
var running = false;
var downloading = false;
var downloadStarter = new MutationObserver(startDownload);
downloadStarter.observe(downloadList, {subtree: true, childList: true, attributeFilter: ['data-start']});
var observer = new MutationObserver(changeHandler);
observer.observe(document.body, {subtree: true, childList: true});