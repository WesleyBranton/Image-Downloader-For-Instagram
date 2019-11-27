addScript('scripts/post-injected.js');
getPosts();
var observer = new MutationObserver(changeHandler);
observer.observe(document.body, {subtree: true, childList: true});