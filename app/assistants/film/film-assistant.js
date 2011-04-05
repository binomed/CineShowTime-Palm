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
  
  this.controller.setupWidget("trailerScroll", {mode: 'horizontal'}, {}); 
	
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
	
	var content = Mojo.View.render({object: {id:"",title:$L("trailer")}, template: 'title-template'});
	$("titleTrailers").innerHTML = content;
			
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
	
	for (var i = 0; i < this.movie.videos.length; i++) {
	   if(this.movie.videos[i].num != i) {
        this.movie.videos[i].num = num;
     }
	}
	
	var content = Mojo.View.render({collection: this.movie.videos, template: 'film/video-template'});
	$('tableTrail').innerHTML = "<table class=\"trailers\">"+content+"</table>";
	
	for (var i = 0; i < this.movie.videos.length; i++) {
     console.log('FilmAssistant.display : listen : trailer'+i); 
	   Mojo.Event.listen(this.controller.get('trailer'+i),Mojo.Event.tap,this.displayTrailer.bind(this));
	}
	
	if(this.movie.videos.length == 0) {
    $('titleTrailers').hide();
    $('trailers').hide();
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
		this.addEvent(); 
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

FilmAssistant.prototype.displayTrailer = function(event) {
  var tg = event.target.id;
  var id = parseInt(tg.substring(7));
  console.log('FilmAssistant.displayTrailer : event target : ' + tg + ', id : '+ id);
  
//  var args = {
//      appId: "com.palm.app.videoplayer",
//      name: "nowplaying"
//   };
//
// var params = {
//    target: this.movie.videos[id].url,
//    title: this.movie.videos[id].title
// };
//
// this.controller.stageController.pushScene(args, params);
 
 	var urlVideo = this.movie.videos[id].url;
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
		method: "open",
		parameters: {
			id: 'com.palm.app.browser',
			params: {
				scene: 'page',
				target: urlVideo
			}
		}
	});	
  
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
	
	if (distanceTime == null || isNaN(distanceTime) ){
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
	
	/*this.event = {
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
	});*/
	
	console.log('FilmAssistant.addEvent : start : ' + this.showtimeList[this.selectedIndex].showtime);
	console.log('FilmAssistant.addEvent : end : ' + getEndTimeStamp(parseInt(this.showtimeList[this.selectedIndex].showtime), parseInt(this.movie.movieTime), minutesToMs(this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_ADDS))));
	
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
        method: "open",
        parameters: 
        {
            id: "com.palm.app.calendar",
            params: 
            {
                newEvent: {
                    "subject": decode(this.getMovieTitle(this.movie)),
                    "dtstart": this.showtimeList[this.selectedIndex].showtime,
                    "dtend": getEndTimeStamp(parseInt(this.showtimeList[this.selectedIndex].showtime), parseInt(this.movie.movieTime), minutesToMs(this.preferences.getPrefValue(this.preferences.KEY_PREF_TIME_ADDS))),
                    "location": decode(this.theater.theaterName) + ", " + decode(this.theater.place.cityName),
                    "note": '',  // string
                    "allDay": false  // boolean
                }
            }
        },
        onSuccess: this.handleAddResponse.bind(this),
		onFailure: this.handleErrResponse.bind(this)
    });

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
	
	var tagVideo = null;
	var videoList = [];
	var video = null;
	for (var k = 0; k < tagMovie.getElementsByTagName("VIDEO").length; k++) {
	  tagVideo = tagMovie.getElementsByTagName("VIDEO")[k];
		video = new VideoBean();
		
		video.movieId = movie.id;
		//video.id = k;
		video.num = k;
		video.url = tagVideo.getAttribute("URL_VIDEO"); 
		video.title = decode(tagVideo.getAttribute("VIDEO_NAME")); 
		video.img = tagVideo.getAttribute("URL_IMG"); 
		
		videoList.push(video);
	}
	movie.videos = videoList;
	
	
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
	var url = this.cst.URL_SERVER+'imdb?output=xml&oe=UTF-8&place='+place+'&mid='+this.movie.id+'&moviecurlangname='+name+'&moviename='+enName+'&ie=UTF-8&lang='+this.locale+'&trailer=true';
	
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
	console.log('FilmAssistant.gotResults : XML : '+ xmlstring);
	
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
	this.dbHelper.completeMovieYoutube(this.callBackCompleteMovieYoutube.bind(this), this.movie);
};
FilmAssistant.prototype.callBackCompleteMovieYoutube = function(movie) {
	console.log('FilmAssistant.callBackCompleteMovieYoutube : ');
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

FilmAssistant.prototype.results = "<IMDB_RESP>" +
                                  "    <MOVIE ACTORS = \"Steve+Carell%7CTina+Fey%7CMark+Wahlberg%7CTaraji+P.+Henson%7CJimmi+Simpson%7CCommon%7CWilliam+Fichtner%7CLeighton+Meester%7CKristen+Wiig%7CMark+Ruffalo%7CJames+Franco%7CMila+Kunis%7CBill+Burr%7CJonathan+Morgan+Heit%7CSavannah+Paige+Rae\" DIRECTORS = \"Shawn+Levy\" ID = \"ee62226f902861f9\" IMDB_ID = \"1279935\" MOVIE_NAME = \"CRAZY NIGHT\" RATE = \"6.9\" STYLE = \" Comedie | Romance | Thriller\" URL_IMG = \"http://ia.media-imdb.com/images/M/MV5BODgwMjM2ODE4M15BMl5BanBnXkFtZTcwMTU2MDcyMw@@._V1._SX95_SY140_.jpg\" URL_WIKIPEDIA = \"http%3A%2F%2Ffr.wikipedia.org%2Fwiki%2FCrazy_Night\" YEAR = \"2010\">" +
                                  "        <DESC IMDB_DESC = \"false\">Pour+tenter+de+rompre+la+routine+qui+s%27installe+dans+leur+couple%2C+Phil+et+Claire+Foster+d%C3%A9cident+de+passer+une+soir%C3%A9e+extraordinaire+dans+le+restaurant+le+plus+en+vue+de+Manhattan.+Sans+r%C3%A9servation%2C+ils+n%27ont+d%27autre+choix+que+de+se+faire+passer+pour+un+autre+couple%2C+les+Triplehorn%2C+afin+d%27obtenir+une+table.+Mais+%C3%A0+peine+leurs+entr%C3%A9es+termin%C3%A9es%2C+leur+imposture+est+d%C3%A9voil%C3%A9e+par+des+gangsters+impitoyables+%C3%A0+la+recherche+des+Triplehorn.+Les+Foster+sont+oblig%C3%A9s+de+fuir+pour+sauver+leur+peau%2C+et+se+retrouvent+alors+plong%C3%A9s+dans+une+s%C3%A9rie+improbable+d%27embrouilles+%C3%A0+travers+la+ville.+C%27est+le+d%C3%A9but+d%27une+nuit+d%C3%A9mente+qui+va+leur+permettre+de+faire+exploser%2C+entre+autres%2C+la+monotonie+de+leur+couple...+Une+chose+est+s%C3%BBre+%3A+ils+ne+sont+pas+pr%C3%AAts+d%27oublier+cette+soir%C3%A9e.+</DESC>" +
                                  "        <REVIEWS>" +
                                  "            <REVIEW AUTHOR = \"isabel-g-grives\" RATE = \"0.0\" SOURCE = \"www.cinefil.com\" URL_REVIEW = \"http://www.cinefil.com/film/crazy-night-2/critiques\">Allez%2C+je+pensais+qu%27avec+deux+comiques+de+cette+envergure%2C+j%27allais+me+plier+de+rire+%C3%A0+chaque+gag.+A%C3%AFe%2C+malheureusement%2C+non.+Certains+moments+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"gotchi\" RATE = \"0.0\" SOURCE = \"www.cinefil.com\" URL_REVIEW = \"http://www.cinefil.com/film/crazy-night-2/critiques\">Si+vous+aimez+l%27humour+potache+%C3%A0+l%27am%C3%A9ricaine.+si+vous+aimez+steve+carell+et+tina+fey%2C+vous+devez+y+aller.+j%27ai+ri+de+bon+c%C5%93ur+sans+que+mes+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"bibi\" RATE = \"0.5\" SOURCE = \"www.nord-cinema.com\" URL_REVIEW = \"http://www.nord-cinema.com/fiches/critiques3686.html\">Dans+la+s%C3%A9rie+big+navet%2C+voici+%22Crazy+night%22%21+Difficile+de+faire+plus+affligeant.+Deux+stars+du+comique%2C+ai-je+bien+lu+%3F+D%C3%A8s+la+premi%C3%A8re+minute%2C+j+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"nanou54*\" RATE = \"0.0\" SOURCE = \"www.cinefil.com\" URL_REVIEW = \"http://www.cinefil.com/film/crazy-night-2/critiques\">Je+pensais+assister+%C3%A0+une+bonne+com%C3%A9die%2C+pouaf%2C+d%C3%A9%C3%A7ue.+Gags+trop+gros%2C+le+film+n%27est+pas+dr%C3%B4le%2C+une+d%C3%A9ception+quoi+%21+Franchement+il+ya+mieux+%C3%A0+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"chti64\" RATE = \"0.0\" SOURCE = \"www.cinefil.com\" URL_REVIEW = \"http://www.cinefil.com/film/crazy-night-2/critiques\">Tr%C3%A8s+d%C3%A9%C3%A7ue.+J%27ai+%C3%A0+peine+souri+%21+J%27avoue+que+ne+n%27ai+pas+entendu+rire+non+plus+dans+la+salle+%21+Trop+de+blabla.+Dommage%2C+la+bande+annonce+%C3%A9tait+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"Jujulcactus.\" RATE = \"0.0\" SOURCE = \"www.cinemovies.fr\" URL_REVIEW = \"http://www.cinemovies.fr/fiche_critiquem.php?IDfilm=18374\">%C2%ABCrazy+Night%C2%BB+est+une+grosse+com%C3%A9die+%C3%A0+la+sauce+am%C3%A9ricaine%2C+pourtant+je+l%27attendais+avec+une+certaine+impatience+pour+ses+deux+interp%C3%A8tes+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"chantalou\" RATE = \"1.0\" SOURCE = \"www.nord-cinema.com\" URL_REVIEW = \"http://www.nord-cinema.com/fiches/critiques3686.html\">Et+bien+voici+une+com%C3%A9die+consternante+et+sans+finesse.+Tout+ceci+est+typiquement+Am%C3%A9ricain+et+le+spectateur+moyen+Fran%C3%A7ais+est+bien+largu%C3%A9.+Le+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"sophiedamidot\" RATE = \"0.0\" SOURCE = \"www.cinefil.com\" URL_REVIEW = \"http://www.cinefil.com/film/crazy-night-2/critiques\">On+rit+de+toutes+les+situations+%21+Un+des+tr%C3%A8s+rares+films+distrayants+que+j%27ai+pu+voir...+Les+acteurs+sont+%C3%A9patants%2C+tout+sp%C3%A9cialement+les+sc%C3%A8nes+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"dofin33\" RATE = \"0.0\" SOURCE = \"www.cinefil.com\" URL_REVIEW = \"http://www.cinefil.com/film/crazy-night-2/critiques\">2+gros+comiques+am%C3%A9ricains%3B+on+nous+annon%C3%A7ait+des+gags+%C3%A9normes.+Finalement+2+ou+3+gags+sympas%2C+une+grosses+cascade+mais+rien+de+tr%C3%A8s+original.+%C3%A7a+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"Frankithon.\" RATE = \"0.0\" SOURCE = \"www.cinemovies.fr\" URL_REVIEW = \"http://www.cinemovies.fr/fiche_critiquem.php?IDfilm=18374\">Peu+de+temps+apr%C3%A8s+les+Morgan+%28le+grima%C3%A7ant+Hugh+Grant+et+Sarah+Jessica+Parker%29%2C+les+Foster+d%C3%A9barque+sur+grand+%C3%A9cran.+Le+th%C3%A8me+est+identique%2C+un+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"Riton32\" RATE = \"0.0\" SOURCE = \"www.cinefil.com\" URL_REVIEW = \"http://www.cinefil.com/film/crazy-night-2/critiques\">C%27est+vrai+qu%27au+d%C3%A9part+l%27id%C3%A9e+n%27est+pas+mauvaise.+Un+couple+en+mal+d%27amour+qui+usurpe+une+place+r%C3%A9serv%C3%A9+au+resto.+Apr%C3%A8s%2C+il+faut+d%C3%A9velopper.+Et+...</REVIEW>" +
                                  "            <REVIEW AUTHOR = \"tina 75\" RATE = \"0.0\" SOURCE = \"www.cinefil.com\" URL_REVIEW = \"http://www.cinefil.com/film/crazy-night-2/critiques\">Je+m%27attendais+%C3%A0+un+film+tr%C3%A8s+amusant+puisque+certains+journaux+l%27avaient+compar%C3%A9+%C3%A0+%22very+bad+trip%22+%3B+grosse+d%C3%A9ception%2C+ce+n%27est+vraiment+pas+...</REVIEW>" +
                                  "        </REVIEWS>" +
                                  "        <VIDEOS>" +
                                  "            <VIDEO URL_IMG = \"http://i.ytimg.com/vi/px0oDjWsxwQ/hqdefault.jpg\" URL_VIDEO = \"http://www.youtube.com/watch?v=px0oDjWsxwQ&amp;feature=youtube_gdata\" VIDEO_NAME = \"Crazy+Night+Bande+Annonce+VOST\"/>" +
                                  "            <VIDEO URL_IMG = \"http://i.ytimg.com/vi/y9uszOKQmCs/hqdefault.jpg\" URL_VIDEO = \"http://www.youtube.com/watch?v=y9uszOKQmCs&amp;feature=youtube_gdata\" VIDEO_NAME = \"Crazy+Night+Bande+Annonce+VF\"/>" +
                                  "            <VIDEO URL_IMG = \"http://i.ytimg.com/vi/ZchvefNcFbE/hqdefault.jpg\" URL_VIDEO = \"http://www.youtube.com/watch?v=ZchvefNcFbE&amp;feature=youtube_gdata\" VIDEO_NAME = \"CRAZY+NIGHT+Extrait+2+Mark+Walhberg+VF\"/>" +
                                  "            <VIDEO URL_IMG = \"http://i.ytimg.com/vi/9KQyFtFkYLo/hqdefault.jpg\" URL_VIDEO = \"http://www.youtube.com/watch?v=9KQyFtFkYLo&amp;feature=youtube_gdata\" VIDEO_NAME = \"Crazy+Night+-+Bloopers\"/>" +
                                  "            <VIDEO URL_IMG = \"http://i.ytimg.com/vi/iFFGH6kzbsQ/hqdefault.jpg\" URL_VIDEO = \"http://www.youtube.com/watch?v=iFFGH6kzbsQ&amp;feature=youtube_gdata\" VIDEO_NAME = \"Crazy+Night\"/>" +
                                  "            <VIDEO URL_IMG = \"http://i.ytimg.com/vi/xUs8Z0w6voE/hqdefault.jpg\" URL_VIDEO = \"http://www.youtube.com/watch?v=xUs8Z0w6voE&amp;feature=youtube_gdata\" VIDEO_NAME = \"Crazy+night+VOST\"/>" +
                                  "            <VIDEO URL_IMG = \"http://i.ytimg.com/vi/kTQw_tNGA7Q/hqdefault.jpg\" URL_VIDEO = \"http://www.youtube.com/watch?v=kTQw_tNGA7Q&amp;feature=youtube_gdata\" VIDEO_NAME = \"Night+and+the+City+%281950%29+Trailer\"/>" +
                                  "            <VIDEO URL_IMG = \"http://i.ytimg.com/vi/UvI4t69so7Q/hqdefault.jpg\" URL_VIDEO = \"http://www.youtube.com/watch?v=UvI4t69so7Q&amp;feature=youtube_gdata\" VIDEO_NAME = \"YanooBlog+-+Sorties+cin%C3%A9+12%2F05%2F10\"/>" +
                                  "            <VIDEO URL_IMG = \"http://i.ytimg.com/vi/KvZML6CCID4/hqdefault.jpg\" URL_VIDEO = \"http://www.youtube.com/watch?v=KvZML6CCID4&amp;feature=youtube_gdata\" VIDEO_NAME = \"bande+annonce+Batboy\"/>" +
                                  "            <VIDEO URL_IMG = \"http://i.ytimg.com/vi/lLFibIkxaPM/hqdefault.jpg\" URL_VIDEO = \"http://www.youtube.com/watch?v=lLFibIkxaPM&amp;feature=youtube_gdata\" VIDEO_NAME = \"La+Chronique+Cin%C3%A9ma+21+mai+2010+3%C3%A8meGauche+TV\"/>" +
                                  "        </VIDEOS>" +
                                  "    </MOVIE>" +
                                  "</IMDB_RESP>";
