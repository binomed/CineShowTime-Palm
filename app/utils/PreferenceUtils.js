function PreferenceUtils(dbHelper){
	//Définition des constantes
	this.KEY_PREF_LANG_AUTO = $L("preference_lang_key_auto_translate");
	this.KEY_PREF_RELOAD_AUTO = $L("preference_gen_key_auto_reload");
	this.KEY_PREF_THEME = $L("preference_gen_key_theme");
	this.KEY_PREF_TIME_FORMAT = $L("preference_gen_key_time_format");
	this.KEY_PREF_TIME_ADDS = $L("preference_gen_key_time_adds");
	this.KEY_PREF_MEASURE = $L("preference_loc_key_measure");
	this.KEY_PREF_TIME_DIRECTION = $L("preference_loc_key_time_direction");
	this.KEY_PREF_ENABLE_LOCATION = $L("preference_loc_key_enable_localisation");
	this.KEY_PREF_LOCATION_PROVIDER = $L("preference_loc_key_localisation_provider");
	this.KEY_PREF_SORT_THEATER = $L("preference_sort_key_sort_theater");
	
	// Définition des valeurs de tri et gps
	this.VALUE_PREF_SORT_THEATER_NAME = $L("sort_theaters_values_code_1");
	this.VALUE_PREF_SORT_THEATER_DISTANCE = $L("sort_theaters_values_code_2");
	this.VALUE_PREF_SORT_SHOWTIME = $L("sort_theaters_values_code_3");
	this.VALUE_PREF_SORT_MOVIE_NAME = $L("sort_theaters_values_code_4");
	this.VALUE_PREF_SORT_USER_PREFERENCE = $L("sort_theaters_values_code_5");
	this.VALUE_PREF_PROVIDER_GPS = $L("mode_localisation_code_1");
	this.VALUE_PREF_PROVIDER_GSM = $L("mode_localisation_code_2");
	this.VALUE_PREF_PROVIDER_WIFI = $L("mode_localisation_code_3");
	
	this.dbHelper = dbHelper;
	
	this.preferenceList = [];
	
	// Initialisation des préférences
	this.dbHelper.extractPreferences(this.callBackPreferences.bind(this));
}

PreferenceUtils.prototype.getPrefValue = function (key) {
	var value = null;
	var pref = null;
	for (var i = 0; i < this.preferenceList.length; i++){
		pref = this.preferenceList[i];
		if (pref['key'] == key){
			value = pref['value'];
			break;
		}
	}
	// On va gérer les valeurs par défaut
	if (value == null){
		if(key == this.KEY_PREF_LANG_AUTO){
			value = false;
		}else if(key == this.KEY_PREF_RELOAD_AUTO){
			value = true;
		}else if(key == this.KEY_PREF_THEME) {
      value = "dark";
		}else if(key == this.KEY_PREF_TIME_FORMAT){
			if (Mojo.Format.using12HrTime()){
				value = 12;
			}else{
				value = 24;
			}
		}else if(key == this.KEY_PREF_TIME_ADDS){
			value = parseInt($L("preference_gen_default_time_adds"));
		}else if(key == this.KEY_PREF_MEASURE){
			value = $L("preference_loc_default_measure");
		}else if(key == this.KEY_PREF_TIME_DIRECTION){
			value = false;
		}else if(key == this.KEY_PREF_ENABLE_LOCATION){
			value = true;
		}else if(key == this.KEY_PREF_LOCATION_PROVIDER){
			value =$L("preference_loc_default_localisation_provider");
		}else if(key == this.KEY_PREF_SORT_THEATER){
			value = $L("preference_sort_default_sort_theater");
		}
	}else if((key == this.KEY_PREF_LANG_AUTO) || (key == this.KEY_PREF_RELOAD_AUTO) || (key == this.KEY_PREF_TIME_DIRECTION)|| (key == this.KEY_PREF_ENABLE_LOCATION)){
		console.log('PreferenceUtils.getPrefValue : '+key+', value : '+value);
		value = (value == "true") || (value == true);
	}
	
	console.log('PreferenceUtils.getPrefValue : '+key+', value : '+value);
	
	return value;
};

PreferenceUtils.prototype.changeValue = function (key, result) {
	// On met à jour la base
	this.dbHelper.insertPreference(key, result);
	
	// On met à jour la liste interne
	var value = null;
	var pref = null;
	var index = 0;
	for (var i = 0; i < this.preferenceList.length; i++){
		pref = this.preferenceList[i];
		if (pref['key'] == key){
			value = pref['value'];
			index = i;
			break;
		}
	}
	
	if (value == null){
		this.preferenceList.push({key:key, value: result});
	}else{
		this.preferenceList[index].value = result;
	}
}

PreferenceUtils.prototype.callBackPreferences = function (preferenceList) {
	console.log('PreferenceUtils.callBackPreferences : '+preferenceList.length);
    this.preferenceList = preferenceList;
};

