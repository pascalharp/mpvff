var tabState = []

browser.browserAction.onClicked.addListener( function(tab) {

	var query = { active: true, currentWindow: true };

	function callback(tabs) {
		var currTab = tabs[0];
		console.log(currTab.url);
		browser.runtime.sendNativeMessage
			("mpvff",
			 { url: currTab.url,request: "play", id: currTab.id }
			).then(console.log("resolved"));
	}

	browser.tabs.query(query, callback);
	}
);

browser.tabs.onActivated.addListener( async function(tab) {

	async function checkPlayability(url, tabId){
		try{
		let response = await browser.runtime.sendNativeMessage
			("mpvff",
			 { url: url, request: "check", id: tabId }
			);
		console.log(response)
		if( response.successful === true) {
			console.log("Playing available")
			return true
		} else {
			console.log("Playing not available")
			return false
		}
		} catch (error) {
			console.error(error)
			return false
		}
	}

	if(!tabState[tab.tabId]) {
		console.log("Tab not yet in table")
		tabState[tab.tabId] = {
			id: tab.tabId,
			url: null,
			playable: false
		}
	}

	let tabInfo = await browser.tabs.get(tab.tabId)

	if(tabState[tab.tabId].url !== tabInfo.url) {
		console.log("Checking for mpv/youtube-dl compatibility")
		tabState[tab.tabId].url = tabInfo.url
		tabState[tab.tabId].playable = await checkPlayability(tabInfo.url, tabInfo.id)
	}

	if(tabState[tab.tabId].playable === true){
		console.log("Setting icon to playable")
		browser.browserAction.setIcon({path:"icons/play.png"})
	} else {
		console.log("Setting icon to not playable")
		browser.browserAction.setIcon({path:"icons/icon.png"})
	}
}
);
