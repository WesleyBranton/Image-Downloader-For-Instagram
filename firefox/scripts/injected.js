// Adds image URL(s) to download list
function downloadImage(imgID) {
    var post = document.getElementById('downloadID' + imgID);
    var postContent = post.querySelector('header + div');
        
    if (isMultiPost(postContent)) {
        var index = multiPostIndex(postContent);
        postContent = postContent.getElementsByTagName('ul')[0];
        postContent = postContent.getElementsByTagName('li')[index];
    }
    
    if (isVideo(postContent)) {
        alert('This extension cannot download videos. Sorry!');
        return;
    }
    
    var image = postContent.getElementsByTagName('img')[0];
    
    var download = document.createElement('a');
    download.href = image.src;
    downloadList.appendChild(download);
    downloadList.lastChild.setAttribute('data-start','true');
}

// Detects if multiple content
function isMultiPost(post) {
    return (post.getElementsByTagName('ul').length > 0);
}

// Detects multipost number
function multiPostIndex(post) {
    var postDots = post.getElementsByClassName('Yi5aA');
    var index = 0;
    while (!postDots[index].classList.contains('XCodT')) {
        index++;
    }
    return index;
}

// Detects if video
function isVideo(post) {
    return (post.getElementsByTagName('video').length > 0);
}

var downloadList = document.getElementById('downloadList');