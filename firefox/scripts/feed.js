addScript('scripts/feed-injected.js');
getPosts();
var observer = new MutationObserver(changeHandler);
observer.observe(document.getElementsByTagName('article')[0].parentNode, {subtree: true, childList: true});