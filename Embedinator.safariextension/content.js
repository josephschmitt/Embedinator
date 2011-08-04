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