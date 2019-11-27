/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Load settings from storage
function restoreOptions(item) {
    if (item.setting && item.setting.saveDialog) {
        document.settings.saveDialog.value = item.setting.saveDialog;
    }
}

// Save settings
function saveOptions() {
    browser.storage.local.set({
        setting: {
            saveDialog: document.settings.saveDialog.value
        }
    });
}

browser.storage.local.get('setting', restoreOptions);
document.querySelector('form').addEventListener('change', saveOptions);