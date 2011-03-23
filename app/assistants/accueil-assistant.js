function AccueilAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */

	this.dbHelper = new DBHelper();
	/* intialisation de la base de donnée */
	console.log('AccueilAssistant.AccueilAssistant() : Before Initialisation of data base');
	this.dbHelper.initDataBase(this.callBackInit.bind(this));
	this.theaterFavList = null;
	this.wordList = [];
	this.timeZone = null;
	this.locale = null;
	this.request = null;
	
	this.canSearch = false;
	this.cst = new CineShowTimeCst();
	this.preferences = new PreferenceUtils(this.dbHelper);
	this.forceRequest = false;
	this.theaterList = [];
	
}


AccueilAssistant.prototype.setup = function() {
	$$('body')[0].addClassName('palm-dark');
	$$('body')[0].addClassName('my-dark-backdrop');
	$$('body')[0].addClassName('black');	
	$$('body')[0].removeClassName('palm-default');
	
	this.buttonAttributes = {};
	
	this.buttonRechercheModel = {
     "label" : $L("btnMovie"),
     "buttonClass" : "",
     "disabled" : false
     };
	 
	this.buttonFavorisModel = {
     "label" : $L("btnFav"),
     "buttonClass" : "",
     "disabled" : false
     };
	
	this.wordList = [{data:$L("msgLoading"), definition:$L("Loading data...")}];
	
	this.listModel = {
			listTitle: $L("btnMovie"), 
			items:this.wordList
	};
	$('idFavTitleGroup').innerHTML = $L("btnFav");
	
	this.listAttributes = {
			itemTemplate:'accueil/accueil-item', 
			listTemplate:'accueil/accueil-container'
	};
	 
	  // this.controller.setupWidget("btn_recherche", this.buttonAttributes, this.buttonRechercheModel);
	  $("btn_recherche").innerHTML = $L("btnMovie");
	   
	  this.controller.setupWidget('listTheaterFav', this.listAttributes, this.listModel);
	  
	  Mojo.Event.listen(this.controller.get("btn_recherche"), Mojo.Event.tap, this.handleButtonPress.bind(this));
	  
	  // We init system information
	  this.controller.serviceRequest('palm://com.palm.systemservice/time', {
		    method:"getSystemTime",
		    parameters:{},
		    onSuccess: this.callbackTimeZone.bind(this),
		    onFailure: this.errorHandler.bind(this)
		});   
	  this.controller.serviceRequest('palm://com.palm.systemservice', {
		  method:"getPreferences",
		  parameters:{"keys":["locale"]},
		  onSuccess: this.callbackLocale.bind(this),
		  onFailure: this.errorHandler.bind(this)
	  });   
	  
	 
	// Define the menu of film Card
	var menuItems = getDefaultMenu(this);
	this.appMenuModel = {
		visible: true,
		items: menuItems
	};

	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	
	
	
};

AccueilAssistant.prototype.handleCommand = function (event) {
	this.controller=Mojo.Controller.stageController.activeScene();
    if(event.type == Mojo.Event.command) {	
    	if (!manageDefaultMenu(this, event)){
			// TODO 
    	}
	}
};


AccueilAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */	  
	try{
		if (this.canSearch){
			console.log('AccueilAssistant.setup : before extractFavTheaters : ');
			this.dbHelper.extractFavTheaters(this.callBackFavTheaterList.bind(this));
			
			// On récupère la dernière recherche dans le but de savoir au niveau des date si on doit faire un rafraichissement
			this.dbHelper.extractLastSearchRequest(this.callBackLastRequest.bind(this));
			
			// On extrait tous les cinémas dans le but de reprérer tous les favoris 
			this.dbHelper.extractTheater(this.callBackTheaterList.bind(this));
		}
	}catch(e){
		console.log('AccueilAssistant.setup : Error setup extractTheater : '+e.message);
	}
	
	window.setTimeout(this.animateSplash.bind(this), 1000);
	window.setTimeout(this.hideSplash.bind(this), 3500);
};

AccueilAssistant.prototype.animateSplash = function() {
	$j("#img_splash_0").fadeOut(2000);
	$j("#img_splash").fadeIn(2000);	
}

AccueilAssistant.prototype.hideSplash = function() {
	$j("#splash").fadeOut(1000);
}

AccueilAssistant.prototype.deactivate = function(event) {
	
};

AccueilAssistant.prototype.errorHandler = function(error) { 
    console.log('AccueilAssistant.errorHandler : Error was '+error.message+' (Code '+error.code+')'); 
    return true;
};

AccueilAssistant.prototype.callBackInit = function() {
	console.log('AccueilAssistant.callBackInit : '); 
	this.canSearch = true;
	this.dbHelper.extractFavTheaters(this.callBackFavTheaterList.bind(this));
	// On récupère la dernière recherche dans le but de savoir au niveau des date si on doit faire un rafraichissement
	this.dbHelper.extractLastSearchRequest(this.callBackLastRequest.bind(this));
	
	// On extrait tous les cinémas dans le but de reprérer tous les favoris 
	this.dbHelper.extractTheater(this.callBackTheaterList.bind(this));
};

AccueilAssistant.prototype.callbackTimeZone = function(localtime) { 
	console.log('AccueilAssistant.callbackTimeZone : '+localtime['timezone']); 
	this.timeZone = localtime['timezone'];
};

AccueilAssistant.prototype.callbackLocale = function(localJson) { 
	console.log('AccueilAssistant.callbackLocale : '); 
	this.locale = localJson['locale']['languageCode'];
};


AccueilAssistant.prototype.callBackLastRequest = function(request) {
	console.log("AccueilAssistant.callBackLastRequest : "+request.cityName+", "+request.movieName+", "+request.latitude+", "+request.longitude+", "+request.time+", "+request.theaterId+", "+request.nearResp);
	this.request = request;
};

AccueilAssistant.prototype.callBackTheaterList = function(theaterList) { 
	console.log("AccueilAssistant.callBackTheaterList : "+theaterList.length);
	this.theaterList = theaterList;
}

AccueilAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

AccueilAssistant.prototype.favPresent = function(theaterId) {
	var result = false;
	if (this.theaterList != null){
		for(var i=0; i < this.theaterList.length; i++){
			console.log("AccueilAssistant.favPresent : "+this.theaterList[i].theaterName);
			if (this.theaterList[i].id == theaterId){
				result = true;
				break;
			}
		}
	}
	
	return result;
};

AccueilAssistant.prototype.handleButtonPress = function(event) {
	
	this.dataTransfert = {
            dbHelper: this.dbHelper,
            theaterFavList: this.theaterFavList,
            cst: this.cst,
            locale: this.locale,
            timeZone: this.timeZone,
            request: this.request,
            preferences: this.preferences
    };
	
	this.controller.stageController.pushScene("recherche", this.dataTransfert);
};

AccueilAssistant.prototype.showFav = function(theaterFavList) {
	this.wordList = [];
	if(theaterFavList.length > 0){
		var theater = null;
		for (var i = 0; i < theaterFavList.length; i++){
			theater = theaterFavList[i];
			this.wordList.push({
				id:i,
				data:decode(theater.theaterName),
				city:decode(theater.place.cityName),
				idFavRemoveImg:$L('idFavRemoveImg#{num}').interpolate({num:i}),
				srcFavRemoveImg:$L('images/ic_delete.png')
			});
			
		}
	}else{
		this.wordList.push({
			id:i,
			data:$L('msgNoDFav'),
			idFavRemoveImg:$L('idFavRemoveImg#{num}').interpolate({num:i})
		});
		
	}
	
	this.listModel.items = this.wordList;
	this.controller.modelChanged(this.listModel, this);
	
	for (var i = 0; i < theaterFavList.length; i++){
		Mojo.Event.listen(this.controller.get($L('idFavRemoveImg#{num}').interpolate({num:i})),Mojo.Event.tap,this.removeFav.bind(this));
		Mojo.Event.listen(this.controller.get($L('rowFavClick#{num}').interpolate({num:i})),Mojo.Event.tap,this.openFav.bind(this));
	}
};

/* CallBack Db Method */


AccueilAssistant.prototype.callBackFavTheaterList = function(theaterList) { 
	// Handle the results
	try {
		this.theaterFavList = theaterList;
		if (this.theaterFavList == null){
			this.theaterFavList = [];
		}
		
		this.showFav(this.theaterFavList);
	}
	catch (e)
	{
		console.log('AccueilAssistant.callBackFavTheaterList : Error during extracting theaters : '+e.message);	
	} 
	
};

AccueilAssistant.prototype.openFav = function(event) {
	var id = ""+event.target.id;//idFavImg
	var indice = parseInt(id.substring(11, id.length));
	var theater = this.theaterFavList[indice];
	
	var date = new Date();
	
	// On va controler si on a besoin de forcer la requete à se relancer : pas de requetes précédentes, recherche gps, 
	// recherche dépassée d'un jour au moins, recherche sur autre ville ou un autre film
	this.forceRequest = false;
	if (this.request == null){
		console.log("AccueilAssistant.openFav : request null");
		this.forceRequest = true;
	}else if (!this.favPresent(theater.id)){
		console.log("AccueilAssistant.openFav : not present");
		this.forceRequest = true;
	}else if (this.request.movieName != null || this.request.movieName != ""){
		console.log("AccueilAssistant.openFav : request movie before");
		this.forceRequest = true;
	}else{
		var dateRequest = new Date();
		dateRequest.setTime(this.request.time);
		this.forceRequest = (dateRequest.getYear() != date.getYear()) || (dateRequest.getMonth() != date.getMonth()) || (dateRequest.getDay() != date.getDay());
		console.log("AccueilAssistant.openFav : date != time : "+this.request.time+", "+date.getTime()+" year : "+dateRequest.getYear()+", "+date.getYear()+" month : "+dateRequest.getMonth()+", "+date.getMonth()+" day : "+dateRequest.getDay()+", "+date.getDay());
	}
	
	
	this.request = new RequestBean();
	this.request.theaterId = theater.id;
	this.request.time = date.getTime();
	if (theater.place != null){
		this.request.latitude = theater.place.latitude;
		this.request.longitude = theater.place.longitude;
		this.request.cityName = theater.place.cityName+', '+theater.place.countryNameCode;
	}
	
	this.dataTransfert = {
            dbHelper: this.dbHelper,
            theaterFavList: this.theaterFavList,
            request: this.request,
            cst: this.cst,
            locale: this.locale,
            timeZone: this.timeZone,
            forceRequest: this.forceRequest,
            preferences: this.preferences
    };
	this.controller.stageController.pushScene("resultat", this.dataTransfert);
	
	this.dbHelper.insertSearchRequest(this.request);
};

AccueilAssistant.prototype.removeFav = function(event) {
	var id = ""+event.target.id;//idFavImg
	var indice = parseInt(id.substring(14, id.length));
	var theater = this.theaterFavList[indice];
	this.dbHelper.removeFavTheater(theater);
	var listTmp = [];
	var theaterTmp = null;
	for (var j=0; j < this.theaterFavList.length; j++){
		theaterTmp = this.theaterFavList[j];
		if (theaterTmp.id != theater.id){
			listTmp.push(theaterTmp);
		}
	}
	this.theaterFavList = listTmp;
	
	this.showFav(this.theaterFavList);
	
};
