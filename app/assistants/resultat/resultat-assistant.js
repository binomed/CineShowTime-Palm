function ResultatAssistant(argFromPusher) {
	this.requestBean = argFromPusher.request;
	this.dbHelper = argFromPusher.dbHelper;
	this.theaterFavList = argFromPusher.theaterFavList;
	this.locale = argFromPusher.locale;
  this.timeZone = argFromPusher.timeZone;
  this.cst = argFromPusher.cst;
  this.preferences = argFromPusher.preferences;
  this.forceRequest = argFromPusher.forceRequest;
  
  this.theaterList = null;
	this.theaterListResults = null;
	this.movieList = null;
	this.movieMapList = null;
	this.bufferTheaterExtract = 0;
	this.callBack = this;
	this.moreResult = false;
	this.start = 0;
	this.theaterRequest = false;
	
	this.debug = this.cst.BLN_DEBUG;
	
	this.movieTheaterList = [];
	
	//Paramètre pour savoir si la liste principale est une liste de films ou de ciinéma
	this.theaterView = this.requestBean.nearResp;
	
	this.resutAssistant = this;
	this.listenTapTheaterHandler;
	
	this.nbTheaterResults = 0;
	this.nbTheaterResultsTreat = 0;
	this.parsing = 0;
	
	this.mainList = [];
	this.subList = [];
}

ResultatAssistant.prototype.setup = function(){
	
	this.drawerModel = {myOpenProperty:true};
	this.start = 0;
	
	this.recherche = {
		ville: this.requestBean.cityName,
		film: this.requestBean.movieName
	};
	
	this.listAttributes = {
		itemTemplate:'resultat/resultat-item', 
		listTemplate:'resultat/resultat-container',
			 renderLimit: 50
	};
	
	this.listSTAttributes = {
		itemTemplate:'resultat/resultat-showtime-item', 
		listTemplate:'resultat/resultat-showtime-container',
			renderLimit: 50
	};
			
	// Set up the attributes & model for the List widget:
	if(this.recherche.film != "" && this.recherche.film != null) {
		this.controller.get('recherche_termes').update($L("search") + " : " + this.recherche.film + ", " + this.recherche.ville);
	} else {
		this.controller.get('recherche_termes').update($L("search") + " : " + this.recherche.ville);
	}
	
	this.wordsList = this.controller.get('ResultListContainer');
		
	this.listModel = {
		listTitle:$L("Résultats").interpolate(this.recherche), 
		items:this.wordList
	};
	
	this.controller.setupWidget('listTheaterAndMovies', this.listAttributes, this.listModel);
	
//	this.listenTapTheaterHandler = this.listTapTheater.bindAsEventListener(this);
//	this.controller.listen("listTheaterAndMovies", Mojo.Event.listTap, this.listenTapTheaterHandler);
	
	this.spinnerModel = {spinning: false};
	this.controller.setupWidget("progressSpinner",this.attributes = {spinnerSize: 'large'},this.spinnerModel);
	
	$('loadingText').innerHTML = $L("searchNearProgressMsg");
	
	$('myScrim').show();
	this.spinnerModel.spinning = true;
	this.controller.modelChanged(this.spinnerModel);
	
	/* Création de la requete AJAX */
	try{
		//On regarde si on doit forcer un rafraichissemtn de la recherche
		if (this.forceRequest){
			if(!this.debug) {
 				this.launchRequest();
 			} else {
 				if ((this.requestBean.movieName == null) || (this.requestBean.movieName == "")){
	 				this.controller.showAlertDialog({
	 					onChoose:this.resultsDebug.bind(this),
	 					title: $L("launch request ?"),
	 					message: $L("Requete DEBUG "),
	 					choices:[{label: $L('OK'), value:'OK', type:'color'}]
	 				});
 				}else{
 					this.controller.showAlertDialog({
 						onChoose:this.resultsDebugMovie.bind(this),
 						title: $L("launch request ?"),
 						message: $L("Requete DEBUG MOVIE"),
 						choices:[{label: $L('OK'), value:'OK', type:'color'}]
 					});
 				}
 			}
		}else{
			console.log('ResultatAssistant.setup : before extractTheater : ');
			if (this.requestBean.theaterId != null){
				this.dbHelper.extractTheaterFromId(this.callBackTheaterList.bind(this), this.requestBean.theaterId);
			}else{
				this.dbHelper.extractTheater(this.callBackTheaterList.bind(this));
			}
		}
	}catch(e){
		console.log('ResultatAssistant.setup : Error setup extractTheater : '+e.message);
	}
	// Define the menu of film Card
	var menuItems = getDefaultMenu(this);
	var lastIndex = menuItems.length;	
	
	menuItems.push({ label: $L('menuSort'), items: [
	                                                {label: $L('sort_theaters_values_1'), command:this.cst.KEY_SUB_MENU_SORT_THEATER_NAME },
	                                                {label: $L('sort_theaters_values_2'), command:this.cst.KEY_SUB_MENU_SORT_THEATER_DISTANCE },
	                                                {label: $L('sort_theaters_values_3'), command:this.cst.KEY_SUB_MENU_SORT_SHOWTIME }
	                                                //{label: $L('sort_theaters_values_4'), command:this.cst.KEY_SUB_MENU_SORT_MOVIE_NAME }
	                                                ]});
	
	// Si c'est une requete par film alors on désactive les tris
//	if (this.requestBean.movieName != null && this.requestBean.movieName != ""){
//		menuItems[lastIndex].items[0].disabled = true;
//		menuItems[lastIndex].items[1].disabled = true;
//		menuItems[lastIndex].items[2].disabled = true;
//		//menuItems[lastIndex].items[3].disabled = true;
//	}
	
	this.appMenuModel = {
		visible: true,
		items: menuItems
	};

	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
};


ResultatAssistant.prototype.handleCommand = function (event) {
	this.controller=Mojo.Controller.stageController.activeScene();
    if(event.type == Mojo.Event.command) {	
    	if (!manageDefaultMenu(this, event)){
    		var theaterListTmp = [];
    		var theaterTmp = null;
    		var movieListTmp = [];
    		var movieTmp = null;
    		switch (event.command) {
    			case this.cst.KEY_SUB_MENU_SORT_THEATER_NAME:
    				movieListTmp = this.movieList;
    				this.movieList = movieListTmp;
    				theaterListTmp = sort(this.theaterList, new ComparatorTheaterName());
    				this.theaterList = theaterListTmp;
    				if (this.theaterView){
    					this.showResults(this.theaterList, this.movieList);
    				}else{
    					this.showResultsMovie(this.theaterList, this.movieList);
    				}
    				break;
    			case this.cst.KEY_SUB_MENU_SORT_THEATER_DISTANCE:
    				movieListTmp = this.movieList;
    				this.movieList = movieListTmp;
    				theaterListTmp = sort(this.theaterList, new ComparatorTheaterDistance());
    				this.theaterList = theaterListTmp;
    				if (this.theaterView){
    					this.showResults(this.theaterList, this.movieList);
    				}else{
    					this.showResultsMovie(this.theaterList, this.movieList);
    				}
    				break;
    			case this.cst.KEY_SUB_MENU_SORT_SHOWTIME:
    				movieListTmp = this.movieList;
    				this.movieList = movieListTmp;
    				
    				var thMap = null;
    				for (var i=0; i < this.theaterList.length; i++){
    					thMap = sort(this.theaterList[i].movieMap, new ComparatorShowTime());
    					this.theaterList[i].movieMap = thMap;
    				}
    				
    				theaterListTmp = sort(this.theaterList, new ComparatorTheaterShowTime());
    				this.theaterList = theaterListTmp;
    				if (this.theaterView){
    					this.showResults(this.theaterList, this.movieList);
    				}else{
    					this.showResultsMovie(this.theaterList, this.movieList);
    				}
    				
    				break;
    			case this.cst.KEY_SUB_MENU_SORT_MOVIE_NAME:
    				theaterListTmp = this.theaterList;
    				this.theaterList = theaterListTmp;
    				movieListTmp = sort(this.movieList, new ComparatorMovieName());
    				this.movieList = movieListTmp;
    				
    				this.showResultsMovie(this.theaterList, this.movieList);
    				break;
    		}
    		
    	}
	}
}

ResultatAssistant.prototype.ready = function(event) {
	
	   
};

ResultatAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	
};

ResultatAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ResultatAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */	  
};

ResultatAssistant.prototype.wordList = [{data:$L("Loading ..."), definition:$L("Loading data...")}];
ResultatAssistant.prototype.stList = [{data:$L("Loading ...")}];

ResultatAssistant.prototype.gotResults = function(transport) {
	/* Cette fonction est appelée par l'objet AJAX lors de l'instruction onSuccess 
	  elle est appelée  lorsque la requête a été correctement effectuée */
	try{
		var xmlstring = transport.responseText;	
		
		//console.log("ResultatAssistant.gotResults : XML réponse : " + xmlstring);
	
		// Convert the string to an XML object
		var xmlResult = (new DOMParser()).parseFromString(xmlstring, "text/xml");
		  
		this.loadResults(xmlResult, false);
	}catch (e) {
		console.log("Resultat.gotResults : error : "+e.message);
	}finally{
		/*this.spinnerModel.spinning = false;
		this.controller.modelChanged(this.spinnerModel);
		$('myScrim').hide();*/
	}
	
};

ResultatAssistant.prototype.gotResultsMovie = function(transport) {
	/* Cette fonction est appelée par l'objet AJAX lors de l'instruction onSuccess 
	elle est appelée  lorsque la requête a été correctement effectuée */
	try{
		var xmlstring = transport.responseText;	
		
		// Convert the string to an XML object
		var xmlResult = (new DOMParser()).parseFromString(xmlstring, "text/xml");
		
		this.loadResults(xmlResult, true);
	}catch (e) {
		console.log("Resultat.gotResultsMovie : error : "+e.message);
	}finally{
		/*this.spinnerModel.spinning = false;
		this.controller.modelChanged(this.spinnerModel);
		$('myScrim').hide();*/
	}
	
};

ResultatAssistant.prototype.resultsDebug = function () {
	var xmlResult = (new DOMParser()).parseFromString(this.results, "text/xml");
	this.loadResults(xmlResult, false);	
};
ResultatAssistant.prototype.resultsDebugMovie = function () {
	var xmlResult = (new DOMParser()).parseFromString(this.resultsMovie, "text/xml");
	this.loadResults(xmlResult, true);	
};

ResultatAssistant.prototype.findMovie = function(movieList, movieId) {
	var movie = null;
	for (var k = 0; k < movieList.length; k++) {
		var result = (movieList[k].id == movieId);
		if (movieList[k].id == movieId){
			movie = movieList[k];
			break;
		}
	}
	return movie;
};

ResultatAssistant.prototype.findTheater = function(theaterList, theaterId) {
	var theater = null;
	for (var k = 0; k < theaterList.length; k++) {
		var result = (theaterList[k].id == theaterId);
		if (theaterList[k].id == theaterId){
			theater = theaterList[k];
			break;
		}
	}
	return movie;
};

ResultatAssistant.prototype.completeLocalisationBean = function(theaterList){
	var latitude = this.requestBean.latitude;
	var longitude = this.requestBean.longitude;
	
	if ((latitude != null) && (longitude != null)){
		url += '&long='+longitude+'&lat='+latitude;
	}
	
	for(var i = 0; i < theaterList.length; i++) {
		console.log("ResultatAssistant.completeLocalisationBean : theater query : " + theaterList[i].place.searchQuery);
	}
	
	return theaterList;
}

ResultatAssistant.prototype.fillLocation = function(numTheater, transport) {
	console.log("ResultatAssistant.fillLocation : theater : " + transport.responseText);

	try {
		var jsonresult = transport.responseText.evalJSON(true);
		
		var localisation = this.theaterListResults[numTheater].place;
		if (jsonresult.Status.code == 200) {
			var placeMarkJson = jsonresult.Placemark[1];
			if (placeMarkJson != null){
				var addressDetailsJson = placeMarkJson.AddressDetails;
				if (addressDetailsJson != null){
					var countryJson = addressDetailsJson.Country;
					if (countryJson != null){
						localisation.countryName = countryJson.CountryName; //String
						localisation.countryNameCode = countryJson.CountryNameCode; //String
						var adminAreaJson = countryJson.AdministrativeArea;
						if (adminAreaJson != null){
							var subAdminAreaJson = adminAreaJson.SubAdministrativeArea;
							if (subAdminAreaJson != null){
								var localityJson = subAdminAreaJson.Locality;
								if (localityJson != null){
									localisation.cityName = localityJson.LocalityName;//String
									var postalCodeJson = localityJson.PostalCode;
									if( postalCodeJson != null){
										localisation.postalCityNumber = postalCodeJson.PostalCodeNumber; //String*/
									}
								}
							}
						}
					}
				}
				var directionJson = jsonresult.Directions;
				if (directionJson != null){
					var distanceJson = directionJson.Distance;
					var durationJson = directionJson.Duration;
					if (distanceJson != null){
						localisation.distance = distanceJson.meters; // Float On divise par 1000 pour avoir en km
					}
					if (durationJson != null){
						localisation.distanceTime = parseInt(durationJson.seconds+"000"); // Long
					}
				}
				var pointJson = placeMarkJson.Point;
				if (pointJson != null){
					localisation.latitude = pointJson.coordinates[0]; // Double
					localisation.longitude = pointJson.coordinates[1]; // Double
					
				}
				console.log("ResultatAssistant.fillLocation : theaterListResults[" + numTheater + "].place.distance : " + localisation.distance);
			}
		}
		
		// On met à jour le place
    this.theaterListResults[numTheater].place = localisation;
    
		this.nbTheaterResultsTreat++;
		if (this.nbTheaterResultsTreat == this.nbTheaterResults){
			var fct = this.loadResultsAfterFill.bind(this);
			fct();
		}
	} catch (e) {
		console.log('ResultatAssistant.fillLocation : error lors de la récupération des distance : '+e.message);
	}
}

ResultatAssistant.prototype.loadResults = function(xmlResult) {
	
	// parsing du résultat xml
	this.parsing = this.parsingXml(xmlResult);
	// On met à jour en base le requestBean pour avoir la bonne valeur de nearResp
	this.dbHelper.updateSearchRequest(this.requestBean);
	var theaterList = this.parsing['theaters'];
	this.theaterListResults = theaterList;
	var querymaps;
	var place = null;
	this.nbTheaterResults = this.theaterListResults.length;
	
	// Gestion des messages d'erreurs.
	var errorString = null;
	
	console.log("ResultatAssistant.loadResults : theater.id : " + theaterList[0].id + ", parseInt : " + parseInt(theaterList[0].id) + ", isNaN : " + isNaN(theaterList[0].id));
	
	
	if (theaterList.length == 1 ){
		var thTmp = theaterList[0];
		try{
		  if(!isNaN(thTmp.id)) {
  			switch (parseInt(thTmp.id)) {
  			case this.cst.ERROR_WRONG_PLACE:
  				errorString = "msgNoPlaceMatch";
  				break;
  			case this.cst.ERROR_WRONG_DATE:
  				errorString = "msgNoDateMatch";
  				break;
  			case this.cst.ERROR_NO_DATA:
  				if (!this.theaterView){
  					errorString = "txtMovieFindValueNotFound";
  				}else{
  					errorString = "msgNoResultRetryLater";
  				}
  				break;
  			case this.cst.ERROR_CUSTOM_MESSAGE:
  				errorString = decode(thTmp.theaterName);
  				break;
  			default:
  				break;
  			}
  		}
		}catch (e) {			
			// on catch une erreur car l'id peut être un id (dans ce cas une erreur)
		}
		
	}else if (theaterList.length == 0 && !this.theaterView){
		errorString = "msgNoDateMatch";
	}else if (theaterList.length == 0){
		errorString = "msgNoResultRetryLater";
	}else{
		console.log('ResultatAssistant.loadResults : else  :'+theaterList.length);
	}
	
	// On regarde donc si aucune erreur ne s'est produite, on affiche un message
	if (errorString == null){
	
    try {
          
      if (!this.cst.BLN_DEBUG) {
    	for(var i = 0; i < this.theaterListResults.length; i++) {
        if(this.theaterListResults[i].place != null && this.theaterListResults[i].place != "null") {
      		place = this.theaterListResults[i].place;
      		if (place != null && place.searchQuery != null && place.searchQuery != ""){
      			querymaps = {
      					from:this.requestBean.cityName.replace(" ", "+"),
      					to:decode(place.searchQuery).replace(" ", "+"),
      					key:this.cst.GOOGLE_MAPS_KEY
      			};
      			
      			var request = new Ajax.Request($L(this.cst.URL_DIST).interpolate(querymaps), {
      				method: 'get',
      				onSuccess: this.fillLocation.bind(this, i),
      				onFailure: this.failure.bind(this)				
      			});
      		}else{
      			this.nbTheaterResults--;
      		}
          console.log("ResultatAssistant.loadResults : requete maps : " + $L(this.cst.URL_DIST).interpolate(querymaps));  
    		}
    	}
    	}
    	
    	if(this.cst.BLN_DEBUG) {
        var fct = this.loadResultsAfterFill.bind(this);
			   fct();
      }
      
    } catch (e) {
      console.log("ResultatAssistant.loadResults : error : " + e.message);
    }
  }else{
    console.log('ResultatAssistant.loadResults : errorString : ' + errorString);
		this.wordList = [];
		this.wordList.push({
			id:0,
			data:$L(errorString),
			distance:" ",
			city:" ",
			favImg:"images/null.png",
			idFavImg:" "
		});
		
		// Rafraichissement de la liste
		this.listModel.items = this.wordList;
		this.controller.modelChanged(this.listModel, this);
		
		// Mise à jour de la liste des séances pour le cinéma
		this.controller.setupWidget('listShowTimes'+0, this.listSTAttributes, {listId:i,items:[]});
		this.controller.instantiateChildWidgets(this.controller.get('listTheaterAndMovies'));
		
		// Mise à jour du widget "Drawer" pour le cinéma
		this.controller.setupWidget('drawerTheater'+0, {property:'myOpenProperty'}, {myOpenProperty: false});		
		this.controller.instantiateChildWidgets(this.controller.get('listTheaterAndMovies'));
		
		// Mise en place du listener lancant la recherhce
		//this.controller.listen('rowClick'+0, Mojo.Event.tap, this.reLaunchRequest.bindAsEventListener(this));
		
		this.spinnerModel.spinning = false;
		this.controller.modelChanged(this.spinnerModel);
		$('myScrim').hide();
		
		// on va écrire en base que la requete s'est passée au temps 0 => on pourra relancer la requete
		this.requestBean.time = 0;
		this.dbHelper.insertSearchRequest(this.requestBean);
	}
}

ResultatAssistant.prototype.loadResultsAfterFill = function() {
		
	//var theaterList = this.parsing['theaters'];
	var theaterList = this.theaterListResults;
	var movieList = this.parsing['movies'];
	
	// Gestion des messages d'erreurs.
	var errorString = null;
	
	if (theaterList.length == 1 ){
		var thTmp = theaterList[0];
		try{
		  if(!isNaN(thTmp.id)) {
  			switch (parseInt(thTmp.id)) {
  			case this.cst.ERROR_WRONG_PLACE:
  				errorString = "msgNoPlaceMatch";
  				break;
  			case this.cst.ERROR_WRONG_DATE:
  				errorString = "msgNoDateMatch";
  				break;
  			case this.cst.ERROR_NO_DATA:
  				if (!this.theaterView){
  					errorString = "txtMovieFindValueNotFound";
  				}else{
  					errorString = "msgNoResultRetryLater";
  				}
  				break;
  			case this.cst.ERROR_CUSTOM_MESSAGE:
  				errorString = decode(thTmp.theaterName);
  				break;
  			default:
  				break;
  			}         
  		}
		}catch (e) {			
			// on catch une erreur car l'id peut être un id (dans ce cas une erreur)
		}
		
	}else if (theaterList.length == 0 && !this.theaterView){
		errorString = "msgNoDateMatch";
	}else if (theaterList.length == 0){
		errorString = "msgNoResultRetryLater";
	}else{
		console.log('ResultatAssistant.loadResultsAfterFill : else  :'+theaterList.length + ' '+movieList.length);
	}
	
	// On regarde donc si une erreur c'est produite, on affiche un message
	if (errorString != null){
		this.wordList = [];
		this.wordList.push({
			id:0,
			data:$L(errorString),
			distance:" ",
			city:" ",
			favImg:"images/null.png",
			idFavImg:" "
		});
		
		// Rafraichissement de la liste
		this.listModel.items = this.wordList;
		this.controller.modelChanged(this.listModel, this);
		
		// Mise à jour de la liste des séances pour le cinéma
		this.controller.setupWidget('listShowTimes'+0, this.listSTAttributes, {listId:i,items:[]});
		this.controller.instantiateChildWidgets(this.controller.get('listTheaterAndMovies'));
		
		// Mise à jour du widget "Drawer" pour le cinéma
		this.controller.setupWidget('drawerTheater'+0, {property:'myOpenProperty'}, {myOpenProperty: false});		
		this.controller.instantiateChildWidgets(this.controller.get('listTheaterAndMovies'));
		
		// Mise en place du listener lancant la recherhce
		//this.controller.listen('rowClick'+0, Mojo.Event.tap, this.reLaunchRequest.bindAsEventListener(this));
		
		this.spinnerModel.spinning = false;
		this.controller.modelChanged(this.spinnerModel);
		$('myScrim').hide();
		
		// on va écrire en base que la requete s'est passée au temps 0 => on pourra relancer la requete
		this.requestBean.time = 0;
		this.dbHelper.insertSearchRequest(this.requestBean);
	}else{
		//Cas d'initialisation
		if (this.start == 0){
			this.theaterList = theaterList;
			this.movieList = movieList;
		}else{
			//Cas où on complète
			for (var i=0; i < theaterList.length; i++){
				this.theaterList.push(theaterList[i]);
			}
			for (var i=0; i < movieList.length; i++){
				if (this.findMovie(this.movieList, movieList[i].Id) == null){
					this.movieList.push(movieList[i]);
				}
			}
		}
		
		console.log('ResultatAssistant.loadResultsAfterFill : Après parsing :'+theaterList.length + ' '+movieList.length);
		theaterList = this.theaterList;
		movieList = this.movieList
		
		try{
			this.showResultsWithPreferences(theaterList, movieList);
		}
		catch(e){
			console.log('ResultatAssistant.loadResultsAfterFill : error during showing results : '+e.message);
		}
	
		try{
			//Cas d'initialisation
			if (this.start == 0){
				this.dbHelper.clearTheaters(this.writeIntoDataBase.bind(this));
			}else{
				//Cas où on complète
				this.writeIntoDataBase();
			}
		}
		catch(e){
			console.log('ResultatAssistant.loadResultsAfterFill : error during writing into data bae : '+e.message);
		}   
		
		this.spinnerModel.spinning = false;
  	this.controller.modelChanged(this.spinnerModel);
  	$('myScrim').hide();
	}  
};


ResultatAssistant.prototype.launchRequest = function() {
	var place = encode(this.requestBean.cityName);
	var movieName = encode(this.requestBean.movieName);
	var latitude = this.requestBean.latitude;
	var longitude = this.requestBean.longitude;
	var theaterId = this.requestBean.theaterId;
	var dateToday = new Date();
	var currentTime = dateToday.getTime();
	var day = this.requestBean.day;
	
	var searchNear = ((movieName == null) || (movieName == ""));
	var url = null;
	if (searchNear){
		url = this.cst.URL_SERVER+'showtime/near?output=xml&oe=UTF-8&place='+place+'&curenttime='+currentTime+'&timezone='+this.timeZone+'&ie=UTF-8&lang='+this.locale;
		if (theaterId != null){
			url += '&tid='+theaterId;
		}
		
		if ((latitude != null) && (longitude != null)){
			url += '&long='+longitude+'&lat='+latitude;
		}
		
		if (this.start > 0){
			url += '&start='+this.start;
		}
		
		if (day > 0){
			url += '&day='+day;
		}
		
	}else{
		url = this.cst.URL_SERVER+'showtime/movie?output=xml&oe=UTF-8&place='+place+'&curenttime='+currentTime+'&timezone='+this.timeZone+'&ie=UTF-8&lang='+this.locale+'&moviename='+movieName;
		if ((latitude != null) && (longitude != null)){
			url += '&long='+longitude+'&lat='+latitude;
		}
		if (day > 0){
			url += '&day='+day;
		}
	}
	
	if(searchNear){
		console.log("ResultatAssistant.launchRequest : "+url);
		var request = new Ajax.Request(url, {
				method: 'get',
				onSuccess: this.gotResults.bind(this),
				onFailure: this.failure.bind(this)
			});
	}else{
		console.log("ResultatAssistant.launchRequest : "+url);
		var request = new Ajax.Request(url, {
				method: 'get',
				onSuccess: this.gotResultsMovie.bind(this),
				onFailure: this.failure.bind(this)
			});
		
	}
};

ResultatAssistant.prototype.showResultsWithPreferences = function(theaterList, movieList) {
	console.log("ResultatAssistant.showResultsWithPreferences : thList : "+theaterList.length+", movList : "+movieList.length+", thView : "+this.theaterView);
	var movieListTmp = null;
	var theaterListTmp = null;
	if (this.theaterView){
		var value = this.preferences.getPrefValue(this.preferences.KEY_PREF_SORT_THEATER);
		switch (value) {
		case this.preferences.VALUE_PREF_SORT_THEATER_NAME:
			theaterListTmp = sort(theaterList, new ComparatorTheaterName());
			this.theaterList = theaterListTmp;
			this.showResults(theaterListTmp, movieList);
			break;
		case this.preferences.VALUE_PREF_SORT_THEATER_DISTANCE:      
			theaterListTmp = sort(theaterList, new ComparatorTheaterDistance());
			this.theaterList = theaterListTmp;
			this.showResults(theaterListTmp, movieList);
			break;
		case this.preferences.VALUE_PREF_SORT_SHOWTIME:
			var thMap = null;
			for (var i=0; i < theaterList.length; i++){
				thMap = sort(theaterList[i].movieMap, new ComparatorShowTime());
				theaterList[i].movieMap = thMap;
			}
			
			theaterListTmp = sort(theaterList, new ComparatorTheaterShowTime());
			this.theaterList = theaterListTmp;
			this.showResults(theaterListTmp, movieList);
			break;
		case this.preferences.VALUE_PREF_SORT_MOVIE_NAME:
			movieListTmp = sort(movieList, new ComparatorMovieName());
			this.movieList = movieListTmp;
			this.showResultsMovie(theaterList, movieListTmp);			
			break;
		case this.preferences.VALUE_PREF_SORT_USER_PREFERENCE:
			
			break;
		default:
			break;
		}
	}else{
		this.showResultsMovie(theaterList, movieList);
	}
};



ResultatAssistant.prototype.showResultsGen = function() {
	// Initialisation des variables
	
	
	console.log('ResultatAssistant.showResultsGen : Show Results : main : '+this.mainList.length+' subList : '+this.subList.length);
	this.wordList = [];
	var listST = [];
	var distanceCinema = null;			
	var mainName = null;
	var mainObj = null;
	this.movieTheaterList = [];
	
	this.listModel.items = this.wordList;
	this.controller.modelChanged(this.listModel, this);
	
	// Exploitation des résultats
	for (var i = 0; i < this.mainList.length; i++) {
		
		mainObj = this.mainList[i];
		distanceCinema = mainObj.distance;
		
		if (this.theaterView){
			mainName = getFirstChar(mainObj.name,25); 
		}else{
			mainName = getFirstChar(mainObj.name,35); 
		}
		
		// On ajoute le cinéma à la liste		
		this.wordList.push({
			id:i,
			data:mainName,
			distance:distanceCinema,
			city:decode(mainObj.city),
			favImg:$L('images/#{img}').interpolate(mainObj.imgFav),
			idFavImg:$L('idFavImg#{num}').interpolate({num:i})
		});
		
		this.movieTheaterList.push({listId:i,items:[],opened:false});
		
	}
	
	if (this.moreResult && this.start <= 40){
		// gestion de la ligne "afficher plus de résultat"		
		this.wordList.push({
			id:this.mainList.length,
			data:$L("itemMoreTheaters"),
			distance:" ",
			city:" ",
			favImg:"images/null.png",
			idFavImg:" "
		});
		
		this.movieTheaterList.push({listId:this.mainList.length,items:[]});
		
	}
	this.listModel.items = this.wordList;
	this.controller.modelChanged(this.listModel, this);
	
	
	// Boucle pour ajouter les eventListener sur chaque élément de la liste et sous-liste
	for (var i = 0; i < this.mainList.length; i++) {
		try{
			// on instancie le widget correspondant 
			this.controller.setupWidget('listShowTimes'+i, this.listSTAttributes, this.movieTheaterList[i]);
			
			// Ajout du listener pour l'expand
			this.controller.listen('rowClick'+i, Mojo.Event.tap, this.toggleDrawerByTargetGen.bindAsEventListener(this));
			if (this.mainList[i].type == 'theater'){
				// Ajout du listener pour les favoris
				Mojo.Event.listen(this.controller.get($L('idFavImg#{num}').interpolate({num:i})),Mojo.Event.tap,this.toggleFav.bind(this));
			}
		}catch (e) {
			console.log("ResultatAssistant.showResultsGen : ERROR during posing listener on : "+this.mainList[i].name+", erreur : "+e.message);
		}
		
	}
	
	if (this.moreResult){
		try{
			this.controller.setupWidget('listShowTimes'+this.mainList.length, this.listSTAttributes, this.movieTheaterList[this.mainList.length]);
			// Mise en place du listener lancant la recherhce
			this.controller.listen('rowClick'+this.mainList.length, Mojo.Event.tap, this.reLaunchRequest.bindAsEventListener(this));
		}catch (e) {
			console.log("ResultatAssistant.showResultsGen : ERROR during posing listener on : more theater, erreur : "+e.message);
		}
	}
	this.controller.instantiateChildWidgets(this.controller.get('listTheaterAndMovies'));
	
	/* Fix pour bottomSpacer trop grand */
	var spacers = $$('[name="bottomSpacer"]');
	console.log('ResultatAssistant.showResultsGen : bottomSpacer : '+spacers.length);
	for (var i = 0; i < spacers.length; i++) { 
		console.log('ResultatAssistant.showResultsGen : bottomSpacer : '+spacers[i].style);
		spacers[i].style.height = ""; 
	}
	
	if(this.listModel.items.length == 1) {
		var fctOpenDrawer = this.toggleUniqueDrawerGen.bind(this);
		fctOpenDrawer();
	}
	
};

// Show results on screen
ResultatAssistant.prototype.showResults = function(theaterList, movieList) {
	// Initialisation des variables
	
	
	console.log('ResultatAssistant.showResults : Show Results : theaters : '+theaterList.length+' movies : '+movieList.length);
	this.theaterView = true;
	this.mainList = [];
	this.subList = [];
	var distanceCinema = null;			
	var distanceTime = null;			
	var imgFav = null;
	var theater = null;
	var movie = null;
	var movieMap = null;
	var localisation = null;
	var mainObj = null;
	var mainObjSubList = [];
	var subObj = null;
	var myDate = new Date();
	
	
	 // Remove event listeners TODO
//	try{
//    this.controller.stopListening("listTheaterAndMovies", Mojo.Event.listTap, this.listenTapTheaterHandler);
//	}catch (e) {
//	}
	
	// Exploitation des résultats
	for (var i = 0; i < movieList.length; i++) {
		movie = movieList[i];
		
		if (!isNaN(movie.movieTime) && (movie.movieTime != null)){
			myDate.setTime(parseInt(movie.movieTime));
			// On récupère le temps du film
			distanceCinema = trailZeros(myDate.getHours()) + $L("h") + trailZeros(myDate.getMinutes());
		}else{
			distanceCinema= "";
		}
		
		subObj = {
				id: movie.id,
				name: movie.movieName,
				movieTime: distanceCinema,
				type: 'movie',
				data: movie
		}
		this.subList.push(subObj);
	}
	for (var i = 0; i < theaterList.length; i++) {
		
		theater = theaterList[i];
		localisation = theater.place;
		
		// On récupère la distance
		if(localisation.distance != null && localisation.distance != "") {
			
			if(this.preferences.getPrefValue(this.preferences.KEY_PREF_MEASURE) == $L("measure_code_1"))  {
				distanceCinema = parseFloat(localisation.distance)/1000;	
				distanceCinema = distanceCinema + ' ' + $L("measure_1");
			} else {
				// TODO Calcul
				distanceCinema = Math.round((parseFloat(localisation.distance)/1000)*0.621371192*100)/100;	
				distanceCinema = distanceCinema + ' ' + $L("measure_2");
			}
		} else {
			distanceCinema = "&nbsp;";
		}
		
		if (this.inFav(theater)){ 
			imgFav = {img:'btn_star_big_on.png'};
		}else{
			imgFav = {img:'btn_star_big_off.png'};
		}
		
		if (theater.place != null && theater.place.distanceTime != null){
			distanceTime = theater.place.distanceTime;
		}else{
			distanceTime = null;
		}
		
		mainObjSubList = [];
		for (var j = 0; j < theater.movieMap.length; j++){
			movieMap = theater.movieMap[j];
			subObj = {
					id: movieMap.id,
					showtimes: movieMap.data
			};
			mainObjSubList.push(subObj);
		}
		
		mainObj = {
				id: theater.id,
				name: theater.theaterName,
				distance: distanceCinema,
				distanceTime: distanceTime,
				imgFav: imgFav,
				type: 'theater',
				data: theater,
				subList: mainObjSubList
		};
		
		this.mainList.push(mainObj);
		
		
	}
	
	// On appel l'affichage générique des cinéma
	this.showResultsGen();
};

ResultatAssistant.prototype.showResultsMovie = function(theaterList, movieList) {
	// Initialisation des variables
	
	console.log('ResultatAssistant.showResultsMovie : Show Results : theaters : '+theaterList.length+' movies : '+movieList.length);
	this.theaterRequest = true;
	this.theaterView = false;
	this.mainList = [];
	this.subList = [];
	var distanceCinema = null;			
	var distanceTime = null;			
	var imgFav = null;
	var theater = null;
	var movie = null;
	var movieMap = null;
	var myDate = null;
	var subObj = null;
	var mainObj = null;
	var mainObjSubList = null;
	
	// On convertit les list dans le but d'avoir un parcours optimisé par la suite
	
	for (var i = 0; i < theaterList.length; i++) {
		theater = theaterList[i];
		if (theater.place != null && theater.place.distanceTime != null){
			distanceTime = theater.place.distanceTime;
		}else{
			distanceTime = null;
		}
		
		// On récupère la distance
		if(theater.place != null && theater.place.distance != null && theater.place.distance != "") {
			
			if(this.preferences.getPrefValue(this.preferences.KEY_PREF_MEASURE) == $L("measure_code_1"))  {
				distanceCinema = parseFloat(theater.place.distance)/1000;	
				distanceCinema = distanceCinema + ' ' + $L("measure_1");
			} else {
				// TODO Calcul                                      
				// GR : 20100710 - Erreur plaec au lieu de place
				distanceCinema = Math.round((parseFloat(theater.place.distance)/1000)*0.621371192*100)/100;	
				distanceCinema = distanceCinema + ' ' + $L("measure_2");
			}
		} else {
			distanceCinema = "&nbsp;";
		}
		
		subObj = {
				id: theater.id,
				name: theater.theaterName,
				movieTime: distanceCinema,
				distanceTime: distanceTime,
				type: 'theater',
				data: theater
		}
		this.subList.push(subObj);
	}
	
	myDate = new Date();
	for (var i = 0; i < movieList.length; i++){
		
		movie = movieList[i];
		mainObjSubList = [];
		for (var j = 0; j < theaterList.length; j++){
			theater = theaterList[j];
			movie_map_label:
			for (var k = 0; k < theater.movieMap.length; k++){
				movieMap = theater.movieMap[k];
				if (movieMap.id == movie.id){
					subObj = {
						id: theater.id,
						showtimes: movieMap.data
					};
					mainObjSubList.push(subObj);
					break movie_map_label;
				}
			}
		}
		
		
		if (!isNaN(movie.movieTime) && (movie.movieTime != null)){
			myDate.setTime(parseInt(movie.movieTime));
			// On récupère le temps du film
			distanceCinema = trailZeros(myDate.getHours()) + $L("h") + trailZeros(myDate.getMinutes());
		}else{
			distanceCinema= "";
		}
		imgFav = {img:'null.png'};
		
		mainObj = {
				id: movie.id,
				name: movie.movieName,
				distance: distanceCinema,
				distanceTime: distanceTime,
				imgFav: imgFav,
				type: 'movie',
				data: movie,
				subList: mainObjSubList
		};
		
		this.mainList.push(mainObj);
	}
	
	// on appell l'affichage générique
	this.showResultsGen();
	
};

ResultatAssistant.prototype.listTapTheater = function(event){
	console.log("ResultatAssistant.testEventListTap : event : "+event);
	 var target = event.originalEvent.target.id;
	 console.log("ResultatAssistant.testEventListTap : id : "+target);
	 if (target.startsWith('rowClick')){
		 var indexTheater = target.substring(8,target.length);
		 console.log("ResultatAssistant.testEventListTap : index : "+indexTheater);
		 if (indexTheater < this.theaterList.length){
			 this.toggleDrawerByTarget(indexTheater);
		 }else{
			 this.reLaunchRequest();
		 }
	 }else if (target.startsWith('idFavImg')){
		 var indexTheater = target.substring(8,target.length);
		 console.log("ResultatAssistant.testEventListTap : index : "+indexTheater);
		 if (indexTheater < this.theaterList.length){
			 this.toggleFav(indexTheater);
		 }
	 }
};

ResultatAssistant.prototype.reLaunchRequest = function(){

	$('myScrim').show();
	this.spinnerModel.spinning = true;
	this.controller.modelChanged(this.spinnerModel);

	this.start = this.start + 10;
	this.launchRequest();
};



// Xml Parsing and write into data base of results
ResultatAssistant.prototype.parsingXml = function(xmlResult) {
	// Parcours de la liste des cinémas
	var theater = null;
	var movie = null;
	var movieMap = null;
	var projection = null;
	var projectionList = null;
	var localisation = null;
	var tagTheater = null;
	var tagLocalisation = null;
	var tagMovie = null;
	var tagProjection = null;
	
	var theaterList = [];
	var movieList = [];
	
	try {
  	this.moreResult = xmlResult.getElementsByTagName("NEAR_RESP")[0].getAttribute("MORE_RESULTS") == 'true';
  	
  	// On récupère le mode d'affichage et on met à jour le requestBean associé
  	this.theaterView = xmlResult.getElementsByTagName("NEAR_RESP")[0].getAttribute("NEAR_RESP") == 'true';
  	this.requestBean.nearResp = this.theaterView;
  	console.log("ResultatsAssistant.parsingXml : xmlResults : "+xmlResult.getElementsByTagName("NEAR_RESP")[0].getAttribute("NEAR_RESP")+", theaterView : "+this.theaterView)
  	
  	
  	// Liste des films
  	for (var k = 0; k < xmlResult.getElementsByTagName("MOVIE_LIST")[0].getElementsByTagName("MOVIE").length; k++) {
  		tagMovie = xmlResult.getElementsByTagName("MOVIE_LIST")[0].getElementsByTagName("MOVIE")[k];
  		
  		movie = new MovieBean();
  		movie.id = tagMovie.getAttribute("ID");
  		movie.movieName = tagMovie.getAttribute("MOVIE_NAME");
  		movie.englishMovieName = tagMovie.getAttribute("ENGLISH_MOVIE_NAME");
  		movie.movieTime = tagMovie.getAttribute("TIME");
  		
  		movieList.push(movie);
  	}
  	
  	// Liste des cinémas avec les séances
  	for (var i = 0; i < xmlResult.getElementsByTagName("THEATER").length; i++) {
  		
  		tagTheater = xmlResult.getElementsByTagName("THEATER")[i];
  		tagLocalisation = tagTheater.getElementsByTagName("LOCALISATION")[0];
  		
  		
  		theater = new TheaterBean();
  		theater.id = tagTheater.getAttribute("ID");
  		theater.theaterName = tagTheater.getAttribute("THEATER_NAME");
  		theater.phoneNumber = tagTheater.getAttribute("PHONE_NUMBER");
  		theater.movieMap = [];
  		
  		if (tagLocalisation != null){
  			localisation = new LocalisationBean();
  			/*localisation.cityName = tagLocalisation.getAttribute("CITY_NAME");//String
  			localisation.countryName = tagLocalisation.getAttribute("COUNTRY_NAME"); //String
  			localisation.countryNameCode = tagLocalisation.getAttribute("COUNTRY_CODE"); //String
  			localisation.distance = tagLocalisation.getAttribute("DISTANCE"); // Float
  			localisation.distanceTime = tagLocalisation.getAttribute("DISTANCE_TIME"); // Long
  			localisation.latitude = tagLocalisation.getAttribute("LATITUDE"); // Double
  			localisation.longitude = tagLocalisation.getAttribute("LONGITUDE"); // Double
  			localisation.postalCityNumber = tagLocalisation.getAttribute("POSTAL_CODE"); //String*/
  			localisation.searchQuery = tagLocalisation.getAttribute("SEARCH_QUERY"); //String
  			theater.place = localisation;
  		}
  		
  		theaterList.push(theater);
  		
  		for (var j = 0; j < tagTheater.getElementsByTagName("MOVIE").length; j++) {
  			
  			tagMovie = tagTheater.getElementsByTagName("MOVIE")[j];
  			movie = this.findMovie(movieList, tagMovie.getAttribute("ID"));
  			if (movie != null){
  				projectionList = [];
  				for(var k = 0; k < tagMovie.getElementsByTagName("PROJECTION").length; k++) {
  					tagProjection = tagTheater.getElementsByTagName("MOVIE")[j].getElementsByTagName("PROJECTION")[k];
  					projection = new ProjectionBean();
  					projection.showtime = tagProjection.getAttribute("TIME");
  					projection.lang = tagProjection.getAttribute("LANG");
  					projection.reservationLink = tagProjection.getAttribute("RESERVATION_URL");
  					
  					projectionList.push(projection);
  					
  				}
  				theater.movieMap.push({id:movie.id, data:projectionList});
  			}
  		}
	   }
	  } catch(e) {
      console.log('ResultatAssistant.parsingXml : error : '+ e.message);
    }
	  
	
	return {theaters:theaterList, movies:movieList};
	
};


//ResultatAssistant.prototype.toggleFav = function(indexTheater) {
ResultatAssistant.prototype.toggleFav = function(event) {
	var id = ""+event.target.id;//idFavImg
	var indice = parseInt(id.substring(8, id.length));
//	var indice = indexTheater;
	var theater = this.theaterList[indice];
	var fav = this.inFav(theater);
	if (fav){
		imgFav = {img:'btn_star_big_off.png'};
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
	}else{
		imgFav = {img:'btn_star_big_on.png'};
		if (theater.place == null || theater.place.cityName == null || theater.place.cityName == ""){
			theater.place = new LocalisationBean();
			theater.place.cityName = this.requestBean.cityName;
		}
		this.dbHelper.insertFavTheater(theater);
		this.theaterFavList.push(theater);
	}
	$("idFavImg"+indice).src = $L('images/#{img}').interpolate(imgFav);
	
}

/* Fonction qui ouvre la liste quand il n'y a qu'un élément */
ResultatAssistant.prototype.toggleUniqueDrawerGen = function(event) {
	
	// On récupère l'élément qui a déclenché l'évènement
	var targetRow = this.controller.get('rowClick0');
	var indexObj = 0;
	var mainObj = this.mainList[indexObj];
	var subObj = null;
	var subMap = null;
	var movie = null;
	var projection = null;
	var horairesFilm = null;
	var nexShowtime = null;
	var myDate = null;
	var stringHour = null;
	var movieList = this.movieList;
	var listST = [];
	
	if(!this.movieTheaterList[indexObj].opened) {
		// On va instancier la base de la liste des séances
		
		console.log('ResultatAssistant.toggleUniqueDrawerGen : '+mainObj.name);
		var distanceAvailable = this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_DIRECTION);
		var timeFormat = this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_FORMAT);
		var distanceTime = null;
		// Pour chaque séance de ce cinéma on va l'ajouter à la liste des séances
		for (var j = 0; j < mainObj.subList.length; j++) {
			subMap = mainObj.subList[j];
			try{
				subObj = findObj(this.subList, subMap.id);
			}catch (e) {
				console.log("ResultatAssistant.toggleUniqueDrawerGen : findMovie error : "+e.message);
			}
			
			// Recherche des horaires
			horairesFilm = "";
			nextShowtime = false;
			
			distance = null;
			if (distanceAvailable){
				if (mainObj.type == 'theater' && mainObj.distanceTime != null){
					distanceTime = mainObj.distanceTime;
				}else if (mainObj.type == 'movie' && subObj.distanceTime != null){
					distanceTime = subObj.distanceTime;
				}
			}
			
			var horairesFilm = getShowtimes(subMap.showtimes, distanceTime, timeFormat);
			
			// Ajout du film à la liste des séances pour ce cinéma
			try{
				listST.push({
					idtheater:indexObj,
					idfilm:j,
					tid:mainObj.id,
					mid:subObj.id,
					data:decode(subObj.name),
					movieTime:decode(subObj.movieTime),
					horaires:decode(horairesFilm)
				});
			}catch (e) {
				console.log("ResultatAssistant.toggleUniqueDrawerGen : listPush error : "+e.message+", subId : "+subMap.id+", main : "+mainObj.name);
			}
			
		}
		
		// Mise à jour de la liste des séances pour le cinéma
		this.movieTheaterList[indexObj].items = listST;
		this.movieTheaterList[indexObj].opened = true;
		this.controller.modelChanged(this.movieTheaterList[indexObj], this);
		
		// Mise à jour du widget "Drawer" pour le cinéma
		this.controller.setupWidget('drawerTheater'+indexObj, {property:'myOpenProperty'}, {myOpenProperty:false});		
		this.controller.instantiateChildWidgets(this.controller.get('listShowTimes'+indexObj));
		
		try{
			for (var j = 0; j < mainObj.subList.length; j++) {
				this.controller.listen('film'+indexObj+'-'+j, Mojo.Event.tap, this.showMovie.bindAsEventListener(this));
			}
		}catch (e) {
			console.log('ResultatAssistant.toggleUniqueDrawerGen : error pose bind drawer: '+e.message);
		}
	}
	
	try{
		// On récupère le "drawer" associé
		var drawer = targetRow.up('.palm-row').next('.showtime_list').down('.drawer');
		targetRow.up('.palm-row').down('.fold_arrow').toggleClassName('unfolded');	
		
		//console.log("ResultatAssistant.toggleUniqueDrawer : Drawer " + event.target.getAttribute("class") + " : " + drawer);
		
		// On change l'état ouvert/fermé du drawer
		drawer.mojo.setOpenState(!drawer.mojo.getOpenState());
	}catch (e) {
		console.log('ResultatAssistant.toggleUniqueDrawerGen : ERROR : '+e.message)
	}
	
	/* Fix pour bottomSpacer trop grand */
	var spacers = $$('[name="bottomSpacer"]');
	console.log('ResultatAssistant.toggleUniqueDrawerGen : bottomSpacer : '+spacers.length);
	for (var i = 0; i < spacers.length; i++) { 
		console.log('ResultatAssistant.toggleUniqueDrawerGen : bottomSpacer : '+spacers[i].style);
		spacers[i].style.height = ""; 
	}
};

/* Fonction qui va ouvrir un cinéma pour afficher ses films et horaires */
ResultatAssistant.prototype.toggleDrawerByTargetGen = function(event) {
	
	// On récupère l'élément qui a déclenché l'évènement
	var targetRow = this.controller.get(event.target);
	var indexObj = targetRow.up('.palm-row').readAttribute("theater");
	var mainObj = this.mainList[indexObj];
	var subMap = null;
	var subObj = null;
	var projection = null;
	var horairesFilm = null;
	var nexShowtime = null;
	var myDate = null;
	var stringHour = null;
	var movieList = this.movieList;
	var listST = [];
	
	if(!this.movieTheaterList[indexObj].opened) {
		// On réinitialise au cas où on a déjà affiché les résultats (cas de tri)
		this.movieTheaterList[indexObj].items = listST;
		this.controller.modelChanged(this.movieTheaterList[indexObj], this);
		
		// On va instancier la base de la liste des séances
		
		var distanceAvailable = this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_DIRECTION);
		var timeFormat = this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_FORMAT);
		var distanceTime = null;
		
		console.log('ResultatAssistant.toggleDrawerByTargetGen : '+mainObj.name);
		// Pour chaque séance de ce cinéma on va l'ajouter à la liste des séances
		for (var j = 0; j < mainObj.subList.length; j++) {
			subMap = mainObj.subList[j];
			try{
				subObj = findObj(this.subList, subMap.id);
			}catch (e) {
				console.log("ResultatAssistant.toggleDrawerByTargetGen : findObj error : "+e.message);
			}
			
			// Recherche des horaires
			horairesFilm = "";
			nextShowtime = false;
			
			distance = null;
			if (distanceAvailable){
				if (mainObj.type == 'theater' && mainObj.distanceTime != null){
					distanceTime = mainObj.distanceTime;
				}else if (mainObj.type == 'movie' && subObj.distanceTime != null){
					distanceTime = subObj.distanceTime;
				}
			}
			
			var horairesFilm = getShowtimes(subMap.showtimes, distanceTime, timeFormat);
			
			// Ajout du film à la liste des séances pour ce cinéma
			try{
				listST.push({
					idtheater:indexObj,
					idfilm:j,
					tid:mainObj.id,
					mid:subObj.id,
					data:decode(subObj.name),
					movieTime:decode(subObj.movieTime),
					horaires:decode(horairesFilm)
				});
			}catch (e) {
				console.log("ResultatAssistant.toggleDrawerByTargetGen : listPush error : "+e.message+", mId : "+subMap.id+", th : "+mainObj.name);
			}
			
		}
		
		// Mise à jour de la liste des séances pour le cinéma
		this.movieTheaterList[indexObj].items = listST;
		this.movieTheaterList[indexObj].opened = true;
		this.controller.modelChanged(this.movieTheaterList[indexObj], this);
		
		// Mise à jour du widget "Drawer" pour le cinéma
		this.controller.setupWidget('drawerTheater'+indexObj, {property:'myOpenProperty'}, {myOpenProperty: false});		
		this.controller.instantiateChildWidgets(this.controller.get('listShowTimes'+indexObj));
		
		
		try{
			for (var j = 0; j < mainObj.subList.length; j++) {
				console.log("ResultatAssistant.toggleDrawerByTargetGen : pose film : "+indexObj+", j : "+j+", exist ?"+($('film'+indexObj+'-'+j) == null));
				this.controller.listen('film'+indexObj+'-'+j, Mojo.Event.tap, this.showMovie.bindAsEventListener(this));
			}
		}catch (e) {
			console.log('ResultatAssistant.toggleDrawerByTargetGen : error pose bind drawer: '+e.message);
		}
	}
	
	try{
		// On récupère le "drawer" associé
//		var rowElement = this.controller.get('row'+indexTheater);
//		var drawer = this.controller.get('drawerTheater'+indexTheater);
//		rowElement.down('.fold_arrow').toggleClassName('unfolded');	
		var drawer = targetRow.up('.palm-row').next('.showtime_list').down('.drawer');
		targetRow.up('.palm-row').down('.fold_arrow').toggleClassName('unfolded');	
		
//		console.log("ResultatAssistant.toggleDrawerByTarget : Drawer " + event.target.getAttribute("class") + " : " + drawer);
		console.log("ResultatAssistant.toggleDrawerByTargetGen : Drawer " +  drawer.id+", open ? "+drawer.mojo.getOpenState());
		
		// On change l'état ouvert/fermé du drawer
		drawer.mojo.setOpenState(!drawer.mojo.getOpenState());
	}catch (e) {
		console.log('ResultatAssistant.toggleDrawerByTargetGen : ERROR : '+e.message)
	}
	
	/* Fix pour bottomSpacer trop grand */
	var spacers = $$('[name="bottomSpacer"]');
	console.log('ResultatAssistant.toggleDrawerByTargetGen : bottomSpacer : '+spacers.length);
	for (var i = 0; i < spacers.length; i++) { 
		console.log('ResultatAssistant.toggleDrawerByTargetGen : bottomSpacer : '+spacers[i].style);
		spacers[i].style.height = ""; 
	}
};

/* Fonction qui va afficher un film */
ResultatAssistant.prototype.showMovie = function(event) {
	// On récupère l'élément qui a déclenché l'évènement
	var targetRow = this.controller.get(event.target);
	var indexObj = targetRow.up('.palm-row').readAttribute("theater");
	var indexSub = targetRow.up('.palm-row').readAttribute("movie");
	
	var mainObj = this.mainList[indexObj];
	var subObj = mainObj.subList[indexSub];
	
	var theaterBean = null;
	var movieBean = null;
	
	if (this.theaterView){
		theaterBean = mainObj.data;
		movieBean = findObj(this.movieList, subObj.id);
	}else{
		theaterBean = findObj(this.theaterList, subObj.id);
		movieBean = mainObj.data;
	}
	
	var movie = {
		theater:theaterBean,
		movie:movieBean,
		locale:this.locale,
		request:this.requestBean,
		dbHelper:this.dbHelper,
		cst:this.cst,
		preferences: this.preferences,
		theaterRequest:this.theaterRequest
	};
	
	this.controller.stageController.pushScene("film", movie);	
}

ResultatAssistant.prototype.failure = function(transport) {
	/* Cette fonction est appelée par l'objet AJAX lors de l'instruction onFailure 
	  elle est appelée  lorsque la requête a retourné une erreur */
	  
	if(timeOut) {
		this.controller.showAlertDialog({
			onChoose: function(value) { timeOut = false; Mojo.Controller.stageController.popScene('resultat'); },
			title: $L("Error"),
			message: $L("msgErrorNoNetwork"),
			choices:[{label: $L('OK'), value:'OK', type:'color'}]
		});	  
	} else {
		this.controller.showAlertDialog({
			onChoose: function(value) { Mojo.Controller.stageController.popScene('resultat'); },
			title: $L("Error"),
			message: $L("msgErrorOnServer"),
			choices:[{label: $L('OK'), value:'OK', type:'color'}]
		});	  
	}
	
	this.wordList = [{data:$L("errorMsg")}];
	this.listModel.items = this.wordList;
	this.controller.modelChanged(this.listModel, this);
}

/*  SQL PART  */

ResultatAssistant.prototype.inFav = function(theater) {
	var result = false;
	var theaterTmp = null;
	for (var i = 0; i < this.theaterFavList.length; i++){
		theaterTmp = this.theaterFavList[i];
		if (theaterTmp.id == theater.id){
			result = true;
			break;
		}
	}
	return result;
};

ResultatAssistant.prototype.writeIntoDataBase = function() {
	var theaterList = this.theaterList;
	var movieList = this.movieList;
	console.log('ResultatAssistant.writeIntoDataBase : Writing into DataBase : '+theaterList.length+' theaters and : '+movieList.length+' movies');
	
	var theater = null;
	var movie = null;
	var projection = null;
	var movieMap = null;
	for (var i = 0; i < movieList.length; i++) {
		
		movie = movieList[i];
		// insert into data base;
		try{
			this.dbHelper.insertMovie(movie);
		}
		catch(e){
			console.log("ResultatAssistant.writeIntoDataBase : error inserting movie : "+movie.movieName);
		}
	}
	
	// Liste des cinémas avec les séances
	for (var i = 0; i < theaterList.length; i++) {
		
		theater = theaterList[i];
		// Insert into data base
		try{
			this.dbHelper.insertTheater(theater);
		}
		catch(e){
			console.log("ResultatAssistant.writeIntoDataBase : error inserting theater : "+theater.theaterName);
		}
		
		var count = 0;
		for (var j = 0; j < theater.movieMap.length; j++) {
			movieMap = theater.movieMap[j];
			movie = this.findMovie(movieList, movieMap['id']);
			
			for(var k = 0; k < movieMap['data'].length; k++) {
				count++;
				projection = movieMap['data'][k];
				
				//Insert into database
				try{
					this.dbHelper.insertShowTime(theater, movie, projection);
				}
				catch(e){
					console.log("ResultatAssistant.writeIntoDataBase : error inserting showtime : "+movie+' '+theater+' '+projection);
				}
			}
		}
		console.log("ResultatAssistant.writeIntoDataBase : "+count+" showtime to add for "+theater.theaterName);
	}
}

ResultatAssistant.prototype.callBackTheaterList = function(theaterList) { 
   // Handle the results
  try {
    this.theaterList = theaterList;
  	if (theaterList.length > 0){
  	 this.dbHelper.extractMovie(this.callBackMovieList.bind(this));
    }
    
    this.spinnerModel.spinning = false;
		this.controller.modelChanged(this.spinnerModel);
		$('myScrim').hide();
 	}
 	catch (e)
 	{
 		console.log('ResultatAssistant.callBackTheaterList : Error during extracting theaters : '+e.message);	
 	} 

};

ResultatAssistant.prototype.callBackMovieList = function(movieList) { 
	this.movieList = movieList;
	var theater = null;
	this.bufferTheaterExtract = 0;
	console.log('ResultatAssistant.callBackMovieList : '+movieList.length+' theaterList : '+this.theaterList.length);
	for (var i = 0; i < this.theaterList.length; i++){
		theater = this.theaterList[i];
		this.dbHelper.extractShowTimeFromTheater(theater, this.callBackShowTime.bind(this));
	}
	
};

ResultatAssistant.prototype.callBackShowTime = function() {
	this.bufferTheaterExtract++ ;
	console.log('ResultatAssistant.callBackShowTime : '+this.bufferTheaterExtract+' theaterList  :'+this.theaterList.length);
	if (this.bufferTheaterExtract == (this.theaterList.length)){
		try{
			this.showResultsWithPreferences(this.theaterList, this.movieList);
		}
		catch(e){
			console.log('ResultatAssistant.callBackShowTime : error in ShowResults: '+e.message);
		}
	}
};
 

ResultatAssistant.prototype.results = "<?xml version='1.0' encoding='UTF-8'?>" +
"<NEAR_RESP CITY_NAME = 'Nantes%2C+FR' MORE_RESULTS = 'true'>" +
"    <MOVIE_LIST>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'The+Princess+and+the+Frog' ID = '60ee7fe13ada70ca' LANG = '? Dubbed in French  ' MOVIE_NAME = 'La+Princesse+et+la+grenouille' TIME = '1267403869110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'I+Love+You+Phillip+Morris' ID = 'f4816c32aa5a70ea' LANG = '? Subtitled in French  ' MOVIE_NAME = 'I+Love+You+Phillip+Morris' TIME = '1267403809110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Metropolis' ID = 'f55fe69499963390' LANG = '? Subtitled in French  ' MOVIE_NAME = 'Metropolis' TIME = '1267400569110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Sherlock+Holmes' ID = '49f537e6afbe5674' LANG = '? Dubbed in French  ' MOVIE_NAME = 'Sherlock+Holmes' TIME = '1267405729110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Thelma%2C+Louise+et+Chantal' ID = 'a7a95976434ba2db' LANG = '? ' MOVIE_NAME = 'Thelma%2C+Louise+et+Chantal' TIME = '1267403449110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'La+R%C3%A9gate' ID = 'b60ab62073681d48' LANG = '? ' MOVIE_NAME = 'La+R%C3%A9gate' TIME = '1267403509110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Nine' ID = 'a184cf380a530bdb' LANG = '? Subtitled in French  ' MOVIE_NAME = 'Nine' TIME = '1267405129110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'A+Single+Man' ID = '41ee96f5b250fd2e' LANG = '? Subtitled in French  ' MOVIE_NAME = 'A+Single+Man' TIME = '1267403989110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'The+Shock+Doctrine' ID = '331f0fe08d1d02e6' LANG = '? Subtitled in French  ' MOVIE_NAME = 'La+Strat%C3%A9gie+du+choc' TIME = '1267403149110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Le+Grand+Jeu' ID = 'd6e8fa0f4808103d' LANG = '? ' MOVIE_NAME = 'Le+Grand+Jeu' TIME = '1267404949110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'L%27Arbre+et+la+for%C3%AAt' ID = '346159f78e441697' LANG = '? ' MOVIE_NAME = 'L%27Arbre+et+la+for%C3%AAt' TIME = '1267403869110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Precious%3A+Based+on+the+Novel+%27Push%27+by+Sapphire' ID = '54a9eb9264f684db' LANG = '? Subtitled in French  ' MOVIE_NAME = 'Precious' TIME = '1267404589110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Oc%C3%A9ans' ID = '980e31baf8023278' LANG = '? ' MOVIE_NAME = 'Oc%C3%A9ans' TIME = '1267404229110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Shutter+Island' ID = '25590e5366c2cd57' LANG = '? Subtitled in French  ' MOVIE_NAME = 'Shutter+Island' TIME = '1267406269110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Percy+Jackson+%26+The+Olympians+%3A+The+Lightning+Thief' ID = '9ef4d2336eff2a76' LANG = '? Dubbed in French  ' MOVIE_NAME = 'Percy+Jackson+le+voleur+de+foudre' TIME = '1267405369110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Le+Mac' ID = 'f7d01897bf978f7b' LANG = '? ' MOVIE_NAME = 'Le+Mac' TIME = '1267402849110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'The+Fantastic+Mr.+Fox' ID = 'e124555dab1fc3c' LANG = '? Subtitled in French  ' MOVIE_NAME = 'Fantastic+Mr.+Fox' TIME = '1267403329110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Ensemble+c%27est+trop' ID = '33b9bbbe9cb0ea17' LANG = '? ' MOVIE_NAME = 'Ensemble+c%27est+trop' TIME = '1267403809110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Fang+Zhi+Gu+Niang' ID = 'c92c44f40e4dfcf' LANG = '? Subtitled in French  ' MOVIE_NAME = 'La+Tisseuse' TIME = '1267403869110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'The+Ghost+Writer' ID = '7a97b0605be3cbeb' LANG = '? Subtitled in French  ' MOVIE_NAME = 'The+Ghost+Writer' TIME = '1267405729110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Valentine%27s+Day' ID = 'deff6a26c7d88caa' LANG = '? Dubbed in French  ' MOVIE_NAME = 'Valentine%27s+Day' TIME = '1267403449110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Daybreakers' ID = '4c61f5654cbaeb32' LANG = '? Dubbed in French  ' MOVIE_NAME = 'Daybreakers' TIME = '1267403989110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Avatar%2C+en+3D' ID = '839d078a7604b340' LANG = '? Dubbed in French  ' MOVIE_NAME = 'Avatar%2C+en+3D' TIME = '1267407649110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Le+signe+de+Zorro' ID = '8fdb8d69049237c7' LANG = ' Subtitled in French  ' MOVIE_NAME = 'Le+signe+de+Zorro'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'A+Serious+Man' ID = '55c636a53170bd7c' LANG = '? Subtitled in French  ' MOVIE_NAME = 'A+Serious+Man' TIME = '1267404349110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Mullewapp+-+Das+gro%C3%9Fe+Kinoabenteuer+der+Freunde' ID = 'dc5098f514899f32' LANG = '? Dubbed in French  ' MOVIE_NAME = '3+amis+m%C3%A8nent+l%27enqu%C3%AAte' TIME = '1267402669110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Invictus' ID = '68a48d281bc50dc4' LANG = '? Subtitled in French  ' MOVIE_NAME = 'Invictus' TIME = '1267405969110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Bright+Star' ID = '680bfb8ef3315cc1' LANG = '? Subtitled in French  ' MOVIE_NAME = 'Bright+Star' TIME = '1267405189110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Gainsbourg+-+vie+h%C3%A9ro%C3%AFque' ID = '556154b8069ffd79' LANG = '? ' MOVIE_NAME = 'Gainsbourg+-+vie+h%C3%A9ro%C3%AFque' TIME = '1267405849110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Edge+of+Darkness' ID = '85b26356e431c110' LANG = '? Dubbed in French  ' MOVIE_NAME = 'Hors+de+contr%C3%B4le' TIME = '1267404529110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Lettre+%C3%A0+la+prison' ID = 'f3b59908cf56a27b' LANG = '? ' MOVIE_NAME = 'Lettre+%C3%A0+la+prison' TIME = '1267402249110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Crazy+Heart' ID = '6384719ce0fa81bb' LANG = '? Subtitled in French  ' MOVIE_NAME = 'Crazy+Heart' TIME = '1267404709110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'La+Reine+des+pommes' ID = '5999e0f6f4593e45' LANG = '? ' MOVIE_NAME = 'La+Reine+des+pommes' TIME = '1267403089110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'An+Education' ID = 'aff5bdbc59db9d96' LANG = '? Subtitled in French  ' MOVIE_NAME = 'Une+%C3%A9ducation' TIME = '1267403749110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'La+Pivellina' ID = 'c4484c3fa0ee3a7d' LANG = '? Subtitled in French  ' MOVIE_NAME = 'La+Pivellina' TIME = '1267404049110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Coursier' ID = 'b561301a785e8b94' LANG = '? ' MOVIE_NAME = 'Coursier' TIME = '1267403749110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'From+Paris+with+Love' ID = 'e09e2880a245e847' LANG = '? Dubbed in French  ' MOVIE_NAME = 'From+Paris+with+Love' TIME = '1267403629110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Libert%C3%A9' ID = '47610957d2107abc' LANG = '? ' MOVIE_NAME = 'Libert%C3%A9' TIME = '1267404349110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Un+proph%C3%A8te' ID = '8e75ba30f4701a4e' LANG = '? ' MOVIE_NAME = 'Un+proph%C3%A8te' TIME = '1267407349110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Planet+51' ID = 'eb3bd0a2aa55840c' LANG = '? Dubbed in French  ' MOVIE_NAME = 'Plan%C3%A8te+51' TIME = '1267403449110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Une+ex%C3%A9cution+ordinaire' ID = 'af77e2d90585be91' LANG = '? ' MOVIE_NAME = 'Une+ex%C3%A9cution+ordinaire' TIME = '1267404349110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Harragas' ID = '3f2c7332807b8ec7' LANG = '? Subtitled in French  ' MOVIE_NAME = 'Harragas' TIME = '1267403749110'/>" +
"        <MOVIE ENGLISH_MOVIE_NAME = 'Loup' ID = '7bd8039a75a6c8c1' LANG = '? Dubbed in French  ' MOVIE_NAME = 'Loup' TIME = '1267404169110'/>" +
"    </MOVIE_LIST>" +
"    <THEATER_LIST>" +
"        <THEATER ID = 'ce0d93b3f6063441' PHONE_NUMBER = '0892687555' THEATER_NAME = 'Multiplexe+Gaumont+Nantes'>" +
"            <LOCALISATION CITY_NAME = 'Nantes' COUNTRY_CODE = 'FR' COUNTRY_NAME = 'France' DISTANCE = '699.0' DISTANCE_TIME = '152000' LATITUDE = '47.2129735' LONGITUDE = '-1.5580613' POSTAL_CODE = '44000' SEARCH_QUERY = '12%2Bplace%2Bdu%2BCommerce%2C%2B44000%2BNantes%2C%2BFrance'/>" +
"            <PROJECTION_LIST>" +
"                <MOVIE ID = '60ee7fe13ada70ca'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447549110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267455649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267462849110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'f4816c32aa5a70ea'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267470649110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '49f537e6afbe5674'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267468849110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'a7a95976434ba2db'>" +
"                    <PROJECTION TIME = '1267437649110'/>" +
"                    <PROJECTION TIME = '1267447549110'/>" +
"                    <PROJECTION TIME = '1267455049110'/>" +
"                    <PROJECTION TIME = '1267462849110'/>" +
"                    <PROJECTION TIME = '1267470649110'/>" +
"                    <PROJECTION TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'a184cf380a530bdb'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267469149110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '980e31baf8023278'>" +
"                    <PROJECTION TIME = '1267437649110'/>" +
"                    <PROJECTION TIME = '1267446649110'/>" +
"                    <PROJECTION TIME = '1267454749110'/>" +
"                    <PROJECTION TIME = '1267462849110'/>" +
"                    <PROJECTION TIME = '1267470949110'/>" +
"                    <PROJECTION TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'aff5bdbc59db9d96'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267470049110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '25590e5366c2cd57'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267447549110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267457749110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267468249110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478149110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'f7d01897bf978f7b'>" +
"                    <PROJECTION TIME = '1267437649110'/>" +
"                    <PROJECTION TIME = '1267448449110'/>" +
"                    <PROJECTION TIME = '1267455649110'/>" +
"                    <PROJECTION TIME = '1267462849110'/>" +
"                    <PROJECTION TIME = '1267470949110'/>" +
"                    <PROJECTION TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '9ef4d2336eff2a76'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'e124555dab1fc3c'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267455649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267462849110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '33b9bbbe9cb0ea17'>" +
"                    <PROJECTION TIME = '1267470649110'/>" +
"                    <PROJECTION TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '7a97b0605be3cbeb'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267468849110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'deff6a26c7d88caa'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267469149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '839d078a7604b340'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267435849110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447549110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267459249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267471849110'/>" +
"                </MOVIE>" +
"            </PROJECTION_LIST>" +
"        </THEATER>" +
"        <THEATER ID = 'ee20ee28380e64cb' PHONE_NUMBER = '0836657012' THEATER_NAME = 'Katorza'>" +
"            <LOCALISATION CITY_NAME = 'Nantes' COUNTRY_CODE = 'FR' COUNTRY_NAME = 'France' DISTANCE = '839.0' DISTANCE_TIME = '210000' LATITUDE = '47.21362' LONGITUDE = '-1.5624977' POSTAL_CODE = '44000' SEARCH_QUERY = '3%2Brue%2BCorneille%2C%2B44000%2BNantes%2C%2BFrance'/>" +
"            <PROJECTION_LIST>" +
"                <MOVIE ID = '25590e5366c2cd57'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267449049110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267459249110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267469449110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'f55fe69499963390'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267470049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'e124555dab1fc3c'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448749110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267455949110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267463149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267470349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267477549110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '331f0fe08d1d02e6'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267449049110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267459249110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267469449110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '41ee96f5b250fd2e'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267449349110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267456549110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267470949110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478149110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '346159f78e441697'>" +
"                    <PROJECTION TIME = '1267448449110'/>" +
"                    <PROJECTION TIME = '1267459249110'/>" +
"                    <PROJECTION TIME = '1267469449110'/>" +
"                    <PROJECTION TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '47610957d2107abc'>" +
"                    <PROJECTION TIME = '1267448449110'/>" +
"                    <PROJECTION TIME = '1267455949110'/>" +
"                    <PROJECTION TIME = '1267463449110'/>" +
"                    <PROJECTION TIME = '1267470949110'/>" +
"                    <PROJECTION TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '54a9eb9264f684db'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267449049110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267459249110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267469449110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '6384719ce0fa81bb'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267449049110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267459249110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267469449110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'c4484c3fa0ee3a7d'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267449049110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267459249110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267469449110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"            </PROJECTION_LIST>" +
"        </THEATER>" +
"        <THEATER ID = 'e6131c9a2c561e15' THEATER_NAME = 'Le+Cinematographe'>" +
"            <LOCALISATION CITY_NAME = 'Nantes' COUNTRY_CODE = 'FR' COUNTRY_NAME = 'France' DISTANCE = '610.0' DISTANCE_TIME = '192000' LATITUDE = '47.2167616' LONGITUDE = '-1.5514979' POSTAL_CODE = '44000' SEARCH_QUERY = '12bis%2Brue%2Bdes%2BCarmelites%2C%2B44000%2BNantes%2C%2BFrance'/>" +
"            <PROJECTION_LIST>" +
"                <MOVIE ID = 'd6e8fa0f4808103d'>" +
"                    <PROJECTION TIME = '1267464649110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'f3b59908cf56a27b'>" +
"                    <PROJECTION TIME = '1267473649110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '8fdb8d69049237c7'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267452049110'/>" +
"                </MOVIE>" +
"            </PROJECTION_LIST>" +
"        </THEATER>" +
"        <THEATER ID = '9b27598084a6c4b9' PHONE_NUMBER = '0836682288' THEATER_NAME = 'Path%C3%A9-Atlantis'>" +
"            <LOCALISATION CITY_NAME = 'Saint-Herblain' COUNTRY_CODE = 'FR' COUNTRY_NAME = 'France' DISTANCE = '7445.0' DISTANCE_TIME = '1045000' LATITUDE = '47.2225654' LONGITUDE = '-1.6261333' POSTAL_CODE = '44800' SEARCH_QUERY = 'All%C3%A9e%2BLa%2BP%C3%A9rouse%2C%2B44800%2BSaint-Herblain%2C%2BFrance'/>" +
"            <PROJECTION_LIST>" +
"                <MOVIE ID = '60ee7fe13ada70ca'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267455049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267462849110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '49f537e6afbe5674'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267468249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478149110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'a7a95976434ba2db'>" +
"                    <PROJECTION TIME = '1267437649110'/>" +
"                    <PROJECTION TIME = '1267447549110'/>" +
"                    <PROJECTION TIME = '1267455349110'/>" +
"                    <PROJECTION TIME = '1267462849110'/>" +
"                    <PROJECTION TIME = '1267470949110'/>" +
"                    <PROJECTION TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '68a48d281bc50dc4'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267436749110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267468249110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'a184cf380a530bdb'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267469149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '85b26356e431c110'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '980e31baf8023278'>" +
"                    <PROJECTION TIME = '1267454749110'/>" +
"                    <PROJECTION TIME = '1267462849110'/>" +
"                    <PROJECTION TIME = '1267470949110'/>" +
"                    <PROJECTION TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '25590e5366c2cd57'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267436749110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267457449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267467349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267477849110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'f7d01897bf978f7b'>" +
"                    <PROJECTION TIME = '1267437649110'/>" +
"                    <PROJECTION TIME = '1267447549110'/>" +
"                    <PROJECTION TIME = '1267455049110'/>" +
"                    <PROJECTION TIME = '1267462849110'/>" +
"                    <PROJECTION TIME = '1267470949110'/>" +
"                    <PROJECTION TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '9ef4d2336eff2a76'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'b561301a785e8b94'>" +
"                    <PROJECTION TIME = '1267455649110'/>" +
"                    <PROJECTION TIME = '1267462849110'/>" +
"                    <PROJECTION TIME = '1267470949110'/>" +
"                    <PROJECTION TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '33b9bbbe9cb0ea17'>" +
"                    <PROJECTION TIME = '1267469149110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'e09e2880a245e847'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267470949110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '7a97b0605be3cbeb'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267468849110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'deff6a26c7d88caa'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267468849110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '4c61f5654cbaeb32'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267446949110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267455049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267462849110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267470949110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '839d078a7604b340'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267436749110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267460149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267471849110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'eb3bd0a2aa55840c'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447249110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '7bd8039a75a6c8c1'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447849110'/>" +
"                </MOVIE>" +
"            </PROJECTION_LIST>" +
"        </THEATER>" +
"        <THEATER ID = '5c12ebad09d673dd' PHONE_NUMBER = '0240462529' THEATER_NAME = 'Le+Concorde'>" +
"            <LOCALISATION CITY_NAME = 'Nantes' COUNTRY_CODE = 'FR' COUNTRY_NAME = 'France' DISTANCE = '3605.0' DISTANCE_TIME = '559000' LATITUDE = '47.2111493' LONGITUDE = '-1.5866559' POSTAL_CODE = '44100' SEARCH_QUERY = '79%2Bbd%2Bde%2Bl%27Egalit%C3%A9%2C%2B44000%2BNantes%2C%2BFrance'/>" +
"            <PROJECTION_LIST>" +
"                <MOVIE ID = '60ee7fe13ada70ca'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267449049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267456249110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'f4816c32aa5a70ea'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267472749110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '68a48d281bc50dc4'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267472749110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'b60ab62073681d48'>" +
"                    <PROJECTION TIME = '1267448449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '680bfb8ef3315cc1'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267456249110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '556154b8069ffd79'>" +
"                    <PROJECTION TIME = '1267455649110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '5999e0f6f4593e45'>" +
"                    <PROJECTION TIME = '1267448449110'/>" +
"                    <PROJECTION TIME = '1267465849110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'c92c44f40e4dfcf'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267465549110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '8e75ba30f4701a4e'>" +
"                    <PROJECTION TIME = '1267454449110'/>" +
"                    <PROJECTION TIME = '1267471849110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'eb3bd0a2aa55840c'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '55c636a53170bd7c'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267472749110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '3f2c7332807b8ec7'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267465549110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'af77e2d90585be91'>" +
"                    <PROJECTION TIME = '1267465249110'/>" +
"                </MOVIE>" +
"            </PROJECTION_LIST>" +
"        </THEATER>" +
"        <THEATER ID = 'a2871b9300c86e37' THEATER_NAME = 'Cin%C3%A9ville'>" +
"            <LOCALISATION CITY_NAME = 'Saint-S%C3%A9bastien-sur-Loire' COUNTRY_CODE = 'FR' COUNTRY_NAME = 'France' DISTANCE = '10462.0' DISTANCE_TIME = '968000' LATITUDE = '47.1897826' LONGITUDE = '-1.4852521' POSTAL_CODE = '44230' SEARCH_QUERY = 'rue%2BMarie-Curie%2C%2B44230%2BSaint-S%C3%A9bastien-sur-Loire%2C%2BFrance'/>" +
"            <PROJECTION_LIST>" +
"                <MOVIE ID = '60ee7fe13ada70ca'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267455349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267462249110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '49f537e6afbe5674'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267469149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'a7a95976434ba2db'>" +
"                    <PROJECTION TIME = '1267437649110'/>" +
"                    <PROJECTION TIME = '1267448449110'/>" +
"                    <PROJECTION TIME = '1267463449110'/>" +
"                    <PROJECTION TIME = '1267470949110'/>" +
"                    <PROJECTION TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'dc5098f514899f32'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267455649110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '68a48d281bc50dc4'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267477249110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '85b26356e431c110'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447849110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '980e31baf8023278'>" +
"                    <PROJECTION TIME = '1267437649110'/>" +
"                    <PROJECTION TIME = '1267455949110'/>" +
"                    <PROJECTION TIME = '1267463449110'/>" +
"                    <PROJECTION TIME = '1267470949110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '25590e5366c2cd57'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267468249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267477849110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '9ef4d2336eff2a76'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267457449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'f7d01897bf978f7b'>" +
"                    <PROJECTION TIME = '1267447249110'/>" +
"                    <PROJECTION TIME = '1267459849110'/>" +
"                    <PROJECTION TIME = '1267466149110'/>" +
"                    <PROJECTION TIME = '1267472449110'/>" +
"                    <PROJECTION TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '33b9bbbe9cb0ea17'>" +
"                    <PROJECTION TIME = '1267456249110'/>" +
"                    <PROJECTION TIME = '1267470049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'deff6a26c7d88caa'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267469149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '4c61f5654cbaeb32'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267455949110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267463449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267470949110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '839d078a7604b340'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267449349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267461049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267473649110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'eb3bd0a2aa55840c'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267453549110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267463449110'/>" +
"                </MOVIE>" +
"            </PROJECTION_LIST>" +
"        </THEATER>" +
"        <THEATER ID = 'c8bd90b19611c0e0' PHONE_NUMBER = '0228009898' THEATER_NAME = 'Cin%C3%A9+P%C3%B4le+Sud'>" +
"            <LOCALISATION CITY_NAME = 'Basse-Goulaine' COUNTRY_CODE = 'FR' COUNTRY_NAME = 'France' DISTANCE = '9485.0' DISTANCE_TIME = '1173000' LATITUDE = '47.1858921' LONGITUDE = '-1.4604318' POSTAL_CODE = '44115' SEARCH_QUERY = 'route%2Bde%2BClisson%2C%2B44115%2BBasse-Goulaine%2C%2BFrance'/>" +
"            <PROJECTION_LIST>" +
"                <MOVIE ID = '60ee7fe13ada70ca'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267438249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267454149110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '49f537e6afbe5674'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267477249110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'a7a95976434ba2db'>" +
"                    <PROJECTION TIME = '1267449049110'/>" +
"                    <PROJECTION TIME = '1267456249110'/>" +
"                    <PROJECTION TIME = '1267462849110'/>" +
"                    <PROJECTION TIME = '1267471249110'/>" +
"                    <PROJECTION TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'a184cf380a530bdb'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437949110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267457149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267469749110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478149110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '980e31baf8023278'>" +
"                    <PROJECTION TIME = '1267455649110'/>" +
"                    <PROJECTION TIME = '1267463149110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '25590e5366c2cd57'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447549110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267457149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267467949110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267477249110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '9ef4d2336eff2a76'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437949110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'f7d01897bf978f7b'>" +
"                    <PROJECTION TIME = '1267455649110'/>" +
"                    <PROJECTION TIME = '1267471549110'/>" +
"                    <PROJECTION TIME = '1267478749110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'b561301a785e8b94'>" +
"                    <PROJECTION TIME = '1267437349110'/>" +
"                    <PROJECTION TIME = '1267462849110'/>" +
"                    <PROJECTION TIME = '1267470049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '33b9bbbe9cb0ea17'>" +
"                    <PROJECTION TIME = '1267461349110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'e09e2880a245e847'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478749110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '7a97b0605be3cbeb'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267457749110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267468549110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267477549110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'deff6a26c7d88caa'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267446949110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267468549110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '839d078a7604b340'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267436449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267449049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267461049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267473049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'eb3bd0a2aa55840c'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267438249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448149110'/>" +
"                </MOVIE>" +
"            </PROJECTION_LIST>" +
"        </THEATER>" +
"        <THEATER ID = '17f19254e0ca5805' PHONE_NUMBER = '0892700000' THEATER_NAME = 'UGC+Cin%C3%A9+Cit%C3%A9+Atlantis'>" +
"            <LOCALISATION CITY_NAME = 'Indre' COUNTRY_CODE = 'FR' COUNTRY_NAME = 'France' LATITUDE = '47.1999335' LONGITUDE = '-1.6768287' POSTAL_CODE = '44610' SEARCH_QUERY = 'place%2BJean-Bart%2C%2B44800%2BSaint-Herblain%2C%2BFrance'/>" +
"            <PROJECTION_LIST>" +
"                <MOVIE ID = '60ee7fe13ada70ca'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447549110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267455049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '49f537e6afbe5674'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267436749110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267447549110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267457149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267469149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'a184cf380a530bdb'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267448749110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267457749110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267470049110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '41ee96f5b250fd2e'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267436749110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267455649110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267471249110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '54a9eb9264f684db'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267437049110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267446049110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267454149110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267462249110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267470349110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '980e31baf8023278'>" +
"                    <PROJECTION TIME = '1267437949110'/>" +
"                    <PROJECTION TIME = '1267446349110'/>" +
"                    <PROJECTION TIME = '1267454449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'aff5bdbc59db9d96'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267448149110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267463449110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478749110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '25590e5366c2cd57'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267437049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437649110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267447249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267457449110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267458349110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267468249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267468849110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478149110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267478449110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'f7d01897bf978f7b'>" +
"                    <PROJECTION TIME = '1267438249110'/>" +
"                    <PROJECTION TIME = '1267447849110'/>" +
"                    <PROJECTION TIME = '1267454749110'/>" +
"                    <PROJECTION TIME = '1267461949110'/>" +
"                    <PROJECTION TIME = '1267470949110'/>" +
"                    <PROJECTION TIME = '1267477849110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'b561301a785e8b94'>" +
"                    <PROJECTION TIME = '1267462849110'/>" +
"                    <PROJECTION TIME = '1267470649110'/>" +
"                    <PROJECTION TIME = '1267478149110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '33b9bbbe9cb0ea17'>" +
"                    <PROJECTION TIME = '1267463149110'/>" +
"                    <PROJECTION TIME = '1267470649110'/>" +
"                    <PROJECTION TIME = '1267478149110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '7a97b0605be3cbeb'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267437349110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267447249110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267456849110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267469449110'/>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267478749110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'deff6a26c7d88caa'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267446649110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267456249110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267470049110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267479049110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = '8e75ba30f4701a4e'>" +
"                    <PROJECTION TIME = '1267456849110'/>" +
"                    <PROJECTION TIME = '1267467349110'/>" +
"                    <PROJECTION TIME = '1267477549110'/>" +
"                </MOVIE>" +
"                <MOVIE ID = 'eb3bd0a2aa55840c'>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267437349110'/>" +
"                    <PROJECTION LANG = 'VF' TIME = '1267448449110'/>" +
"                </MOVIE>" +
"            </PROJECTION_LIST>" +
"        </THEATER>" +
"        <THEATER ID = '24a7ace70c33ce67' PHONE_NUMBER = '0240841884' THEATER_NAME = 'Bonne-Garde'>" +
"            <LOCALISATION CITY_NAME = 'Nantes' COUNTRY_CODE = 'FR' COUNTRY_NAME = 'France' DISTANCE = '3425.0' DISTANCE_TIME = '658000' LATITUDE = '47.1951652' LONGITUDE = '-1.5382053' POSTAL_CODE = '44200' SEARCH_QUERY = '20%2Brue%2BFr%C3%A8re-Louis%2C%2B44000%2BNantes%2C%2BFrance'/>" +
"            <PROJECTION_LIST>" +
"                <MOVIE ID = '68a48d281bc50dc4'>" +
"                    <PROJECTION LANG = 'VO+st+Fr' TIME = '1267471849110'/>" +
"                </MOVIE>" +
"            </PROJECTION_LIST>" +
"        </THEATER>" +
"        <THEATER ID = 'eaf3651aa7734555' THEATER_NAME = 'Cin%C3%A9+Vaillant'>" +
"            <LOCALISATION CITY_NAME = 'Vertou' COUNTRY_CODE = 'FR' COUNTRY_NAME = 'France' DISTANCE = '12455.0' DISTANCE_TIME = '1313000' LATITUDE = '47.1670886' LONGITUDE = '-1.4687191' POSTAL_CODE = '44120' SEARCH_QUERY = '12%2Brue%2Bdu%2Bg%C3%A9n%C3%A9ral%2Bde%2BGaulle%2C%2B44120%2BVertou%2C%2BFrance'/>" +
"            <PROJECTION_LIST>" +
"                <MOVIE ID = '980e31baf8023278'>" +
"                    <PROJECTION TIME = '1267470049110'/>" +
"                </MOVIE>" +
"            </PROJECTION_LIST>" +
"        </THEATER>" +
"    </THEATER_LIST>" +
"</NEAR_RESP>";

ResultatAssistant.prototype.resultsMovie = ""+
"<NEAR_RESP CITY_NAME='Nantes%2C+fr' MORE_RESULTS='false'><MOVIE_LIST/><THEATER_LIST/></NEAR_RESP>";
//ResultatAssistant.prototype.resultsMovie = ""+
//"<MOVIE_RESP CITY_NAME='Tours%2C+FR' MORE_RESULTS='false'>"+
//"	<MOVIE ENGLISH_MOVIE_NAME='Avatar%2C+en+3D' ID='839d078a7604b340' MOVIE_NAME='Avatar%2C+en+3D' TIME='1269135651011'/>"+
//"	<THEATER_LIST>"+
//"		<THEATER ID='3c5cde5e0793f309' THEATER_NAME='M%C3%A9ga+CGR+Centre'>"+
//"			<LOCALISATION CITY_NAME='Tours' COUNTRY_CODE='FR' COUNTRY_NAME='France' LATITUDE='47.3832745' LONGITUDE='0.6897966' POSTAL_CODE='37000' SEARCH_QUERY='Place%2BFran%C3%A7ois%2BTruffaut%2C%2B37000%2BTours%2C%2BFrance'/>"+
//"			<PROJECTION_LIST>"+
//"				<MOVIE ID='839d078a7604b340'>"+
//"					<PROJECTION LANG='VF' TIME='1269165351011'/>"+
//"					<PROJECTION LANG='VF' TIME='1269175251011'/>"+
//"					<PROJECTION LANG='VF' TIME='1269186351011'/>"+
//"					<PROJECTION LANG='VF' TIME='1269196251011'/>"+
//"				</MOVIE>"+
//"			</PROJECTION_LIST>"+
//"		</THEATER>"+
//"		<THEATER ID='4b71b8f3804c10b5' THEATER_NAME='Mega+CGR+2+Lions'>"+
//"			<LOCALISATION CITY_NAME='Tours' COUNTRY_CODE='FR' COUNTRY_NAME='France' DISTANCE='4399.0' DISTANCE_TIME='535000' LATITUDE='47.3655892' LONGITUDE='0.6795531' POSTAL_CODE='37200' SEARCH_QUERY='avenue%2BMarcel%2BM%C3%A9rieux%2C%2B37000%2BTours%2C%2BFrance'/>"+
//"			<PROJECTION_LIST>"+
//"				<MOVIE ID='839d078a7604b340'>"+
//"					<PROJECTION LANG='VF' TIME='1269164751011'/>"+
//"					<PROJECTION LANG='VF' TIME='1269165651011'/>"+
//"					<PROJECTION LANG='VF' TIME='1269174651011'/>"+
//"					<PROJECTION LANG='VF' TIME='1269175551011'/>"+
//"					<PROJECTION LANG='VF' TIME='1269185451011'/>"+
//"					<PROJECTION LANG='VF' TIME='1269196251011'/>"+
//"					<PROJECTION LANG='VF' TIME='1269197151011'/>"+
//"				</MOVIE>"+
//"			</PROJECTION_LIST>"+
//"		</THEATER>"+
//"	</THEATER_LIST>"+
//"</MOVIE_RESP>";