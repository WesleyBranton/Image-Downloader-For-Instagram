addScript('scripts/user-injected.js');
var observer = new MutationObserver(changeHandler);
observer.observe(document.body, {subtree: true, childList: true});