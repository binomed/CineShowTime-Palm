function FilmAssistant(argFromPusher) {
	this.theater = argFromPusher.theater;
	this.movie = argFromPusher.movie;
	this.requestBean = argFromPusher.request;
	this.locale = argFromPusher.locale;
	this.theaterRequest = argFromPusher.theaterRequest;
	this.preferences = argFromPusher.preferences;
		
	this.dbHelper = argFromPusher.dbHelper;
	this.cst = argFromPusher.cst;
	
	this.acctid;
	this.clndrid;
	this.evntid;
	
	this.showtimeList = null;
	this.stList = [];
	
	this.ratingList = [];
	
	this.selectedIndex = null;
	this.dbHelper.completeMovie(this.callBackCompleteMovie.bind(this), this.movie);
	
	this.debug = this.cst.BLN_DEBUG;
	
	this.requestLocation= null;
	this.theaterLocation= null;
	
	this.enPlot = true;
	
	console.log('FilmAssistant : '+this.movie.movieTime+', id : '+this.movie.id);
	
}

FilmAssistant.prototype.setup = function() {

	this.listSTAttributes = {
		itemTemplate:'film/film-seance-item', 
		listTemplate:'film/film-seance-container'
	};
	
	this.listSTModel = {
		listTitle:$L("Résultats"), 
		items:this.stList
	};
	
	this.spinnerModel = {spinning: false};
	this.controller.setupWidget("progressSpinnerFilm",this.attributes = {spinnerSize: 'large'},this.spinnerModel);
	
	this.controller.setupWidget("scroller_tab",
        this.attributes = {
            mode: 'horizontal-snap'
        },
        this.model = {
            snapElements: {
                x: [$('movieContainer'), $('showtimesContainer'), $('rateContainer')]
            }
        }
    ); 
	
	this.controller.setupWidget("rateScroll", {mode: 'vertical'}, {}); 
	this.controller.setupWidget("stScroll", {mode: 'vertical'}, {}); 
	this.controller.setupWidget("movieScroll", {mode: 'vertical'}, {}); 
	
	//this.controller.setupWidget("rateScroll", {mode: 'vertical'}, {}); 
	
	this.controller.listen("scroller_tab", Mojo.Event.propertyChange, this.updateTab.bind(this));
	
	$('rateScroll').style.height = (Mojo.Environment.DeviceInfo.screenHeight - 125) + "px";
	$('stScroll').style.height = (Mojo.Environment.DeviceInfo.screenHeight - 125) + "px";
	$('movieScroll').style.height = (Mojo.Environment.DeviceInfo.screenHeight - 125) + "px";
	
	$('myScrimFilm').show();
	$('loadingTextFilm').innerHTML = $L("searchNearProgressMsg");
	this.spinnerModel.spinning = true;
	this.controller.modelChanged(this.spinnerModel);
	
	var content = Mojo.View.render({object: {id:"",title:$L("plot")}, template: 'title-template'});
	$("titleResume").innerHTML = content;
			
	content = Mojo.View.render({object: {movieLabel:$L("movieLabel"),showtimeLabel:$L("showtimeLabel"),rateLabel:$L("rateLabel")}, template: 'film/tab-template'});
	$('switchDisplay').innerHTML = content;
	
	this.controller.setupWidget('listShowtimes', this.listSTAttributes, this.listSTModel);
	
	Mojo.Event.listen(this.controller.get('radioFilm'),Mojo.Event.tap,this.selectRadioFilm.bind(this));
	Mojo.Event.listen(this.controller.get('radioSeances'),Mojo.Event.tap,this.selectRadioSeances.bind(this));
	Mojo.Event.listen(this.controller.get('radioCritiques'),Mojo.Event.tap,this.selectRadioCritiques.bind(this));
	
	this.appController = Mojo.Controller.getAppController();
		
	
	/*$('showtimesContainer').hide();
	$('rateContainer').hide();*/
	
	// Define the menu of film Card
	var menuItems = getDefaultMenu(this);
	menuItems.push({ label: $L('menuCall'), command: this.cst.KEY_MENU_CALL });
	menuItems.push({ label: $L('openYoutubeMenuItem'), command: this.cst.KEY_MENU_TRAILER });
	if (this.theater.place != null){
		menuItems.push({ label: $L('openMapsMenuItem'), command: this.cst.KEY_MENU_MAP_THEATER });
	}
	if (this.requestBean.latitude != null && this.requestBean.longitude != null){
		menuItems.push({ label: $L('openMapsDriveMenuItem'), command: this.cst.KEY_MENU_DRIVE_THEATER });
	}
	this.appMenuModel = {
		visible: true,
		items: menuItems
	};

	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
}

FilmAssistant.prototype.handleCommand = function (event) {
	this.controller=Mojo.Controller.stageController.activeScene();
	var func;
	
    if(event.type == Mojo.Event.command) {	
    	if (!manageDefaultMenu(this, event)){
			switch (event.command) {
				case this.cst.KEY_MENU_CALL:
					func = this.callTheater.bind(this);
					func();
					break;
				case this.cst.KEY_MENU_TRAILER:
					func = this.getTrailer.bind(this);
					func();
					break;
				case this.cst.KEY_MENU_MAP_THEATER:
					func = this.mapTheater.bind(this);
					func();
					break;
				case this.cst.KEY_MENU_DRIVE_THEATER:
					func = this.directionsTheater.bind(this);
					func();
					break;
				case this.cst.KEY_MENU_TRANSLATE:
					func = this.translatePlot.bind(this);
					func();
					break;
			}
    	}
	}
}

FilmAssistant.prototype.getTrailer = function() {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
						method: "open",
						parameters: {
							id: 'com.palm.app.browser',
							params: {
								scene: 'page',
								target: 'http://m.youtube.com/results?q='+this.getMovieTitle(this.movie)+' trailer'
							}
						}
					});	

	/*
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
	   method: 'launch',
	   parameters: {
		  id:"com.palm.app.youtube",
		  params:{"query":this.getMovieTitle(this.movie)+' trailer'}
	   }
	}); 
	*/
}

FilmAssistant.prototype.callTheater = function() {

	this.controller.serviceRequest("palm://com.palm.applicationManager", {
		 method : 'open',
		 parameters: {
			target: "tel://" + this.theater.phoneNumber
			
		}
	});
}

FilmAssistant.prototype.mapTheater = function() {
	var parameters = null;
	if (this.theater.place.latitude != null && this.theater.place.longitude != null){
		parameters = {
			location:{lat:this.theater.place.latitude, lng: this.theater.place.longitude},
			query: this.theater.theaterName
		
		};
	}else{
		parameters = {query:decode(this.theater.place.searchQuery)+" ("+this.theater.theaterName+")"};
	}
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
		method: 'launch',
		parameters: {
			id:"com.palm.app.maps",
			params:parameters
		}
	});
}

FilmAssistant.prototype.directionsTheater = function() {
	this.requestLocation = null;
	this.theaterLocation = null;
	$('theater_directions').addClassName('maps_button_disabled');
	Mojo.Event.stopListening(this.controller.get('theater_directions'),Mojo.Event.tap,this.directionsTheater.bind(this));
	this.controller.serviceRequest('palm://com.palm.location', {
		method : 'getReverseLocation',
		parameters: {
			latitude: this.requestBean.latitude,
			longitude: this.requestBean.longitude
				},
		onSuccess: this.callBackReverseGPS.bind(this),
		onFailure: this.handleServiceResponseError.bind(this)
	});
}

FilmAssistant.prototype.callBackReverseGPS = function(event) {
	console.log("FilmAssistant.callBackReverseGPS : address : "+event.address);
	this.requestLocation =event.address;
	// on récupère maintenant l'adresse du cinéma
	this.controller.serviceRequest('palm://com.palm.location', {
		method : 'getReverseLocation',
        parameters: {
			latitude: this.theater.place.latitude,
            longitude: this.theater.place.longitude
                },
        onSuccess: this.callBackReverseGPSTheater.bind(this),
        onFailure: this.handleServiceResponseError.bind(this)
    });
};

FilmAssistant.prototype.callBackReverseGPSTheater = function(event) {
	console.log("FilmAssistant.callBackReverseGPSTheater : address : "+event.address);
	this.theaterLocation =event.address;
	$('theater_directions').removeClassName('maps_button_disabled');
	Mojo.Event.listen(this.controller.get('theater_directions'),Mojo.Event.tap,this.directionsTheater.bind(this));
	// on lance le service maps en mode direction
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
		method: 'launch',
		parameters: {
		id:"com.palm.app.maps",
		params:{saddr:encode(this.requestLocation)
		,daddr:encode(this.theaterLocation) }
	}
	});
};

FilmAssistant.prototype.handleServiceResponseError = function(event) {
	// Gestion d'une erreur dans la location gps
	$('theater_directions').removeClassName('maps_button_disabled');
	Mojo.Event.listen(this.controller.get('theater_directions'),Mojo.Event.tap,this.directionsTheater.bind(this));
	manageEventCode(this.controller,event.errorCode);
}

FilmAssistant.prototype.display = function() {
	
	var linkFct = this.getLinks.bind(this);
	
	console.log('FilmAssistant.display : movieTime : '+this.movie.movieTime);
	
	console.log('FilmAssistant.display : imdbDesc : '+this.movie.imdbDesrciption);
	if (this.movie.imdbDescription){
		this.appMenuModel.items.push({ label: $L('menuTranslate'), command: this.cst.KEY_MENU_TRANSLATE });
		if (this.preferences.getPrefValue(this.preferences.KEY_PREF_LANG_AUTO)){
			this.translatePlot();
		}
	}
	
	if (this.movie.urlImg != null && this.movie.urlImg != "") {
		$('movieImg').src = decode(this.movie.urlImg);
	}
	
	if (this.movie.description != null && this.movie.description != "") {
		$("resume").innerHTML = decode(this.movie.description);
	} else {
		$("resume").innerHTML = $L("noSummary");
	}
	
	var movie = [{key:$L("txtTitle"), value:this.getMovieTitle(this.movie)}];
	
	if(this.movie.movieTime != null) {
		movie.push({key:$L("txtDuration"), value:getDurationByDate(this.movie.movieTime)});
	}
	
	if(this.movie.directorList != null) {
		movie.push({key:$L("txtDirector"), value:getFirstEntities(this.movie.directorList, 3)});
	}
	
	if(this.movie.actorList != null) {
		movie.push({key:$L("txtActor"), value:getFirstEntities(this.movie.actorList, 3)});
	}
	
	if(this.movie.style != null) {
		movie.push({key:$L("txtGenre"), value:getFirstEntities(this.movie.style, 99)});
	}
	
	if(this.movie.rate != null && this.movie.rate != "") {
		movie.push({key:$L("txtRate"), value:displayStars(this.movie.rate,10) + " (" + this.movie.rate + "/10)"});
	}
	
	var links = linkFct();	
	if(links != "") {
		movie.push({key:$L(""), value:links});
	}
	     	
 	this.showtimeList = [];
 	this.controller.modelChanged(this.listModel, this);
 	
 	this.findShowtimes(this.movie.id);
	this.controller.modelChanged(this.listSTModel, this);
 	
 	var content = Mojo.View.render({collection: movie, template: 'film/info-template'});
    $("movieDesc").innerHTML = content;
	
	content = "";
	var dspRat = this.displayRatings.bind(this);
	content = dspRat();
	
	if(content != "") {
		$('rateContenu').innerHTML = content;
	} else {
		$('rateContenu').innerHTML = $L("<div class='no_review'>#{msg}</div>").interpolate({msg:$L("noReview")});
	}
	
	$('theaterNameBold').innerHTML = decode(this.theater.theaterName);
	$('theaterAddress').innerHTML = decode(this.theater.place.searchQuery);
	
	Mojo.Event.listen(this.controller.get('theater_call'),Mojo.Event.tap,this.callTheater.bind(this));
	Mojo.Event.listen(this.controller.get('theater_worldmap'),Mojo.Event.tap,this.mapTheater.bind(this));
	
	if (this.requestBean.latitude != null && this.requestBean.longitude != null){
		Mojo.Event.listen(this.controller.get('theater_directions'),Mojo.Event.tap,this.directionsTheater.bind(this));
	} else {
		$('theater_directions').addClassName('maps_button_disabled');
	}
	
	if(this.theaterRequest) {
		var tmpFct = this.selectRadioSeances.bind(this);
	} else {
		var tmpFct = this.selectRadioFilm.bind(this);
	}
	
	tmpFct(null);	
	
	$('myScrimFilm').hide();
	this.spinnerModel.spinning = false;
	this.controller.modelChanged(this.spinnerModel);	
	
}

FilmAssistant.prototype.getMovieTitle = function(movie) {
	if(movie.movieName != null && movie.movieName != "") {
		return decode(movie.movieName);
	} else {
		return decode(movie.englishMovieName);
	}
}

FilmAssistant.prototype.getLinks = function() {
	var link = "";
	
	if(this.movie.urlImdb != null && this.movie.urlImdb != "") {
		link = link + '<a href="'+decode(this.movie.urlImdb)+'">IMDB</a>';
	}
	
	if(this.movie.urlWikipedia != null && this.movie.urlWikipedia != "") {
		if(link != "") {
			link = link + ", ";
		}
		
		link = link + '<a href="'+decode(this.movie.urlWikipedia)+'">Wikipedia</a>';
	}
	
	return link;
}

FilmAssistant.prototype.displayRatings = function(){
	var review = null;
	var stringStars = "";
	var rate;
	var nbStars;
	var stringAuthor;
	
	console.log('FilmAssistant.displayRatings : number of reviews : ' + this.movie.reviews.length);
	for (var i = 0; i < this.movie.reviews.length; i++) {
		
		stringStars = "";
		stringAuthor = "";
		rate = this.movie.reviews[i].rate;
		nbStars = 0;
		
		console.log('FilmAssistant.displayRatings : review ' + i + ' : ' + this.movie.reviews[i].rate);
			
		if(this.movie.reviews[i].author != null && this.movie.reviews[i].author != "") {
			stringAuthor = this.movie.reviews[i].author;
		} else {
			stringAuthor = $L("unknownSource");
		}
	
		review = {
			rate:displayStars(rate, 5),
			author:decode(stringAuthor),
			urlReview:this.movie.reviews[i].urlReview,
			readMore:$L('readMore'),
			source:decode(this.movie.reviews[i].source),
			text:decode(this.movie.reviews[i].text)
		};
		
		console.log('FilmAssistant.displayRatings : reviewtemp : ' + review.author);
		this.ratingList.push(review);
		console.log('FilmAssistant.displayRatings : number of reviews pushed : ' + this.ratingList.length);
	}
	
	console.log('FilmAssistant.displayRatings : number of reviews pushed : ' + this.ratingList.length);
	return Mojo.View.render({collection: this.ratingList, template: 'film/rating-template'});
	
}

FilmAssistant.prototype.showMenuSend = function(event) {
	var near = event.target;
	
	this.selectedIndex = event.target.readAttribute("number");
	
	console.log('FilmAssistant.showMenuSend : event : ' + event.target.readAttribute("number"));
	console.log('FilmAssistant.showMenuSend : before popupSubmenu : ');
	var menuItems = [
	     			{label: $L('menuAddEvent'), command: 'cal', iconPath:'images/calendar-32x32.png'},
	    			{label: $L('menuSms'), command: 'sms', iconPath:'images/sms-32x32.png'}, 
	    			{label: $L('menuMail'), command: 'mail', iconPath:'images/envelope-closed-32x32.png'}
	    			];
	var projection = this.showtimeList[this.selectedIndex];
	
	if (projection.reservationLink != null && projection.reservationLink != ""){
		menuItems.push({label: $L('menuReservation'), command: 'reservation', iconPath:'images/ticket_2-32x32.png'});
	}
	this.controller.popupSubmenu({onChoose:this.popupChoose
		, placeNear:near 
		,items: menuItems 
		});
}

FilmAssistant.prototype.getDays = function(indice) {
	
	if(indice == null) { indice = 0; }
	
	console.log("FilmAssistant.getDays : Indice : j+" + indice);
	
	var today = new Date();
	var todayWeek = today.getDay();
	
	var indiceCours = parseInt(indice);
	var indiceTab;
	
	if (parseInt(indiceCours) == 0) {
		return $L("spinnerToday");
	} else {
		if(parseInt(indiceCours) == 1) {
			return $L("spinnerTomorow");
		} else {
			indiceTab = (indiceCours+todayWeek)%weekTab.length;
			return $L(weekTab[indiceTab]);
		}
	}
};

FilmAssistant.prototype.popupChoose = function(value, event) {
	
	var dataToSend = {
		movie:decode(this.getMovieTitle(this.movie)),
		time:getTimeByDate(this.showtimeList[this.selectedIndex].showtime),
		theater:decode(this.theater.theaterName),
		day:this.getDays(this.requestBean.day)
	}

	if(value == 'cal') { 
		this.controller.serviceRequest('palm://com.palm.accounts/crud', {
			method: 'listAccounts',
			onSuccess: this.setAccount.bind(this),
			onFailure: this.handleErrResponse.bind(this)
		}); 
	}

	if(value == 'sms') {
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
		 method: 'launch',
		 parameters: {
			 id: 'com.palm.app.messaging',
			 params: {messageText: $L('smsContent').interpolate(dataToSend)}
		 },
		 onSuccess: this.handleOKResponse,
		 onFailure: this.handleErrResponse
	 });
	}
	
	if(value == 'mail') {
		this.controller.serviceRequest( 'palm://com.palm.applicationManager', {
				method: 'open',
				parameters: {
					id: 'com.palm.app.email',
					params: {
						summary: $L('mailSubject').interpolate(dataToSend),
						text: $L('mailContent').interpolate(dataToSend)
					}
				} }); 
	}
	if(value == 'reservation') {
		//var urlReservation = "http://www.google.com/url?q="+this.showtimeList[this.selectedIndex].reservationLink;
		var urlReservation = this.showtimeList[this.selectedIndex].reservationLink;
		this.controller.serviceRequest("palm://com.palm.applicationManager", {
			method: "open",
			parameters: {
				id: 'com.palm.app.browser',
				params: {
					scene: 'page',
					target: urlReservation
				}
			}
		});	
	}
}

FilmAssistant.prototype.updateTab = function(event) {
	// console.log('%%%%%%%%%%%%%%%%% propertyChanged ' + event.value); 
	$("radioFilm").removeClassName("tab_selected");
	$("radioSeances").removeClassName("tab_selected");
	$("radioCritiques").removeClassName("tab_selected");
	
	if(event.value == 0) {
		$("radioFilm").addClassName("tab_selected");
	}
	
	if(event.value == 1) {
		$("radioSeances").addClassName("tab_selected");
		
		for (var j = 0; j < this.showtimeList.length; j++) {
			Mojo.Event.listen(this.controller.get("menuSend"+j),Mojo.Event.tap,this.showMenuSend.bind(this));
		}
	}
	
	if(event.value == 2) {
		$("radioCritiques").addClassName("tab_selected");
	}	
	
}

FilmAssistant.prototype.selectRadioFilm = function(event) {
	$("radioFilm").addClassName("tab_selected");
	$("radioSeances").removeClassName("tab_selected");
	$("radioCritiques").removeClassName("tab_selected");
	
	this.controller.get("scroller_tab").mojo.setSnapIndex(0, true);
	
	/*$('movieContainer').show();
	$('showtimesContainer').hide();
	$('rateContainer').hide();*/
}

FilmAssistant.prototype.selectRadioSeances = function(event) {
	$("radioFilm").removeClassName("tab_selected");
	$("radioSeances").addClassName("tab_selected");
	$("radioCritiques").removeClassName("tab_selected");
			
	/*$('movieContainer').hide();
	$('showtimesContainer').show();
	$('rateContainer').hide();*/
	
	this.controller.get("scroller_tab").mojo.setSnapIndex(1, true);
	
	for (var j = 0; j < this.showtimeList.length; j++) {
		Mojo.Event.listen(this.controller.get("menuSend"+j),Mojo.Event.tap,this.showMenuSend.bind(this));
	}

}

FilmAssistant.prototype.selectRadioCritiques = function(event) {
	$("radioFilm").removeClassName("tab_selected");
	$("radioSeances").removeClassName("tab_selected");
	$("radioCritiques").addClassName("tab_selected");
	
	this.controller.get("scroller_tab").mojo.setSnapIndex(2, true);
	
	/*$('movieContainer').hide();
	$('showtimesContainer').hide();
	$('rateContainer').show();*/
}

FilmAssistant.prototype.findShowtimes = function(movieId) {
	console.log('FilmAssistant.findShowtimes : search : ' + movieId + ', movieMap length : ' + this.theater.movieMap.length);
	
	for (var k = 0; k < this.theater.movieMap.length; k++) {
		if (this.theater.movieMap[k].id == movieId){
			this.showtimeList = this.theater.movieMap[k].data;
			break;
		}
	}
	
	var projection;
	var dateSeance = new Date();
	var dateSeanceWithDist = new Date();
	var dateJour = new Date();
	var classe = "";
	var nextShowtime = false;
	var timeFormat = this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_FORMAT);
	var distanceAvailable = this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_DIRECTION);
	var distanceTime = null;
	if (distanceAvailable && this.theater.place != null && this.theater.place.distanceTime != null){
		distanceTime = this.theater.place.distanceTime;
	}else{
		distanceTime = null;
	}
	
	if (distanceTime == null || isNan(distanceTime) ){
		distanceTime = 0;
	}
	
	for (var j = 0; j < this.showtimeList.length; j++) {
		console.log('FilmAssistant.findShowtimes : projection : ' + this.showtimeList[j].showtime);;
		
		if(this.movie.movieTime != null && this.movie.movieTime != "") {
			var endTime = getEndTimeStamp(parseInt(this.showtimeList[j].showtime), parseInt(this.movie.movieTime), parseInt(minutesToMs(this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_ADDS))));			
		}
		
		var langShow = decode(this.showtimeList[j].lang);
		
		if(langShow != null && langShow != "") {
			langShow = langShow + " : ";
		} else {
			langShow = "";
		}
		
		classe = "";
		dateSeance.setTime(this.showtimeList[j].showtime);
		
		dateSeanceWithDist.setTime(parseInt(this.showtimeList[j].showtime) + parseInt(distanceTime));
		
		if (dateSeanceWithDist.getTime() < dateJour.getTime()) {
			classe = "past_showtime";
		} else {
			if(!nextShowtime) {
				classe = "next_showtime_film";
				nextShowtime = true;
			} else {
				classe = "future_showtime_film";
			}
		}
		
		projection = {
			id:j,
			lang:langShow, 
			start:decode(getTimeByDate(this.showtimeList[j].showtime, timeFormat)), 
			end:decode(getEndTimeByDate(endTime, timeFormat)),
			stclass: classe
		};
		
		this.stList.push(projection);
	}
}

FilmAssistant.prototype.addEvent = function() {
	
	var date = new Date();
	date.setTime(this.showtimeList[this.selectedIndex].showtime);
	
	this.event = {
			"calendarId": this.clndrid,
			"subject": decode(this.getMovieTitle(this.movie)),
            "startTimestamp": this.showtimeList[this.selectedIndex].showtime,
            "endTimestamp": getEndTimeStamp(parseInt(this.showtimeList[this.selectedIndex].showtime), parseInt(this.movie.movieTime), minutesToMs(this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_ADDS))),
            "allDay": "false",
            "note": "",
            "location": decode(this.theater.theaterName) + ", " + decode(this.theater.place.cityName),
            "attendees": [],
            "alarm": "none"
        };

	this.controller.serviceRequest('palm://com.palm.calendar/crud', {
		method: 'createEvent',
		parameters: {
			"calendarId": this.event.calendarId,
			"event": this.event
			},
		onSuccess: this.handleAddResponse.bind(this),
		onFailure: this.handleErrResponse.bind(this)
		})
}



FilmAssistant.prototype.parsingXml = function(xmlResult) {
	console.log('FilmAssistant.parsingXml : movieTime : '+this.movie.movieTime);
	
	
	var movie = new MovieBean();
	
	
	var tagMovie = xmlResult.getElementsByTagName("MOVIE")[0];
	var tagDesc = tagMovie.getElementsByTagName("DESC")[0];
	
	movie.id = this.movie.id;
	movie.imdbId = tagMovie.getAttribute("IMDB_ID");
	movie.movieName = this.movie.movieName;
	movie.englishMovieName = this.movie.englishMovieName;
	movie.movieTime = this.movie.movieTime;
	movie.actorList = tagMovie.getAttribute("ACTORS");
	movie.directorList = tagMovie.getAttribute("DIRECTORS");
	movie.rate = tagMovie.getAttribute("RATE");
	movie.style = tagMovie.getAttribute("STYLE");
	movie.urlImg = tagMovie.getAttribute("URL_IMG");
	movie.urlWikipedia = tagMovie.getAttribute("URL_WIKIPEDIA");
	movie.urlImdb = tagMovie.getAttribute("URL_IMDB");
	
  if	(tagDesc != null) {
    movie.imdbDesrciption = tagDesc.getAttribute("IMDB_DESC");
  	if (tagDesc.firstChild != null){
  		movie.description = tagDesc.firstChild.nodeValue;
  	}
	}
	
	var tagReview = null;
	var reviewList = [];
	var review = null;
	for (var k = 0; k < tagMovie.getElementsByTagName("REVIEW").length; k++) {
		tagReview = tagMovie.getElementsByTagName("REVIEW")[k];
		review = new ReviewBean();
		review.movieId = movie.id;
		review.author = tagReview.getAttribute("AUTHOR"); 
		review.source = tagReview.getAttribute("SOURCE"); 
		review.urlReview = tagReview.getAttribute("URL_REVIEW"); 
		review.rate = tagReview.getAttribute("RATE");
		if (tagReview.firstChild != null){
			review.text = tagReview.firstChild.nodeValue; 
		}
		reviewList.push(review);
	}
	movie.reviews = reviewList;
	
	return movie;
}

FilmAssistant.prototype.loadResults = function(xmlResult) {
	
	try {
		this.movie = this.parsingXml(xmlResult);
		this.display();
	} catch(e) {
		console.log('FilmAssistant.loadResults : Error : '+e.message);
	}
	
	// We insert into data base datas.
	this.dbHelper.insertMovie(this.movie);
}

FilmAssistant.prototype.launchRequest = function() {
	
	console.log('FilmAssistant.launchRequest : ');
	
	var place = encode(this.requestBean.cityName);
	var enName = encode(this.movie.englishMovieName);
	var name = encode(this.movie.movieName);
	var url = this.cst.URL_SERVER+'imdb?output=xml&oe=UTF-8&place='+place+'&mid='+this.movie.id+'&moviecurlangname='+name+'&moviename='+enName+'&ie=UTF-8&lang='+this.locale;
	
	console.log('FilmAssistant.launchRequest : url : ' + url);
	
	var request = new Ajax.Request(url, {
		method: 'get',
		onSuccess: this.gotResults.bind(this),
		onFailure: this.failure.bind(this)
	});
	
}

FilmAssistant.prototype.gotResults = function(transport) {
	
	console.log('FilmAssistant.gotResults : ');
	var xmlstring = transport.responseText;	

	// Convert the string to an XML object
	var xmlResult = (new DOMParser()).parseFromString(xmlstring, "text/xml");
	// console.log('FilmAssistant.gotResults : XML : '+ xmlstring);
	
	this.loadResults(xmlResult);
}

FilmAssistant.prototype.resultsDebug = function () {
	var xmlResult = (new DOMParser()).parseFromString(this.results, "text/xml");
	this.loadResults(xmlResult);	
};

FilmAssistant.prototype.failure = function(transport) {
	/* Cette fonction est appelée par l'objet AJAX lors de l'instruction onFailure 
	  elle est appelée  lorsque la requête a retourné une erreur */
	if(timeOut) {
		this.controller.showAlertDialog({
			onChoose: function(value) { timeOut = false; Mojo.Controller.stageController.popScene('film'); },
			title: $L("Error"),
			message: $L("msgErrorNoNetwork"),
			choices:[{label: $L('OK'), value:'OK', type:'color'}]
		});	  
	} else {
		this.controller.showAlertDialog({
			onChoose: function(value) { Mojo.Controller.stageController.popScene('film'); },
			title: $L("Error"),
			message: $L("msgErrorOnServer"),
			choices:[{label: $L('OK'), value:'OK', type:'color'}]
		});	  
	}  
}

FilmAssistant.prototype.stList = [];
FilmAssistant.prototype.listShowtimes = [];

FilmAssistant.prototype.account = {
	"username":'CineShowTime',
	"domain":'binomed',
	"displayName":'CineShowTime',
	"icons":{'largeIcon:string': 'smallIcon:string'},
	"dataTypes":['Calendar'],
	"isDataReadOnly":false
};

FilmAssistant.prototype.setAccount = function(response){
	/* If an account exists, then see if a calendar exists for the account and
	   if so, get the calendar id. If not, tell the user to create an account. */
	if (typeof response.list[0] != "undefined") {
		this.acctid = response.list[0].accountId;
		this.controller.serviceRequest('palm://com.palm.calendar/crud', {
			method: 'listCalendars',
			parameters: {
				"accountId": this.acctid
			},
			onSuccess: this.handleSetAccountResponse.bind(this),
			onFailure: this.handleErrResponse.bind(this)
		})
	} else {
		this.controller.serviceRequest('palm://com.palm.accounts/crud', {
			method: 'createAccount',
			parameters: this.account,
			onSuccess: this.handleCreateAccountResponse.bind(this),
			onFailure: this.handleErrResponse.bind(this)
		});
	}															 
}

FilmAssistant.prototype.handleCreateAccountResponse = function(response) {
	this.controller.serviceRequest('palm://com.palm.accounts/crud', {
			method: 'listAccounts',
			onSuccess: this.setAccount.bind(this),
			onFailure: this.handleErrResponse.bind(this)
		});
}

FilmAssistant.prototype.handleSetAccountResponse = function(response){
	/* If a calendar exists, then see if any events exist in the calendar and
	   if so, get the first event id. If not, go create a calendar. */
	
	if(typeof response.calendars[0]  != "undefined"){
		this.clndrid = response.calendars[0].calendarId;
		this.addEvent();
	} else {
		this.controller.serviceRequest('palm://com.palm.calendar/crud', {
			method: 'createCalendar',
			parameters: {
				"accountId": this.acctid,
				"calendar": {
 					"calendarId":'',
 					"name":'Séances'
					}
			},
			onSuccess: this.handleCreateCalendarResponse.bind(this),
			onFailure: this.handleErrResponse.bind(this)
			})

	}														 
}

FilmAssistant.prototype.handleCreateCalendarResponse = function(response){
	this.clndrid = response.calendarId;
	this.addEvent();
}

FilmAssistant.prototype.handleErrResponse = function(response){
	this.showDialogBox($L("Error"), "Error service response: <br><br>" + Object.toJSON(response));																	 
}

FilmAssistant.prototype.handleAddResponse = function(response){
	this.evntidc = response.eventId;
	
	bannerParams = {
		messageText: $L("msgEventAdd")
	};
	
	this.appController.showBanner(bannerParams, {banner: $L("msgEventAdd")});
	
}

// This function will popup a dialog, displaying the message passed in.
FilmAssistant.prototype.showDialogBox = function(title,message){
		this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
} 

FilmAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	
	
}

FilmAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

FilmAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

/* CALLBACK DATABASE METHODS */
FilmAssistant.prototype.callBackCompleteMovie = function(movie) {
	console.log('FilmAssistant.callBackCompleteMovie : '+movie.movieTime);
	this.movie = movie;
	if (this.movie.description == null){
		if (this.debug){
			console.log('FilmAssistant.callBackCompleteMovie : debug ');
			this.resultsDebug();
		}else{
			console.log('FilmAssistant.callBackCompleteMovie : request ');
			this.launchRequest();
		}
	}else{
		console.log('FilmAssistant.callBackCompleteMovie : completeReviews ');
		this.dbHelper.completeMovieReviews(this.callBackCompleteMovieReviews.bind(this), this.movie);
	}
	
};
FilmAssistant.prototype.callBackCompleteMovieReviews = function(movie) {
	console.log('FilmAssistant.callBackCompleteMovieReviews : ');
	this.display();
};

FilmAssistant.prototype.translatePlot = function () {
	console.log("FilmAssistant.translatePlot : "+ (this.movie.trDescription == null || this.movie.trDescription == ""));
	if (this.movie.trDescription == null || this.movie.trDescription == ""){
		// On a pas encore chercher à traduire le texte
		/*
		 * à virer
		 * */
		var urlTranslate = "http://ajax.googleapis.com/ajax/services/language/translate?";
		urlTranslate += "v=1.0";
		urlTranslate += "&langpair=en%7C"+this.locale; // à commenter pour les test
		//urlTranslate += "&langpair="+this.locale+"%7Cen";
		urlTranslate += "&q="+this.movie.description;
		
		console.log("FilmAssistant.translatePlot : url : "+ urlTranslate);
		var request = new Ajax.Request(urlTranslate, {
			method: 'get',
			onSuccess: this.translate.bind(this),
			onFailure: this.translateFailure.bind(this)
		});
	}else if (this.enPlot){
		// On l'a déjà traduit et il s'agit du texte anglais qui est affiché
		$("resume").innerHTML = decode(this.movie.trDescription);
		this.enPlot = false;
	}else{
		// On l'a déjà traduit et il s'agit du texte de la langue courante qui est affiché
		$("resume").innerHTML = decode(this.movie.description);
		this.enPlot = true;
	}
};

FilmAssistant.prototype.translate = function (transport) {
	// On récupère le texte traduit;
	console.log("FilmAssistant.translate : "+ transport.responseText);
	var objJSon = transport.responseText.evalJSON();
	try{
		if (objJSon.responseStatus == "200"){
			this.movie.trDescription = objJSon.responseData.translatedText;
			$("resume").innerHTML = decode(this.movie.trDescription);
			this.enPlot = false;
			// on va écraser en base les infos sur le film
			this.dbHelper.insertMovie(this.movie);
		}else if (objJSon.responseStatus == "400"){
			this.controller.showAlertDialog({
				onChoose: function(){},
				title: $L("errorMsg"),
				message: $L("msgErrorTranslate")+":\n"+objJSon.responseDetails,
				choices:[{label: $L('OK'), value:'OK', type:'color'}]
			});	  	
		}else{
			this.controller.showAlertDialog({
				onChoose: function(){},
				title: $L("errorMsg"),
				message: $L("msgErrorTranslate"+transport.responseText),
				choices:[{label: $L('OK'), value:'OK', type:'color'}]
			});	
		}
	}catch (e) {
		console.log("FilmAssistant.translate : "+ e.message);
		this.controller.showAlertDialog({
			onChoose: function(){},
			title: $L("errorMsg"),
			message: $L("msgErrorTranslate"),
			choices:[{label: $L('OK'), value:'OK', type:'color'}]
		});	
	}
	
};
FilmAssistant.prototype.translateFailure = function (transport) {
	this.controller.showAlertDialog({
		onChoose: function(){},
		title: $L("errorMsg"),
		message: $L("msgErrorTranslate"+transport.responseText),
		choices:[{label: $L('OK'), value:'OK', type:'color'}]
	});	  	
};

FilmAssistant.prototype.results = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
									"<IMDB_RESP>" +
									"    <MOVIE ACTORS = \"Daniel+Day-Lewis%7CMarion+Cotillard%7CPen%C3%A9lope+Cruz%7CNicole+Kidman%7CJudi+Dench%7CKate+Hudson%7CSophia+Loren%7CStacy+Ferguson%7CRicky+Tognazzi%7CGiuseppe+Cederna%7CElio+Germano%7CAndrea+Di+Stefano%7CRoberto+Nobile%7CRomina+Carancini%7CAlessandro+Denipotti\" DIRECTORS = \"Rob+Marshall\" ID = \"a184cf380a530bdb\" IMDB_ID = \"0875034\" MOVIE_NAME = \"Nine\" RATE = \"6.4\" STYLE = \"Drama|Musical|Romance\" URL_IMG = \"http://ia.media-imdb.com/images/M/MV5BMTI5OTY2MDAzN15BMl5BanBnXkFtZTcwNzcxODIwMw@@._V1._SX93_SY140_.jpg\" URL_WIKIPEDIA = \"http%3A%2F%2Ffr.wikipedia.org%2Fwiki%2FNine_%2528film%252C_2009%2529\">" +
									"        <DESC IMDB_DESC = \"false\">Guido+Contini+est+le+plus+grand+r%C3%A9alisateur+de+son+%C3%A9poque.+V%C3%A9n%C3%A9r%C3%A9+par+les+critiques+et+adul%C3%A9+par+le+public%2C+il+n%27a+qu%27un+seul+point+faible+%3A+les+jolies+femmes+%21+Tiraill%C3%A9+entre+sa+sublime+%C3%A9pouse+et+sa+sulfureuse+ma%C3%AEtresse%2C+harcel%C3%A9+par+une+s%C3%A9duisante+journaliste%2C+subjugu%C3%A9+par+la+star+de+son+prochain+film%2C+Guido+ne+sait+plus+o%C3%B9+donner+de+la+t%C3%AAte.+Soutenu+par+sa+confidente+et+sa+m%C3%A8re%2C+parviendra-t-il+%C3%A0+r%C3%A9sister+%C3%A0+toutes+ces+tentations+%3F+</DESC>" +
									"        <REVIEWS>" +
									"            <REVIEW AUTHOR = \"Frankithon.\" RATE = \"2.5\" SOURCE = \"www.cinemovies.fr\" URL_REVIEW = \"http://www.cinemovies.fr/fiche_critiquem.php?IDfilm=15571\">Que+peut-il+y+avoir+de+plus+contre-nature+qu%27une+com%C3%A9die+musicale+%3F+S%27arr%C3%AAter+de+jouer+pour+soudain+pousser+la+chansonnette+%21+Il+ya+la+parenth%C3%A8se+...</REVIEW>" +
									"            <REVIEW AUTHOR = \"FrancoisPincemi.\" RATE = \"3.5\" SOURCE = \"www.cinemovies.fr\" URL_REVIEW = \"http://www.cinemovies.fr/fiche_critiquem.php?IDfilm=15571\">A+reserver+aux+amateurs+de+chansons+style+Folies+bergeres%2C+mais+aussi+de+Rome+et+de+Fellini.+Les+autres+trouveront+le+temps+long...</REVIEW>" +
									"            <REVIEW AUTHOR = \"predator37\" RATE = \"1.5\" SOURCE = \"www.premiere.fr\" URL_REVIEW = \"http://www.premiere.fr/film/Nine\">Un+hommage+au+8+%C2%BD+de+Fellini%2C+on+en+est+malheureusement+bien+loin.+Cela+faisait+longtemps+qu%27on+nous+parlait+de+ce+film+%C3%A9v%C3%A9nement+au+casting+de+...</REVIEW>" +
									"            <REVIEW AUTHOR = \"notluf.\" RATE = \"5.0\" SOURCE = \"www.cinemovies.fr\" URL_REVIEW = \"http://www.cinemovies.fr/fiche_critiquem.php?IDfilm=15571\">J%27avais+oubli%C3%A8+de+le+noter+Comme+le+dit+le+titre+de+mon+artcicle+10%2F10</REVIEW>" +
									"            <REVIEW AUTHOR = \"jch2o\" RATE = \"3.5\" SOURCE = \"www.nord-cinema.com\" URL_REVIEW = \"http://www.nord-cinema.com/fiches/critiques3567.html\">Avec+%22Nine%22+%3D+9+Rob+Marshall+ne+s%27est+pas+beaucoup+creus%C3%A9+pour+trouver+le+titre+de+son+film+qui+est+un+remake+de+%228+1%2F2%22de+Fellini.+%28pas+vu+l+...</REVIEW>" +
									"            <REVIEW AUTHOR = \"Guillaume\" RATE = \"3.0\" SOURCE = \"www.krinein.com\" URL_REVIEW = \"http://www.krinein.com/cinema/nine-9696.html\">Nine+n%27est+pas+un+film+choral.+Nine+n%27est+pas+non+plus+une+com%C3%A9die+musicale+avec+chorale+fa%C3%A7on+film+avec+Jugnot.+Non%2C+Nine+c%27est+plut%C3%B4t+un+...</REVIEW>" +
									"            <REVIEW AUTHOR = \"traversay\" RATE = \"1.5\" SOURCE = \"www.premiere.fr\" URL_REVIEW = \"http://www.premiere.fr/film/Nine\">Nine+%3F+Nein%2C+nein%2C+nein+%21+Peut-%C3%AAtre+que+sur+sc%C3%A8ne+la+com%C3%A9die+musicale+avait+un+soup%C3%A7on+d%27int%C3%A9r%C3%AAt+mais+son+adaptation+au+cin%C3%A9ma+par+Rob+Marshall+...</REVIEW>" +
									"            <REVIEW AUTHOR = \"mycityisny\" RATE = \"3.0\" SOURCE = \"www.nord-cinema.com\" URL_REVIEW = \"http://www.nord-cinema.com/fiches/critiques3567.html\">Si+vous+n%27avez+pas+vu+l%27original+par+Fellini%2C+cela+ne+vous+emp%C3%AAchera+pas+d%27appr%C3%A9cier+NINE.+A+la+v%C3%A9rit%C3%A9%2C+je+n%27avais+pas+envie+de+le+voir+car+les+...</REVIEW>" +
									"            <REVIEW AUTHOR = \"bruno216\" RATE = \"1.5\" SOURCE = \"www.premiere.fr\" URL_REVIEW = \"http://www.premiere.fr/film/Nine\">D%C3%A8s+le+d%C3%A9part+et+la+premi%C3%A8re+chor%C3%A9graphie+%2C+on+le+sent+tr%C3%A8s+moyen+%2C+ce+film.+Et+puis+%2C+on+attend+quand+m%C3%AAme+.+Le+souvenir+de+Chicago+reste+si+...</REVIEW>" +
									"            <REVIEW AUTHOR = \"brunoco\" RATE = \"1.5\" SOURCE = \"www.premiere.fr\" URL_REVIEW = \"http://www.premiere.fr/film/Nine\">Quand+je+vois+une+revue+comparer+ce+film+%C3%A0+Chicago+%2C+je+me+dis+qu%27il+ya+des+choses+incomparables.+Autant+Chicago+%C3%A9tait+inventif+et+d%27une+...</REVIEW>" +
									"            <REVIEW AUTHOR = \"betelgeuse\" RATE = \"3.0\" SOURCE = \"www.cinemaclock.com\" URL_REVIEW = \"http://www.cinemaclock.com/aw/crva.aw/que/Montreal/f/19693/0/Nine.html\">Un+peu+d%C3%A9cevant.+Les+chor%C3%A9graphies+sont+int%C3%A9ressantes%2C+c%27est+la+meilleure+partie+du+film.+C%27est+un+peu+ironique+de+faire+un+film+sans+sc%C3%A9nario+sur+...</REVIEW>" +
									"            <REVIEW AUTHOR = \"michele\" RATE = \"5.0\" SOURCE = \"www.cinemaclock.com\" URL_REVIEW = \"http://www.cinemaclock.com/aw/crva.aw/que/Montreal/f/19693/0/Nine.html\">Pour+les+amoureux+du+cin%C3%A9ma%2C+g%C3%A9nial+et+tr%C3%A8s+%C3%A9mouvant.</REVIEW>" +
									"        </REVIEWS>" +
									"    </MOVIE>" +
									"</IMDB_RESP>";
