function onSettingsReceived(settings) {
    if (settings.autorun) {
        embedinate();
    }
}

if (window.top === window) {
    safari.self.addEventListener('message', function(e) {
        if (e.name == 'receiveSettings') {
            onSettingsReceived(e.message.settings);
        }
		else if (e.name == 'embedinate') {
			embedinate();
		}
    }, false);

    safari.self.tab.dispatchMessage("getSettings");
}

//On YouTube website
if (/youtube.com/.test(window.location.href)) {
	var videoContainer = document.getElementById('watch-player'),
		clip_id = (window.location.href.split('watch?v=')[1]).split('&')[0],
		alert = document.getElementById('flash10-promo-div');
	
	//Replace with iframe
	Embedinator.Util.replaceEmbed(videoContainer, Embedinator.YOUTUBE, {
		width: videoContainer.clientWidth,
		height: videoContainer.clientHeight,
		clip_id: clip_id,
		fullscreen: true
	});
	
	//Remove No Flash alert
	alert.parentNode.removeChild(alert);
}