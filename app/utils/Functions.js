/* Utilisation de jQuery en mode noConflict */
var $j = jQuery.noConflict();

/* Fonction qui décode les chaines de caract�res */
function decode (val) {
	var str = null;
	if (val != null){
		
//		try{
//		var string = "";
//	    var l  = val.length ;
//	    var ch = -1 ;
//	    var b, sumb = 0;
//	    var more = -1;
//	    for (var i = 0 ; i < l ; i++) {
//	      /* Get next byte b from URL segment s */
//	    	console.log("ch : i"+i+", "+val.charAt(i));
//	    switch (ch = val.charCodeAt(i)) {
//			case '%':
//			  ch = val.charCodeAt(++i);
//			  var hb = "";
//			  if (!isNaN(ch)){ 
//				  hb =  ch - '0';
//			  }else{
//				  hb = 10+ch.toLowerCase()-'a';
//			  }
//			  console.log("ch : "+ch+", hb : "+hb+" isNaN : "+isNaN(ch)+", add"+(hb & 0xF));
//			  hb = hb & 0xF;
//			  ch = val.charCodeAt(++i);
//			  var lb = '';
//			  if (!isNaN(ch)){
//				  lb = ch - '0';
//			  }else{
//				  lb = 10+ch.toLowerCase() -'a';
//			  }
//			  console.log("ch : "+ch+", lb : "+lb+" isNaN : "+isNaN(ch)+", add"+(lb & 0xF));
//			  lb = lb & 0xF;
//			  console.log("ch : i"+i+", "+ch+", lb : "+lb);
//			  b = (hb << 4) | lb ;
//			  console.log("b : "+b);
//			  break ;
//			case '+':
//			  b = ' ';
//			  break ;
//			default:
//			  b = ch ;
//	      }
//	      /* Decode byte b as UTF-8, sumb collects incomplete chars */
//	      if ((b & 0xc0) == 0x80) {			// 10xxxxxx (continuation byte)
//			sumb = (sumb << 6) | (b & 0x3f) ;	// Add 6 bits to sumb
//			if (--more == 0){
//				string +=  sumb ; // Add char to sbuf
//			}
//	      } else if ((b & 0x80) == 0x00) {		// 0xxxxxxx (yields 7 bits)
//	    	  string +=  b ;			// Store in sbuf
//	      } else if ((b & 0xe0) == 0xc0) {		// 110xxxxx (yields 5 bits)
//			sumb = b & 0x1f;
//			more = 1;				// Expect 1 more byte
//	      } else if ((b & 0xf0) == 0xe0) {		// 1110xxxx (yields 4 bits)
//			sumb = b & 0x0f;
//			more = 2;				// Expect 2 more bytes
//	      } else if ((b & 0xf8) == 0xf0) {		// 11110xxx (yields 3 bits)
//			sumb = b & 0x07;
//			more = 3;				// Expect 3 more bytes
//	      } else if ((b & 0xfc) == 0xf8) {		// 111110xx (yields 2 bits)
//			sumb = b & 0x03;
//			more = 4;				// Expect 4 more bytes
//	      } else /*if ((b & 0xfe) == 0xfc)*/ {	// 1111110x (yields 1 bit)
//			sumb = b & 0x01;
//			more = 5;				// Expect 5 more bytes
//	      }
//		      /* We don't test if the UTF-8 encoding is well-formed */
//	    }
//	    console.log("DECODE VALUE : '"+string+"'");
//		return string ;
//		}catch (e) {
//			console.log("ERROR : "+e.message);
//		}
		
		str = decodeURIComponent(val);
		
		str = str.replace(/\+/g," ");
		
		str = str.replace(/%2C/g,",");
		str = str.replace(/%3A/g,":");
		str = str.replace(/%3F/g,"?");
		str = str.replace(/%2F/g,"/");
		str = str.replace(/%27/g,"'");
		str = str.replace(/%2B/g," ");
		str = str.replace(/%3D/g,"=");
		str = str.replace(/%40/g,"@");
		str = str.replace(/%C3%A9/g,"é");
		str = str.replace(/%C3%B1/g,"ñ");
		str = str.replace(/%C3%BC/g,"ü");
		
	}
	return str;
};

function encode (val) {
	var str = null;
	if (val != null){
		str = encodeURIComponent(val);
//		str = unescape( encodeURIComponent( val ) );
	}
	return str;
};

/* Fonction qui ajoute les zéros devant */
function trailZeros(val) {
	if (val < 10) {
		val = "0" + val.toString();
	}
	
	return val;
};

/* Fonction qui donne l'heure en fonction d'un UTC Timestamp */
function getTimeByDate(val, format) {
	
	var myDate = new Date();
	myDate.setTime(parseInt(val));
	
	var hourInt = myDate.getHours();
	var minInt = myDate.getMinutes();
	var amPmStr = "";
	var houtStr = "";
	var horaire = "";
	if (format == 12){
		if (hourInt > 12){
			amPmStr = "pm";
			hourInt = hourInt % 12;
		}else{
			//amPmStr = "am";
		}			
		hourStr = ":";
	}else{
		hourStr = ":";
		amPmStr = "";
		hourInt = trailZeros(hourInt);
	}
		
	horaire = hourInt + hourStr + trailZeros(minInt) + amPmStr;

	return horaire;
}

/* Fonction qui donne l'heure en fonction d'un UTC Timestamp */
function getDurationByDate(val, format) {
	
	var myDate = new Date();
	myDate.setTime(parseInt(val));
	
	var hourInt = myDate.getHours();
	var minInt = myDate.getMinutes();
	var amPmStr = "";
	var houtStr = "";
	var horaire = "";
	
	hourStr = $L("hour");
	minStr = $L("min");
	amPmStr = "";
	//hourInt = trailZeros(hourInt);
			
	horaire = hourInt + hourStr + trailZeros(minInt) + minStr;

	return horaire;
}

function getEndTimeByDate(val, format) {
	var myDate;
	var horaire = "";
	var hourInt = 0;
	var minInt = 0;
	var amPmStr = "";
	var houtStr = "";
	
	if(!isNaN(val)) {	
		myDate = new Date();
		myDate.setTime(parseInt(val));
		
		hourInt = myDate.getHours();
		minInt = myDate.getMinutes();
		if (format == 12){
			if (hourInt > 12){
				amPmStr = "pm";
				hourInt = hourInt % 12;
			}else{
				//amPmStr = "am";
			}			
			hourStr = ":";
		}else{
			hourStr = ":";
			amPmStr = "";
			hourInt = trailZeros(hourInt);
		}
		
		horaire = $L("endHour") + hourInt + hourStr + trailZeros(minInt) + amPmStr;
	} else {
		horaire = "";
	}
	
	return horaire;
}


function getEndTimeStamp(start, duration, ads) {

	var endDate = new Date(parseInt(start));	

	if(isNaN(duration)) {
		var durationDate = new Date();
		
		durationDate.setMinutes(30);
		durationDate.setHours(1);
	} else {
		var durationDate = new Date(parseInt(duration));
	}
	
	endDate.setMinutes(endDate.getMinutes() + durationDate.getMinutes());
	endDate.setHours(endDate.getHours() + durationDate.getHours());
	
	/*var mois = parseInt(myDate.getMonth());
	//mois = mois +1;

	console.log ("Duration base : " + duration);
	console.log ("Date : " + myDate.getFullYear() + "/" + mois + "/" + myDate.getDate());
	var durationTemp = new Date(myDate.getFullYear(),mois,myDate.getDate());
	var durationTempNum = Math.round(durationTemp.getTime());
	console.log ("DurationTemp : " + durationTempNum);
	console.log ("Duration : " + duration);
	
	var interval = parseInt(duration) - parseInt(durationTempNum);*/
	var endTime = endDate.getTime();
	
	return parseInt(endTime) + parseInt(ads);
}


function getFirstEntities(stringEntity, number) {
	
	var entities = [];
	if (stringEntity == null){
		return "";
	}
	var stringEnt = decode(stringEntity);
	entities = stringEnt.split("|");
	var entityList = "";
	
	console.log('FilmAssistant.getActors : actors : ' + stringEntity);
	console.log('FilmAssistant.getActors : number of actors : ' + entities.length);
	
	for (var i = 0; i < number && i < entities.length; i++) {
		entityList = entityList + entities[i];
		
		if(i < (number)-1 && i < (entities.length)-1) {
			entityList = entityList + ", "; 
		}
	}
	
	if(i < (entities.length)-1) {
		entityList = entityList + "...";
	}
	
	return entityList;
}

function displayStars(rate,base) {
	var stringStars = "";
	var nbStars = 0;
	
	for (var j = 0; j < Math.floor(rate); j++) {
		stringStars = stringStars + "<img class=\"rate_star\" src=\"images/rate_star_small_on.png\" />";
		nbStars = nbStars + 1;
	}
	
	if((rate*10)%10 >= parseInt(base)) {
		stringStars = stringStars + "<img class=\"rate_star\" src=\"images/rate_star_small_half.png\" />";
		nbStars = nbStars + 1;
	}
	
	for (j = 0; j < (parseInt(base)-nbStars); j++) {
		stringStars = stringStars + "<img class=\"rate_star\" src=\"images/rate_star_small_off.png\" />";
	}
	
	return stringStars;
}

function getMilliseconds(days)
{
    var millisecond=1;
	var second=millisecond*1000;
	var minute=second*60;
	var hour=minute*60;
	var day=hour*24;
	
	return day * days;

}

function minutesToMs(minutes)
{
    var millisecond=1;
	var second=millisecond*1000;
	var minute=second*60;
	
	return parseInt(minutes) * minute;

}

function getFirstChar(str, nb) {
	
	var strdec = decode(str);
	
	if(nb < strdec.length) {
		return strdec.substring(0,nb) + "...";
	} else {
		return strdec;
	}
}

function sort(originalList, comparator) {
	
	var listTmp = [];
	var mainTmp = null;
	var oldTmp = null;
	var newTmp = null;
	var compare = 0;
	var pos = 0;
	
	for (var i=0; i < originalList.length; i++){
		mainTmp = originalList[i];
		listTmp.push(mainTmp);
		pos = 0;
		for (var j=0; j< listTmp.length; j++){
			newTmp = listTmp[j];
			compare = comparator.compare(mainTmp, newTmp); 
			if (compare == 1){
				pos++;
			}
		}
		oldTmp = mainTmp;
		for (var j=pos; j < listTmp.length; j++){
			newTmp = listTmp[j];
			listTmp[j] = oldTmp;
			oldTmp = newTmp;
		}
	}
	
	
	return listTmp;
};

function inTab(tableau, value) {
	for (var k = 0; k < tableau.length; k++) {
		if(tableau[k] == value) {
			return k;
		}
	}
	
	return -1;
}

function findObj(tableau, id) {
	var result = null;
	for (var k = 0; k < tableau.length; k++) {
		if(tableau[k].id == id) {
			result =  tableau[k];
			break;
		}
	}
	
	return result;
}

function getShowtimes(showtimes, distance, format){
	
	var horairesFilm = ""; 
	var tableauVersions = [];
	var tabSeancesVers = [];
	var versionExists = -1;
	
	var index = 0;
	
	var chaineHoraires = "";
	var today = new Date();
	var myDate = new Date();
	var stringHour = "";
	var amPm = false;
	var amPmStr = "";
	var hourStr = "";
	var hourInt = 0;
	var minInt = 0;
	var nexShowtime = false;
	
	for (var k = 0; k < showtimes.length; k++) {
		projection = showtimes[k];
		
		// Récupération de l'index de la langue en cours dans le tableau
		versionExists = inTab(tableauVersions,projection.lang);
		
		if(versionExists < 0) {
			tableauVersions.push(projection.lang);
			tabSeancesVers.push("");
			index = (tableauVersions.length)-1;
		} else {
			index = versionExists;
		}
		
		horairesFilm = tabSeancesVers[index];	
		
		if (horairesFilm != "") {
			horairesFilm = horairesFilm + " | ";
		}
		
		myDate.setTime(parseInt(projection.showtime));
		
		
		stringHour = "";
		hourInt = myDate.getHours();
		minInt = myDate.getMinutes();
		if (format == 12){
			if (hourInt > 12){
				amPmStr = "pm";
				hourInt = hourInt % 12;
			}else{
				//amPmStr = "am";
			}			
			hourStr = ":";
		}else{
			hourStr = ":";
			amPmStr = "";
			hourInt = trailZeros(hourInt);
		}
		
		
		// On recalcule la date pour voir si on doit en prendre en compte la distance de temps de trajet
		if (distance != null){
			myDate.setTime(parseInt(projection.showtime) + parseInt(distance));
		}
		
		if (myDate.getTime() < today.getTime()) {
			stringHour = "<span class=\"past_showtime\">" + hourInt + hourStr + trailZeros(minInt) + amPmStr + "</span>";
		}
		else {
			if (!nextShowtime) {
				stringHour = "<span class=\"next_showtime\">" ;
//				if (projection.reservationLink != null && projection.reservationLink != ""){
//					stringHour += "<A HREF='" + projection.reservationLink + "'>"+ hourInt + hourStr + trailZeros(minInt) + amPmStr + "</A>";
//				}else{
					stringHour += hourInt + hourStr + trailZeros(minInt) + amPmStr ;
//				}
				stringHour += "</span>";
				nextShowtime = true;
			}
			else {
//				if (projection.reservationLink != null && projection.reservationLink != ""){
//					stringHour = "<A HREF='" + projection.reservationLink + "'>"+ hourInt + hourStr + trailZeros(minInt) + amPmStr + "</A>";
//				}else{
					stringHour = hourInt + hourStr + trailZeros(minInt) + amPmStr ;
//				}
			}
		}
		
		
		horairesFilm = horairesFilm + stringHour;
		tabSeancesVers[index] = horairesFilm;
	}
	
	for (var k = 0; k < tableauVersions.length; k++) {
		
		if(k > 0) {
			chaineHoraires = chaineHoraires + "<br />";
		}
		
		if (tableauVersions[k] != null && tableauVersions[k] != "null") {
			chaineHoraires = chaineHoraires + "<span class=\"lang_showtime\">" + tableauVersions[k] + " :</span> " + tabSeancesVers[k];
		} else {
			chaineHoraires = chaineHoraires + tabSeancesVers[k];			
		}
	}
	
	return chaineHoraires;
}

function callInProgress (xmlhttp) {
	switch (xmlhttp.readyState) {
		case 1: case 2: case 3:
			return true;
		break;
		// Case 4 and 0
		default:
			return false;
		break;
	}
}

// Paramètre générique des requêtes AJAX, pour la mise en place du timeout
Ajax.Responders.register({
	onCreate: function(request) {
		request['timeoutId'] = window.setTimeout(
			function() {
				// Si au bout du timeout la requete est toujours active alors on est dans un cas de timeOut
				if (callInProgress(request.transport)) {
					// on annule la requete
					request.transport.abort();	
					
					// on indique que c'est un timeout
					timeOut = true;
					
					// on invoque la propriété "onFailure"
					if (request.options['onFailure']) {
						request.options['onFailure'](request.transport, request.json);
					}
				}
			},
			30000 // 10 secondes
		);
	},
	onComplete: function(request) {
		// Si la requete a abouti on enlève le timeout
		window.clearTimeout(request['timeoutId']);
	}
});

function manageEventCode(controller, errorCode){
	//Traitement de l'erreur
	switch (errorCode) {
	case 1:
		// Timout
		controller.showAlertDialog({
			onChoose: function(value) {},
			title: $L("errorMsg"),
			message: $L("msgNoGps"),
			choices:[{label: $L('OK'), value:'OK', type:'color'}]
		});
		break;
	case 2:
		// Pas de position dispo
		controller.showAlertDialog({
			onChoose: function(value) {},
			title: $L("errorMsg"),
			message: $L("msgNoGps"),
			choices:[{label: $L('OK'), value:'OK', type:'color'}]
		});
		
		break;
	case 3:
		// ??? genre une erreur inconnue c'est produit
		break;
	case 5:
		// Service non actif (gps désactivé)
		controller.showAlertDialog({
			onChoose: function(value){
				if(value == 'OK'){
					openPositionService(controller);
				}
			},
			title: $L("gpsInactiveTitle"),
			message: $L("gpsInactiveMsg"),
			choices:[{label: $L('gpsInactiveBtnYes'), value:'OK', type:'color'}	
					,{label: $L('gpsInactiveBtnNo'), value:'KO', type:'color'}
			]
		});	  	
		break;
	case 6:
		//  permission gps non active : service positonnement (préférences accepter)
		controller.showAlertDialog({
			onChoose: function(value){
				if (value == 'OK'){
					openPositionService(controller);
				}
			},
			title: $L("gpsInactiveTitle"),
			message: $L("gpsUnauthorizedMsg"),
			choices:[{label: $L('gpsInactiveBtnYes'), value:'OK', type:'color'}
					,{label: $L('gpsInactiveBtnNo'), value:'KO', type:'color'}
			]
		});	  	
		
		break;
	case 8:
		//  permission gps non active  pour l'application CineShowTime: service positonnement (préférences accepter)
		controller.showAlertDialog({
			onChoose: function(value){
			if (value == 'OK'){
				openPositionService(controller);
			}
		},
		title: $L("gpsInactiveTitle"),
		message: $L("gpsUnauthorizedMsgCineShowTime"),
		choices:[{label: $L('gpsInactiveBtnYes'), value:'OK', type:'color'}
		,{label: $L('gpsInactiveBtnNo'), value:'KO', type:'color'}
		]
		});	  	
	
	break;

	default:
		break;
	}
}

function openPositionService(controller){
	controller.serviceRequest('palm://com.palm.applicationManager', {
		method: 'open',
		parameters: {
			id: 'com.palm.app.location',
			params: {}
		}
	});
}

function parseLinks(str) {
	var  reg=new  RegExp("((http://)[a-zA-Z0-9\-_/.]+)+","gi");
	return str.replace(reg,  "<A href='$1' target=_blank>$1</A>")
}

var weekTab = ["spinnerSunday","spinnerMonday","spinnerTuesday","spinnerWenesday","spinnerThursday","spinnerFriday","spinnerSaturday"];
var timeOut = false;