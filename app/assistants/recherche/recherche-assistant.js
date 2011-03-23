function RechercheAssistant(argFromPusher) {
        /* this is the creator function for your scene assistant object. It will be passed all the 
           additional parameters (after the scene name) that were passed to pushScene. The reference
           to the scene controller (this.controller) has not be established yet, so any initialization
           that needs the scene controller should be done in the setup function below. */
     this.dbHelper = argFromPusher.dbHelper;
     this.theaterFavList = argFromPusher.theaterFavList;
     this.locale = argFromPusher.locale;
     this.timeZone = argFromPusher.timeZone;
     this.cst = argFromPusher.cst;
     this.latitude = null;
     this.longitude = null;
     this.locationaddress = null;
     this.request = argFromPusher.request;
     this.preferences = argFromPusher.preferences;
     
     this.forceRequest = false;
     this.useGps = false;
     this.cancelGps = false;
     this.stateAnimationGps = 0;
     this.gpsEnable = true;
}

RechercheAssistant.prototype.setup = function() {

		
		this.useGps = false;

		this.textAttributesVille = {
        		multiline: false,
        		enterSubmits: true,
        		hintText: $L("txtEnterCity")
        };
  
        this.textAttributesFilm = {
        		multiline: false,
        		enterSubmits: true,
        		hintText: $L("txtEnterMovie")
        };
        
                
        this.textModelVille = {
        value: "",
        disabled: false
        }
        
        this.textModelFilm = {
        value: "",
        disabled: false
        }
        // Gestion de la recherche précédente
        if (this.request != null){
        	if (this.request.movieName != null){
        		this.textModelFilm.value = this.request.movieName; 
        	}
        	if (this.request.cityName != null){
        		this.textModelVille.value = this.request.cityName;
        	}
        }
        
        /*this.jours = [
                {label:$L('Aujourd\'hui'), value:"aujourdhui"}, 
                {label:$L('Demain'), value:"demain"},
                ]
        */
		
        this.jours = [
                      {label:$L("spinnerToday"), value:0}, 
                      {label:$L("spinnerTomorow"), value:1} 
                      ];
					  
		this.getDays();
        this.listAttributesJour = {
                label: $L(''), 
                choices: this.jours,
                modelProperty:'value'
        }
        
        this.selectorsModel = {value: 0}
        
        this.buttonAttributes = {};     
        this.buttonChercherModel = {
		 "label" : $L("search"),
		 "buttonClass" : "",
		 "disabled" : false
		 };
		 
		$("labelVille").innerHTML = $L("cityName");
		$("labelFilm").innerHTML = $L("movieName");
		$("labelJour").innerHTML = $L("spinnerChoseTitle");
        
        this.controller.setupWidget("txt_recherche_ville", this.textAttributesVille, this.textModelVille);      
        this.controller.setupWidget("txt_recherche_film", this.textAttributesFilm, this.textModelFilm); 
        this.controller.setupWidget('list_recherche_jour', this.listAttributesJour, this.selectorsModel);
        //this.controller.setupWidget("btn_chercher", this.buttonAttributes, this.buttonChercherModel);
		$("btn_chercher").innerHTML = $L("search"); 
        
        Mojo.Event.listen(this.controller.get("btn_chercher"), Mojo.Event.tap, this.handleButtonPress.bind(this));
		Mojo.Event.listen(this.controller.get("gpsButton"), Mojo.Event.tap, this.handleGPSPress.bind(this));
		
		// On écoute le moment où l'applie revient en premier plan
		this.appActivatedBound = this.appActivated.bind(this);
		Mojo.Event.listen(this.controller.document, Mojo.Event.stageActivate, this.appActivatedBound);
		
		
		// Define the menu of film Card
		var menuItems = getDefaultMenu(this);
		this.appMenuModel = {
			visible: true,
			items: menuItems
		};

		this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
};

RechercheAssistant.prototype.getDays = function() {
	
	var today = new Date();
	var todayWeek = today.getDay();
	var indice = 0;
	
	for (var i = 2; i < weekTab.length; i++) {
		indice = (i+todayWeek)%weekTab.length;
		
		this.jours.push({label:$L(weekTab[indice]), value:i});
	}
	
};

RechercheAssistant.prototype.handleCommand = function (event) {
	this.controller=Mojo.Controller.stageController.activeScene();
    if(event.type == Mojo.Event.command) {	
    	if (!manageDefaultMenu(this, event)){
			// TODO 
    	}
	}
};

RechercheAssistant.prototype.animateGPS = function() {
	if (this.useGps){
		if (this.stateAnimationGps == 0){
			this.stateAnimationGps = 1;
			$("gpsButton").src = "images/gps_activ_1.png";
		}else if (this.stateAnimationGps == 1){
			this.stateAnimationGps = 2;
			$("gpsButton").src = "images/gps_activ.png";
		}else if (this.stateAnimationGps == 2){
			this.stateAnimationGps = 0;
			$("gpsButton").src = "images/gps_not_activ.png";
		}
		
		window.setTimeout(this.animateGPS.bind(this), 400);
	}
}

RechercheAssistant.prototype.handleGPSPress = function(event) {
	console.log("RechercheAssistant.handleGPSPress : useGPS : "+this.useGps);
	
	if (this.preferences.getPrefValue(this.preferences.KEY_PREF_ENABLE_LOCATION)){
		if(this.useGps) {
			this.cancelGps = true;  
			if (this.gpsEnable){
				$("gpsButton").src = "images/gps_not_activ.png";
			}else{
				$("gpsButton").src = "images/gps_disable.png";
			}
			this.textAttributesVille.hintText = $L("txtEnterCity");
			this.textModelVille.disabled = false;
		} else {
			// On regarde si le gps est désactivé depuis les préférences
				this.cancelGps = false;
				this.textAttributesVille.hintText = $L("geolocalized");
				this.textModelVille.disabled = true;
				var accuracy = 1;
				var provider = this.preferences.getPrefValue(this.preferences.KEY_PREF_LOCATION_PROVIDER); 
				if (provider == this.preferences.VALUE_PREF_PROVIDER_GPS){
					accuracy = 1;
				}else if (provider == this.preferences.VALUE_PREF_PROVIDER_GSM){
					accuracy = 2;
				}else if (provider == this.preferences.VALUE_PREF_PROVIDER_WIFI){
					accuracy = 3;
				}
				this.controller.serviceRequest('palm://com.palm.location', {
					method : 'getCurrentPosition',
					parameters: {
					responseTime: 1,
					accuracy: accuracy,
					subscribe: false
				},
				onSuccess: this.callBackGPS.bind(this),
				onFailure: this.handleServiceResponseError.bind(this)
				});
		}
		
		this.controller.modelChanged(this.textModelVille, this);
		this.useGps = !this.useGps;
		this.stateAnimationGps = 0;
		this.animateGPS();
	}else{
		this.controller.showAlertDialog({
			onChoose: function(value) {},
			title: $L("errorMsg"),
			message: $L("gpsPrefDisable"),
			choices:[{label: $L('OK'), value:'OK', type:'color'}]
		});
	}
};

RechercheAssistant.prototype.appActivated = function(){
	console.log("RechercheAssistant.appActivated");
	this.gpsEnable = this.preferences.getPrefValue(this.preferences.KEY_PREF_ENABLE_LOCATION);
	if (this.gpsEnable){
		console.log("RechercheAssistant.appActivated : enable");
		// On va gérer le fait que le gps soit actif ou pas
		var thisTmp = this;
		this.controller.serviceRequest('palm://com.palm.location', {
			method : 'getCurrentPosition',
			parameters: {
			responseTime: 1,
			accuracy: 1,
			subscribe: false
		},
		onSuccess: function(event){
			$("gpsButton").src = "images/gps_not_activ.png";
		},
		onFailure: function(event){
			console.log("RechercheAssistant.appActivated : on Failure");
			if (event.errorCode == 5){
				$("gpsButton").src = "images/gps_disable.png";
				thisTmp.gpsEnable = false;
			}else if (event.errorCode == 8){
				$("gpsButton").src = "images/gps_disable.png";
				thisTmp.gpsEnable = false;
			}
		}
		});
	}else{
		console.log("RechercheAssistant.appActivated : disable");
		$("gpsButton").src = "images/gps_disable.png";
	}
}

RechercheAssistant.prototype.activate = function(event) {
	console.log("RechercheAssistant.activate");
	this.appActivated();
}


RechercheAssistant.prototype.deactivate = function(event) {
        /*$$('body')[0].addClassName('palm-default');
        $$('body')[0].removeClassName('palm-dark');
        $$('body')[0].removeClassName('black');*/
}

RechercheAssistant.prototype.cleanup = function(event) {
        /* this function should do any cleanup needed before the scene is destroyed as 
           a result of being popped off the scene stack */
}
RechercheAssistant.prototype.callBackGPS = function(event) {
	console.log("RechercheAssistant.callBackGPS : lat : "+event.latitude+", long : "+event.longitude+", code : "+event.errorCode);
	this.latitude = event.latitude;
	this.longitude = event.longitude;
	
	manageEventCode(this.controller,event.errorCode);
	
	if (isNaN(this.latitude) || isNaN(this.longitude)){
		console.log("RechercheAssistant.callBackGPS : Nan");
		this.textModelVille.disabled = false;
		this.controller.modelChanged(this.textModelVille, this);
		if (this.gpsEnable){
			$("gpsButton").src = "images/gps_not_activ.png";
		}else{
			$("gpsButton").src = "images/gps_disable.png";
		}
		this.useGps = false;
		this.latitude = null;
		this.longitude = null;
	}else{
		console.log("RechercheAssistant.callBackGPS : lat : "+this.latitude+", long : "+this.longitude);
	    this.controller.serviceRequest('palm://com.palm.location', {
			method : 'getReverseLocation',
	        parameters: {
				latitude: this.latitude,
	            longitude: this.longitude
	                },
	        onSuccess: this.callBackReverseGPS.bind(this),
	        onFailure: this.handleServiceResponseError.bind(this)
	    });
	}
};

RechercheAssistant.prototype.callBackReverseGPS = function(event) {
	console.log("RechercheAssistant.callBackReverseGPS : address : "+event.address);
	this.locationaddress=event.address;
	if (this.locationaddress != null){
		var split =  this.locationaddress.split(";");
		if (split.length >= 3){
			this.textModelVille.value = split[1]+', '+split[2];
		}else{
			this.textModelVille.value = this.locationaddress;
		}
		this.controller.modelChanged(this.textModelVille, this);
	}
	
	this.textModelVille.disabled = false;
	this.controller.modelChanged(this.textModelVille, this);
	if (this.gpsEnable){
		$("gpsButton").src = "images/gps_not_activ.png";
	}else{
		$("gpsButton").src = "images/gps_disable.png";
	}
	this.useGps = false;
};

RechercheAssistant.prototype.handleServiceResponseError = function(event) {
	// Gestion d'une erreur dans la location gps
	console.log("RechercheAssistant.handleServiceResponseError : "+event.errorCode);
	this.textModelVille.disabled = false;
	this.controller.modelChanged(this.textModelVille, this);
	if (this.gpsEnable){
		$("gpsButton").src = "images/gps_not_activ.png";
	}else{
		$("gpsButton").src = "images/gps_disable.png";
	}
	this.useGps = false;
	this.latitude = null;
	this.longitude = null;
	
	if (!this.cancelGps){
		manageEventCode(this.controller, event.errorCode);
	}
}


RechercheAssistant.prototype.handleButtonPress = function(event) {

	// on vérifie si le champ ville est remplit, c'est le minimum
    if (this.textModelVille.value == ""){
    	this.controller.showAlertDialog({
    	    onChoose: function(value) {},
    		title: $L("errorMsg"),
    		message: $L("msgNoCityName"),
    		choices:[{label: $L('OK'), value:'OK', type:'color'}]
    	});	  	
    }else{
    	
    	var date = new Date();
    	var dateSearch = this.selectorsModel.value;    	
    	date.setTime(date.getTime()+ getMilliseconds(dateSearch));
    	
    	// On va controler si on a besoin de forcer la requete à se relancer : pas de requetes précédentes, recherche gps, 
    	// recherche dépassée d'un jour au moins, recherche sur autre ville ou un autre film
    	this.forceRequest = false;
    	if (this.request == null){
    		console.log("RechercheAssistant.handleButtonPress : request null");
    		this.forceRequest = true;
    	}else if ((this.latitude != null) && (this.longitude != null)){
    		console.log("RechercheAssistant.handleButtonPress : lat & long != null");
    		this.forceRequest = true;
    	}else if (this.request.cityName != this.textModelVille.value){
    		console.log("RechercheAssistant.handleButtonPress : name != "+this.request.cityName+', '+this.textModelVille.value);
    		this.forceRequest = true;
    	}else if ( ((this.request.movieName != null) && (this.textModelFilm.value != null) && (this.request.movieName != this.textModelFilm.value))
    			|| ((this.request.movieName != null) && (this.textModelFilm.value == null))
    			|| ((this.request.movieName == null) && (this.textModelFilm.value != null))
    			){
    		console.log("RechercheAssistant.handleButtonPress : movie != "+this.request.movieName+', '+this.textModelFilm.value);
    		this.forceRequest = true;
    	}else{
    		var dateRequest = new Date();
    		dateRequest.setTime(this.request.time);
    		this.forceRequest = (dateRequest.getYear() != date.getYear()) || (dateRequest.getMonth() != date.getMonth()) || (dateRequest.getDay() != date.getDay());
    		console.log("RechercheAssistant.handleButtonPress : date != "+this.request.time+", "+date.getTime()+" year : "+dateRequest.getYear()+", "+date.getYear()+" month : "+dateRequest.getMonth()+", "+date.getMonth()+" day : "+dateRequest.getDay()+", "+date.getDay());
    	}
    	
    	// Gestion de la sauvegarde du mode de vue pour passer le bon paramètre à la vue résultat
    	var thView = true;
    	if (this.request != null){
    		thView = this.request.nearResp;
    	}
    	
    	this.request = new RequestBean();
    	this.request.cityName = this.textModelVille.value; 
    	this.request.movieName = this.textModelFilm.value;
    	//On gère le fait qu'on ai rentré que des espaces
    	if (this.request.movieName != null){
    		this.request.movieName = this.request.movieName.replace(new RegExp("^[\\s]+", "g"), "");
    		if (this.request.movieName.length == 0){
    			this.request.movieName.length = null;
    			this.textModelFilm.value = null;
    			this.controller.modelChanged(this.textModelFilm, this);
    		}
    	}
    	
    	if (!this.forceRequest){
    		this.request.nearResp = thView;
    	}
    	
    	this.request.latitude = this.latitude; 
    	this.request.longitude = this.longitude; 
    	this.request.day = this.selectorsModel.value;
    	
    	this.request.time = date.getTime();
    	
    	
    	
    	this.recherche = {
    			request: this.request,
    			dbHelper: this.dbHelper,
    			theaterFavList: this.theaterFavList,
    			cst: this.cst,
    			locale: this.locale,
    			timeZone: this.timeZone,
    			forceRequest: this.forceRequest,
    			preferences: this.preferences
    	};
    	
      this.dbHelper.insertSearchRequest(this.request);
    	
      this.controller.stageController.pushScene("resultat", this.recherche);
    }
}

RechercheAssistant.prototype.nantesGPS = {latitude:47.2357216,longitude:-1.5840786};