function getDefaultMenu(context){
	var cst = context.cst;
	return [
	        { label: $L('menuPreferences'), command: cst.KEY_MENU_PREFS }, 
			{ label: $L('menuAbout'), command: cst.KEY_MENU_ABOUT },
			{ label: $L('menuHelp'), command: cst.KEY_MENU_HELP }
		]
};

function manageDefaultMenu(context, event){
	var result = false;
	var cst = context.cst;
	var preferences = context.preferences;
	switch (event.command) {
		case cst.KEY_MENU_PREFS:
			var dataTransfert = {
		            dbHelper: context.dbHelper,
		            preferences: preferences,
					cst: context.cst
		    };
			context.controller.stageController.pushScene("preferences", dataTransfert);
			result = true;
			break;	
		case cst.KEY_MENU_ABOUT:
			
			context.controller.showDialog({
				template: 'about-scene',
				assistant: new AboutAssistant(context),
				preventCancel: true
			});
			
			result = true;
			break;
		case cst.KEY_MENU_HELP:
			context.controller.serviceRequest("palm://com.palm.applicationManager", {
				method: "open",
				parameters: {
					id: 'com.palm.app.browser',
					params: {
						scene: 'page',
						target: $L('urlHelp')
					}
				}
			});	
			result = true;
			break;
	}
	return result;
}