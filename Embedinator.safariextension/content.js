if (window.top === window) {
	//Listen for messages from global page
    safari.self.addEventListener('message', function(e) {
        if (e.name == 'embedinate') {
			embedinate();
		}
    }, false);


	//INIT
    safari.self.tab.dispatchMessage("getSettings");

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

	//Enables iframe fullscreen on all Vimeo embeds
	Array.prototype.slice.call(document.querySelectorAll('iframe[src*="vimeo"]')).forEach(function(iframe) {
		iframe.setAttribute('webkitallowfullscreen', 'webkitallowfullscreen');
		iframe.setAttribute('allowfullscreen', 'allowfullscreen');
	});
}