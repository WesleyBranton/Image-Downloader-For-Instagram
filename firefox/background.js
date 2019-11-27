// Saves file(s) for user
async function saveFile(downloadUrls, incognito) {
    if (isTOSValid()) {
        saveForLater = null;
        for (i = 0; i < downloadUrls.length; i++) {
            var fileName = await getFileName(downloadUrls[i]);
            await browser.downloads.download({
                url : downloadUrls[i],
                filename : fileName,
                conflictAction : 'uniquify',
                saveAs: showSaveAs,
				incognito: incognito
            });
        }
    } else {
        saveForLater = downloadUrls;
        showTOSNotice(downloadUrls);
    }
}

// Gets file name from URL
function getFileName(url) {
    url = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'));
    return url;
}

// Handles inbound messages
function messageHandler(msg, sender) {
    switch (msg.type) {
        case 'download':
            saveFile(msg.urls, sender.tab.incognito);
            break;
        case 'agreement':
            handleAgreement(msg.status, sender.tab);
            break;
    }
}

// Loads settings
function loadSettings(data) {
    if (data.setting && data.setting.saveDialog == 'hide') {
        showSaveAs = false;
    } else {
        showSaveAs = true;
    }
}

// Update settings
function updateSettings() {
    let settings = browser.storage.local.get('setting');
    settings.then(loadSettings);
}

// Loads latest TOS version number
async function loadTOS() {
    var agreement = await browser.storage.local.get('tosAgreement');
    if (agreement.tosAgreement) {
        tosAgreement = agreement.tosAgreement;
    }
}


// Checks if TOS is the latest
function isTOSValid() {
    if (tosAgreement == latestTOS) {
        return true;
    } else {
        return false;
    }
}

// Shows the TOS agreement screen
function showTOSNotice() {
    browser.tabs.create({
        url: 'agreement/review/terms-of-service.html'
    });
}

// Handles TOS agreement
function handleAgreement(status, tab) {
    if (status) {
        newURL = 'agreed';
        var saved = browser.storage.local.set({'tosAgreement': latestTOS});
        tosAgreement = latestTOS;
    } else {
        saveForLater = null;
        newURL = 'cancel';
    }
    browser.tabs.update(tab.id, {
        url: 'agreement/' + newURL + '/terms-of-service.html'
    });
    
    if (status && saveForLater != null) {
        saveFile(saveForLater, tab.incognito);
    }
}

var showSaveAs = true;
var latestTOS = 1;
var tosAgreement = 0;
var saveForLater = null;
browser.runtime.onMessage.addListener(messageHandler);
browser.storage.onChanged.addListener(updateSettings);
let settings = browser.storage.local.get('setting');
settings.then(loadSettings);
loadTOS();