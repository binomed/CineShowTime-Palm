function PreferencesAssistant(argFromPusher) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	this.dbHelper = argFromPusher.dbHelper;
	this.preferences = argFromPusher.preferences;
	
	this.cst = argFromPusher.cst;
	
	this.preferenceList = [];
	
	this.valueMeasure = null;
	this.valueProvider = null;
	this.valueTimeAdds = null;
	this.valueTimeFormat = null;
	this.valueSort = null;
	this.valueToggle = null;
	this.modelAutoTrad = null;
	this.modelTimeAdds = null;
	this.modelLocMeasure = null;
	this.modelTimeDirection = null;
	this.modelAllowLoc = null;
	this.modelLocProvider = null;
	this.modelSortTheater = null;
	
	console.log("PreferencesAssistant : ");
	//this.dbHelper.extractPreferences(this.callBackPreferences.bind(this));
}

PreferencesAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
	
	console.log("PreferencesAssistant.setup : ");
	$("idPrefName").innerHTML = $L("menuPreferences");
	//Define categories name
	$("idCatLang").innerHTML = $L("preference_lang_cat");
	$("idCatGen").innerHTML = $L("preference_gen_cat");
	$("idCatLoc").innerHTML = $L("preference_loc_cat");
	$("idCatSort").innerHTML = $L("preference_sort_cat");
	//Define preferences names
	$("titleTradAuto").innerHTML = $L("preference_lang_auto_translate");
	$("previewTradAuto").innerHTML = $L("preference_lang_auto_translate_summary");
	$("titleTimeFormat").innerHTML = $L("preference_gen_time_format");
	$("titleTimeAdds").innerHTML = $L("preference_gen_time_adds");
	$("previewTimeAdds").innerHTML = $L("preference_gen_time_adds_summary");
	$("titleMeasureUnit").innerHTML = $L("preference_loc_measure");
	$("previewMeasureUnit").innerHTML = $L("preference_loc_measure_summary");
	$("titleTimeDrive").innerHTML = $L("preference_loc_time_direction");
	$("previewTimeDrive").innerHTML = $L("preference_loc_time_direction_summary");
	$("titleAllowLoc").innerHTML = $L("preference_loc_enable_localisation");
	$("previewAllowLoc").innerHTML = $L("preference_loc_enable_localisation_summary");
	$("titleLocProvider").innerHTML = $L("preference_loc_localisation_provider");
	$("previewLocProvider").innerHTML = $L("preference_loc_localisation_provider_summary");
	$("titleSortTheater").innerHTML = $L("preference_sort_sort_theater");
	$("previewSortTheater").innerHTML = $L("preference_sort_sort_theater_summary");
	
	
	//Init data modele
	this.setupModel();
	
	
	// Init all widgets
	this.controller.setupWidget("idTradAuto",this.valueToggle,this.modelAutoTrad);
	this.controller.setupWidget("idTimeAdds" ,{choices: this.valueTimeAdds} ,this.modelTimeAdds);
	this.controller.setupWidget("idTimeFormat" ,{choices: this.valueTimeFormat} ,this.modelTimeFormat);
	this.controller.setupWidget("idMeasureUnit" ,{choices: this.valueMeasure} ,this.modelLocMeasure);
	this.controller.setupWidget("idTimeDrive",this.valueToggle,this.modelTimeDirection);
	this.controller.setupWidget("idAllowLoc",this.valueToggle,this.modelAllowLoc);
	this.controller.setupWidget("idLocProvider" ,{choices: this.valueProvider} ,this.modelLocProvider);
	this.controller.setupWidget("idSortTheater" ,{choices: this.valueSort} ,this.modelSortTheater);

	// Put all listener
	 this.changeTradAutoHandler = this.changeTradAuto.bindAsEventListener(this);
	 this.controller.listen("idTradAuto", Mojo.Event.propertyChange, this.changeTradAutoHandler);
	 this.changeTimeAddsHandler = this.changeTimeAdds.bindAsEventListener(this);
	 this.controller.listen("idTimeAdds", Mojo.Event.propertyChange, this.changeTimeAddsHandler);
	 this.changeTimeFormatHandler = this.changeTimeFormat.bindAsEventListener(this);
	 this.controller.listen("idTimeFormat", Mojo.Event.propertyChange, this.changeTimeFormatHandler);
	 this.changeMeasureHandler = this.changeMeasure.bindAsEventListener(this);
	 this.controller.listen("idMeasureUnit", Mojo.Event.propertyChange, this.changeMeasureHandler);
	 this.changeTimeDriveHandler = this.changeTimeDrive.bindAsEventListener(this);
	 this.controller.listen("idTimeDrive", Mojo.Event.propertyChange, this.changeTimeDriveHandler);
	 this.changeAllowLocHandler = this.changeAllowLoc.bindAsEventListener(this);
	 this.controller.listen("idAllowLoc", Mojo.Event.propertyChange, this.changeAllowLocHandler);
	 this.changeLocProviderHandler = this.changeLocProvider.bindAsEventListener(this);
	 this.controller.listen("idLocProvider", Mojo.Event.propertyChange, this.changeLocProviderHandler);
	 this.changeSortHandler = this.changeSort.bindAsEventListener(this);
	 this.controller.listen("idSortTheater", Mojo.Event.propertyChange, this.changeSortHandler);
	 
	 // Define the menu of film Card
	var menuItems = getDefaultMenu(this);
	
	menuItems[0].disabled = true;
	menuItems[1].disabled = true;
	
	this.appMenuModel = {
		visible: true,
		items: menuItems
	};

	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	 
}

PreferencesAssistant.prototype.postSetup = function() {
	// Set up our list data model	
	this.modelAutoTrad.value = ""+this.preferences.getPrefValue(this.preferences.KEY_PREF_LANG_AUTO);
	this.modelTimeAdds.value = this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_ADDS);
	this.modelTimeFormat.value = this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_FORMAT);
	this.modelLocMeasure.value = this.preferences.getPrefValue(this.preferences.KEY_PREF_MEASURE);
	this.modelTimeDirection.value = this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_DIRECTION);
	this.modelAllowLoc.value = this.preferences.getPrefValue(this.preferences.KEY_PREF_ENABLE_LOCATION);
	this.modelLocProvider.value = this.preferences.getPrefValue(this.preferences.KEY_PREF_LOCATION_PROVIDER);
	this.modelSortTheater.value = this.preferences.getPrefValue(this.preferences.KEY_PREF_SORT_THEATER);
	
	this.controller.modelChanged(this.modelAutoTrad);
	this.controller.modelChanged(this.modelTimeFormat, this);
	this.controller.modelChanged(this.modelTimeAdds, this);
	this.controller.modelChanged(this.modelLocMeasure, this);
	this.controller.modelChanged(this.modelTimeDirection);
	this.controller.modelChanged(this.modelAllowLoc);
	this.controller.modelChanged(this.modelLocProvider, this);
	this.controller.modelChanged(this.modelSortTheater, this);
	
}

PreferencesAssistant.prototype.setupModel = function () {
	console.log('PreferencesAssistant.setupModel : ');
	
	
	this.valueMeasure =  [{label:$L('measure_1'), value:$L('measure_code_1')},
			              {label:$L('measure_2'), value:$L('measure_code_2')},
			              ];
	this.valueProvider = [{label:$L('mode_localisation_1'), value:$L('mode_localisation_code_1')},
			              {label:$L('mode_localisation_2'), value:$L('mode_localisation_code_2')},
						  {label:$L('mode_localisation_3'), value:$L('mode_localisation_code_3')}
    						];
	this.valueSort =  [{label:$L('sort_theaters_values_1'), value:$L('sort_theaters_values_code_1')},
			              {label:$L('sort_theaters_values_2'), value:$L('sort_theaters_values_code_2')},
			              {label:$L('sort_theaters_values_3'), value:$L('sort_theaters_values_code_3')}
			              // {label:$L('sort_theaters_values_4'), value:$L('sort_theaters_values_code_4')} à décommenter quand ça sera optimisé
			              // {label:$L('sort_theaters_values_5'), value:$L('sort_theaters_values_code_5')} à décommenter quand ça sera implémenté
			              ];
	this.valueTimeFormat = [{label:'12 '+$L('hour'), value:12},
	                      {label:'24 '+$L('hour'), value:24}
			              ];
	this.valueTimeAdds = [{label:'5 '+$L('min'), value:5},
	                      {label:'10 '+$L('min'), value:10},
	                      {label:'15 '+$L('min'), value:15},
	                      {label:'20 '+$L('min'), value:20},
	                      {label:'25 '+$L('min'), value:25},
	                      {label:'30 '+$L('min'), value:30},
	                      {label:'35 '+$L('min'), value:35},
	                      {label:'40 '+$L('min'), value:40}
			              ];
	this.valueToggle = {trueLabel:'ON'
						, trueValue:"true"
	                    , falseLabel:'OFF'
	                    , falseValue:"false"
						};
	
	this.modelAutoTrad = {value: ""+this.preferences.getPrefValue(this.preferences.KEY_PREF_LANG_AUTO), disabled: false };
	this.modelTimeFormat = {value: this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_FORMAT) };
	this.modelTimeAdds = {value: this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_ADDS) };
	this.modelLocMeasure = {value: this.preferences.getPrefValue(this.preferences.KEY_PREF_MEASURE) };
	this.modelTimeDirection = {value: ""+this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_DIRECTION), disabled: false };
	this.modelAllowLoc = {value: ""+this.preferences.getPrefValue(this.preferences.KEY_PREF_ENABLE_LOCATION), disabled: false };
	this.modelLocProvider = {value: this.preferences.getPrefValue(this.preferences.KEY_PREF_LOCATION_PROVIDER) };
	this.modelSortTheater = {value: this.preferences.getPrefValue(this.preferences.KEY_PREF_SORT_THEATER) };
	
};


/* SQL CALLBACK METHODS */

PreferencesAssistant.prototype.callBackPreferences = function (preferenceList) {
	console.log('PreferencesAssistant.callBackPreferences : '+preferenceList.length);
    this.preferenceList = preferenceList;
    
    this.postSetup();
    
};

/* VALUES CHANGE LISTENER */

PreferencesAssistant.prototype.changeTradAuto = function(event) {
	console.log("PreferencesAssistant.changeTradAuto : "+event.value+", model : "+this.modelAutoTrad.value);
	var result = (event.value == 'ON') || (event.value == 'true') || (event.value); 
	this.modelAutoTrad = result;
	this.preferences.changeValue(this.preferences.KEY_PREF_LANG_AUTO, result);
};

PreferencesAssistant.prototype.changeReloadAuto = function(event) {
	var result = (event.value == 'ON') || (event.value == 'true') || (event.value);
	this.modelAutoReload.value = result; 
	this.preferences.changeValue(this.preferences.KEY_PREF_RELOAD_AUTO, result);
};

PreferencesAssistant.prototype.changeTimeFormat = function(event) {
	console.log("PreferencesAssistant.changeTimeFormat : "+event.value+", model : "+this.modelTimeFormat.value);
	this.modelTimeFormat.value = event.value;
	this.preferences.changeValue(this.preferences.KEY_PREF_TIME_FORMAT, this.modelTimeFormat.value);
};

PreferencesAssistant.prototype.changeTimeAdds = function(event) {
	console.log("PreferencesAssistant.changeTimeAdds : "+event.value+", model : "+this.modelTimeAdds.value);
	this.modelTimeAdds.value = event.value;
	this.preferences.changeValue(this.preferences.KEY_PREF_TIME_ADDS, this.modelTimeAdds.value);
};

PreferencesAssistant.prototype.changeMeasure = function(event) {
	this.modelLocMeasure.value = event.value;
	this.preferences.changeValue(this.preferences.KEY_PREF_MEASURE, this.modelLocMeasure.value);
};

PreferencesAssistant.prototype.changeTimeDrive = function(event) {
	var result = (event.value == 'ON') || (event.value == 'true') || (event.value);
	this.modelTimeDirection.value = result;
	this.preferences.changeValue(this.preferences.KEY_PREF_TIME_DIRECTION, result);
};

PreferencesAssistant.prototype.changeAllowLoc = function(event) {
	var result = (event.value == 'ON') || (event.value == 'true') || (event.value); 
	this.modelAllowLoc.value = result; 
	this.preferences.changeValue(this.preferences.KEY_PREF_ENABLE_LOCATION, result);
};

PreferencesAssistant.prototype.changeLocProvider = function(event) {
	this.modelLocProvider.value =  event.value;
	this.preferences.changeValue(this.preferences.KEY_PREF_LOCATION_PROVIDER, this.modelLocProvider.value);
};

PreferencesAssistant.prototype.changeSort = function(event) {
	this.modelSortTheater.value = event.value; 
	this.preferences.changeValue(this.preferences.KEY_PREF_SORT_THEATER, this.modelSortTheater.value);
};


/* ASSISTANTS METHODS */

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
