browser.browserAction.onClicked.addListener( function(tab) {

	var query = { active: true, currentWindow: true };

	function callback(tabs) {
		var currTab = tabs[0];
		console.log(currTab.url);
		browser.runtime.sendNativeMessage
			("mpvff",
			 { url: currTab.url,request: "play" }
			).then(console.log("resolved"));
	}

	browser.tabs.query(query, callback);
	}
);

browser.tabs.onActivated.addListener( async function(tab) {

	try {
		let tabInfo = await browser.tabs.get(tab.tabId);
		let response = await browser.runtime.sendNativeMessage
			("mpvff",
			 { url: tabInfo.url, request: "check" }
			);
		if( response.successful === true) {
			console.log("Playing available")
		} else {
			console.log("Playing not available")
		}
	}
	catch (error) {
		console.error(error);
	}
}
);
