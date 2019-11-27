/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Confirms agreement
function confirmAgreement() {
    if (agreementCheck()) {
        sendAgreement(true);
    }
}

// Agreement check
function agreementCheck() {
    if (checkbox.checked) {
        checkbox.className = '';
        agree.disabled = false;
        return true;
    } else {
        checkbox.className = 'error';
        agree.disabled = true;
        return false;
    }
}

// Cancel agreement
function cancelAgreement() {
    sendAgreement(false);
}

// Send message to extension about agreement
function sendAgreement(input) {
    browser.runtime.sendMessage({
        type: 'agreement',
        status: input
    });
}

var checkbox = document.getElementById('eula-checkbox');
var agree = document.getElementById('btn-agree');
var cancel = document.getElementById('btn-cancel');
checkbox.addEventListener('change', agreementCheck);
agree.addEventListener('click', confirmAgreement);
cancel.addEventListener('click', cancelAgreement);