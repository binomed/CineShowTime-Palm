function PreferencesAssistant(argFromPusher) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	this.dbHelper = new DBHelper();
	this.dbHelper = argFromPusher.dbHelper;
	
	this.preferenceList = [];
	this.KEY_LANG_AUTO = "preference_lang_key_auto_translate";
	this.KEY_RELOAD_AUTO = "preference_gen_key_auto_reload";
	this.KEY_TIME_ADDS = "preference_gen_key_time_adds";
	this.KEY_MEASURE = "preference_loc_key_measure";
	this.KEY_TIME_DIRECTION = "preference_loc_key_time_direction";
	this.KEY_ENABLE_LOCATION = "preference_loc_key_enable_localisation";
	this.KEY_LOCATION_PROVIDER = "preference_loc_key_localisation_provider";
	this.KEY_SORT_MOVIE = "preference_sort_key_sort_movie";
	this.KEY_SORT_THEATER = "preference_sort_key_sort_theater";
	this.KEY_AGENDA = "preference_user_agenda";
}

PreferencesAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	$("idPrefName").innerHTML = $L("menuPreferences");
	
	// Set up our list data model	
	this.setupModel();

	// Set up the list widget with templates for the items, their dividers & the list container.
	// We also set the model to use for the list items & specify a function to format divider content.
	//dividerTemplate: 'title-template', 
	this.controller.setupWidget('preferencesList', 
								{itemTemplate: 'preferences/list-item', 
								dividerTemplate: 'preferences/divider', 
								dividerFunction: this.dividerFunc.bind(this)},
								{items: this.services});
									
	// Watch for taps on the list items	
	Mojo.Event.listen($('preferencesList'), Mojo.Event.listTap, this.listTapHandler.bindAsEventListener(this));
	
	this.dbHelper.extractPreferences(this.callBackPreferences.bind(this));
}

PreferencesAssistant.prototype.dividerFunc = function (itemModel) {
	return itemModel.category;  // We're using the item's category as the divider label.
};

PreferencesAssistant.prototype.listTapHandler = function (event) {
    var index = event.model.items.indexOf(event.item);
	if (index > -1) {
		switch (event.item.key) {
			case this.KEY_LANG_AUTO:
				break;
			case this.KEY_RELOAD_AUTO:
				break;
			case this.KEY_TIME_ADDS:
				break;
			case this.KEY_MEASURE:
				break;
			case this.KEY_TIME_DIRECTION:
				break;
			case this.KEY_ENABLE_LOCATION:
				break;
			case this.KEY_LOCATION_PROVIDER:
				break;
			case this.KEY_SORT_MOVIE:
				break;
			case this.KEY_SORT_THEATER:
				break;
			case this.KEY_AGENDA:
				break;
		
		}
		
//		this.controller.stageController.assistant.showScene(event.item.key, event.item.scene);
    }      
};


PreferencesAssistant.prototype.setupModel = function () {
	console.log('PreferencesAssistant.setupModel : ');
	this.services = [
		{category: $L("preference_lang_cat"), key: $L(this.KEY_LANG_AUTO), name: $L("preference_lang_auto_translate"), description: $L("preference_lang_auto_translate_summary")},
		{category: $L("preference_gen_cat"), key: $L(this.KEY_RELOAD_AUTO), name: $L("preference_gen_auto_reload"), description: $L("preference_gen_auto_reload_summary")},
		{category: $L("preference_gen_cat"), key: $L(this.KEY_TIME_ADDS), name: $L("preference_gen_time_adds"), description: $L("preference_gen_time_adds_summary")},
		{category: $L("preference_loc_cat"), key: $L(this.KEY_MEASURE), name: $L("preference_loc_measure"), description: $L("preference_loc_measure_summary")},
		{category: $L("preference_loc_cat"), key: $L(this.KEY_TIME_DIRECTION), name: $L("preference_loc_time_direction"), description: $L("preference_loc_time_direction_summary")},
		{category: $L("preference_loc_cat"), key: $L(this.KEY_ENABLE_LOCATION), name: $L("preference_loc_enable_localisation"), description: $L("preference_loc_enable_localisation_summary")},
		{category: $L("preference_loc_cat"), key: $L(this.KEY_LOCATION_PROVIDER), name: $L("preference_loc_localisation_provider"), description: $L("preference_loc_localisation_provider_summary")},
		{category: $L("preference_sort_cat"), key: $L(this.KEY_SORT_MOVIE), name: $L("preference_sort_sort_movie"), description: $L("preference_sort_sort_movie_summary")},
		{category: $L("preference_sort_cat"), key: $L(this.KEY_SORT_THEATER), name: $L("preference_sort_sort_theater"), description: $L("preference_sort_sort_theater_summary")},
		{category: $L("preference_user_cat"), key: $L(this.KEY_AGENDA), name: $L("preference_user_agenda"), description: $L("preference_user_agenda_summary")},
		];
};

PreferencesAssistant.prototype.getPrefValue = function (key) {
	var value = null;
	var pref = null;
	for (var i = 0; i < this.preferenceList.length; i++){
		pref = this.preferenceList[i];
		if (pref[key] != null){
			value = pref['value'];
			// On va gérer les valeurs par défaut
			if (value == null){
				switch (key) {
				case this.KEY_LANG_AUTO:
					value = false;
					break;
				case this.KEY_RELOAD_AUTO:
					value = true;
					break;
				case this.KEY_TIME_ADDS:
					value = $L("preference_gen_default_time_adds");
					break;
				case this.KEY_MEASURE:
					value = $L("preference_loc_default_measure");
					break;
				case this.KEY_TIME_DIRECTION:
					value = false;
					break;
				case this.KEY_ENABLE_LOCATION:
					value = true;
					break;
				case this.KEY_LOCATION_PROVIDER:
					value =$L("preference_loc_default_localisation_provider");
					break;
				case this.KEY_SORT_MOVIE:
					value = $L("preference_sort_default_sort_movie");
					break;
				case this.KEY_SORT_THEATER:
					value = $L("preference_sort_default_sort_theater");
					break;
				case this.KEY_AGENDA:
					break;
				}
			}
		}
	}
	
	
	return value;
};

/* SQL CALLBACK METHODS */

PreferencesAssistant.prototype.callBackPreferences = function (preferenceList) {
    this.preferenceList = preferenceList;
};

PreferencesAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


PreferencesAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

PreferencesAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
