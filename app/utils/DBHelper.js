function DBHelper(){

	console.log('DBHelper.DBHelper() : Initialisation of DBHelper');
	
	this.nullHandleCount = 0;
	this.db = null;
	this.cst = new CineShowTimeCst();
	
	/* DECLARATION DES CHAMPS */
	this.KEY_THEATER_NAME = "theater_name"; 
	this.KEY_THEATER_PHONE = "phone_number";
	this.KEY_THEATER_ID = "_id";
	
	this.KEY_MOVIE_ID = "_id";
	this.KEY_MOVIE_CID = "cid";
	this.KEY_MOVIE_IMDB_ID = "imdb_id";
	this.KEY_MOVIE_NAME = "movie_name";
	this.KEY_MOVIE_ENGLISH_NAME = "movie_english_name";
	this.KEY_MOVIE_IMG_URL = "url_img";
	this.KEY_MOVIE_WIKIPEDIA_URL = "url_wikipedia";
	this.KEY_MOVIE_IMDB_URL = "url_imdb";
	this.KEY_MOVIE_IMDB_DESC = "imdb_desc";
	this.KEY_MOVIE_DESC = "desc";
	this.KEY_MOVIE_TR_DESC = "trDesc";
	this.KEY_MOVIE_TIME = "movie_time";
	this.KEY_MOVIE_STYLE = "style";
	this.KEY_MOVIE_RATE = "rate";
	this.KEY_MOVIE_LANG = "lang";
	this.KEY_MOVIE_ACTORS = "actors";
	this.KEY_MOVIE_DIRECTORS = "directors";
	
	this.KEY_LOCALISATION_THEATER_ID = "theater_id";
	this.KEY_LOCALISATION_CITY_NAME = "city_name";
	this.KEY_LOCALISATION_COUNTRY_NAME = "country_name";
	this.KEY_LOCALISATION_COUNTRY_CODE = "country_code";
	this.KEY_LOCALISATION_DISTANCE = "distance";
	this.KEY_LOCALISATION_DISTANCE_TIME = "distance_time";
	this.KEY_LOCALISATION_LATITUDE = "latitude";
	this.KEY_LOCALISATION_LONGITUDE = "longitude";
	this.KEY_LOCALISATION_POSTAL_CODE = "postal_code";
	this.KEY_LOCALISATION_SEARCH_QUERY = "search_query";
	
	this.KEY_SHOWTIME_ID = "_id";
	this.KEY_SHOWTIME_THEATER_ID = "theater_id";
	this.KEY_SHOWTIME_MOVIE_ID = "movie_id";
	this.KEY_SHOWTIME_TIME = "showtime";
	this.KEY_SHOWTIME_LANG = "lang";
	this.KEY_SHOWTIME_RESERVATION_URL = "reservation_url";
	
	this.KEY_REQUEST_ID = "_id";
	this.KEY_REQUEST_LATITUDE = "latitude";
	this.KEY_REQUEST_LONGITUDE = "longitude";
	this.KEY_REQUEST_CITY_NAME = "city_name";
	this.KEY_REQUEST_MOVIE_NAME = "movie_name";
	this.KEY_REQUEST_TIME = "time";
	this.KEY_REQUEST_THEATER_ID = "theater_id";
	this.KEY_REQUEST_NEAR_RESP = "near_resp";
	
	this.KEY_FAV_TH_THEATER_ID = "theater_id";
	this.KEY_FAV_TH_THEATER_NAME = "theater_name";
	this.KEY_FAV_TH_THEATER_PLACE = "theater_place_city_name";
	this.KEY_FAV_TH_THEATER_COUNRTY_CODE = "theater_place_counry";
	this.KEY_FAV_TH_THEATER_POSTAL_CODE = "theater_place_postal_code";
	this.KEY_FAV_TH_THEATER_LAT = "theater_place_lat";
	this.KEY_FAV_TH_THEATER_LONG = "theater_place_long";
	
	this.KEY_REVIEW_ID = "_id";
	this.KEY_REVIEW_MOVIE_ID = "movieId";
	this.KEY_REVIEW_AUTHOR = "author";
	this.KEY_REVIEW_SOURCE = "source";
	this.KEY_REVIEW_URL = "url";
	this.KEY_REVIEW_RATE = "rate";
	this.KEY_REVIEW_TEXT = "text";
	
	this.KEY_VERSION_DB = "db_version";
	this.KEY_VERSION_APP = "app_version";
	
	this.KEY_PREFERENCE_KEY = "key";
	this.KEY_PREFERENCE_VALUE = "value";
	
	this.DATABASE_NAME = "CineShowtime";
	this.DATABASE_THEATERS_TABLE = "theaters";
	this.DATABASE_MOVIE_TABLE = "movies";
	this.DATABASE_SHOWTIME_TABLE = "showtimes";
	this.DATABASE_LOCATION_TABLE = "location";
	this.DATABASE_FAV_THEATER_TABLE = "favTheaters";
	this.DATABASE_FAV_SHOWTIME_TABLE = "favShowtimes";
	this.DATABASE_REQUEST_TABLE = "movie_request";
	this.DATABASE_REVIEW_TABLE = "reviews";
	this.DATABASE_VERSION_TABLE = "versions";
	this.DATABASE_PREFERENCES_TABLE = "preferences";
	
	this.DATABASE_VERSION_PALM = 1;
	this.DATABASE_VERSION = 25;
	
	
	/* CREATE SCRIPTS*/
	
	this.DATABASE_CREATE_THEATER_TABLE = null;
	this.DATABASE_CREATE_FAV_THEATER_TABLE = null;
	this.DATABASE_CREATE_MOVIE_TABLE = null;
	this.DATABASE_CREATE_SHOWTIME_TABLE = null;
	this.DATABASE_CREATE_LOCATION_TABLE = null;
	this.DATABASE_CREATE_REQUEST_TABLE = null;
	this.DATABASE_CREATE_REVIEWS_TABLE = null;
	this.DATABASE_CREATE_VERSION_TABLE = null;
	this.DATABASE_CREATE_PREFERENCES_TABLE = null;
	
	/* DROP SCRIPTS */
	this.DROP_THEATER_TABLE = null;
	this.DROP_FAV_THEATER_TABLE = null;
	this.DROP_MOVIE_TABLE = null;
	this.DROP_SHOWTIME_TABLE = null;
	this.DROP_LOCATION_TABLE = null;
	this.DROP_REQUEST_TABLE = null;
	this.DROP_REVIEWS_TABLE = null;
	this.DROP_VERSION_TABLE = null;
	this.DROP_PREFERENCES_TABLE = null;
	
	/*INSERT SCRIPTS*/
	
	this.DATABASE_INSERT_THEATERS = null;
	this.DATABASE_INSERT_LOCALISATION = null;
	this.DATABASE_INSERT_MOVIES = null;
	this.DATABASE_INSERT_SHOWTIMES = null;
	this.DATABASE_INSERT_REQUEST = null;
	this.DATABASE_INSERT_REVIEWS = null;
	this.DATABASE_INSERT_VERSION = null;
	this.DATABASE_INSERT_PREFERENCES = null;
	
	/* CLEAR SCRIPT */
	
	this.DELETE_ALL_THEATERS = null;
	this.DELETE_ALL_MOVIES = null;
	this.DELETE_ALL_LOCATIONS = null;
	this.DELETE_ALL_SHOWTIMES = null;
	this.DELETE_OLD_REQUEST = null;
	this.DELETE_REQUEST_FROM_TIME = null;
	this.DELETE_MOVIE = null;
	this.DELETE_MOVIE_REVIEWS = null;
	this.DELETE_FAV_THEATER = null;
	this.DELETE_VERSION = null;
	this.DELETE_PREFERENCE = null;
	
	/* REQUEST SCRIPTS */
	
	this.EXTRACT_ALL_THEATERS = null;
	this.EXTRACT_THEATER_FROM_ID = null;
	this.EXTRACT_ALL_MOVIES = null;
	this.EXTRACT_MOVIE_FULL = null;
	this.EXTRACT_SHOWTIME_FROM_THEATER = null;
	this.EXTRACT_REQUEST = null;
	this.EXTRACT_LAST_REQUEST = null;
	this.EXTRACT_FAV = null;
	this.EXTRACT_REVIEWS = null;
	this.EXTRACT_VERSIONS = null;
	this.EXTRACT_PREFERENCES = null;
	this.EXTRACT_PREFERENCE_VALUE = null;
	
	this.callBackMethodInit = null;
};



/* UTILS METHODS */

DBHelper.prototype.removeQuotes = function(value){
	var result = null;
	if (value != null){
		value = ""+value;
		result = value.substring(1,value.length-1);
	}
	return result;
};

DBHelper.prototype.addQuotes = function(value){
	if (value != null){
		value = "'"+value+"'";
	}
	return value;
};

/* Init the database and create the table if don't exists*/
DBHelper.prototype.initDataBase = function (onSucess) {
	try {
		//Data base will have 1M
		if (this.cst.LOG_DEBUG){
			console.log('DBHelper.initDataBase : Initialisation of data base');
		}
		this.db = openDatabase(this.DATABASE_NAME, this.DATABASE_VERSION_PALM, 'CineShowTime Data Store', 1024000);		
		this.callBackMethodInit = onSucess;
			
		/*
		Database creation sql statement
		*/
		this.DATABASE_CREATE_THEATER_TABLE = "create table if not exists " + this.DATABASE_THEATERS_TABLE
		+ " (" + this.KEY_THEATER_ID + " text primary key"
		+ ", " + this.KEY_THEATER_NAME + " text not null" 
		+ ", " + this.KEY_THEATER_PHONE + " text" 
		+ "); GO;";
		this.DATABASE_CREATE_FAV_THEATER_TABLE = "create table if not exists " + this.DATABASE_FAV_THEATER_TABLE
		+ " (" + this.KEY_FAV_TH_THEATER_ID + " text primary key"
		+ ", " + this.KEY_FAV_TH_THEATER_NAME + " text not null" 
		+ ", " + this.KEY_FAV_TH_THEATER_PLACE + " text " 
		+ ", " + this.KEY_FAV_TH_THEATER_COUNRTY_CODE + " text " 
		+ ", " + this.KEY_FAV_TH_THEATER_POSTAL_CODE + " text " 
		+ ", " + this.KEY_FAV_TH_THEATER_LAT + " double " 
		+ ", " + this.KEY_FAV_TH_THEATER_LONG + " double " 
		+ "); GO;";
		this.DATABASE_CREATE_MOVIE_TABLE = " create table if not exists " + this.DATABASE_MOVIE_TABLE
		+ " (" + this.KEY_MOVIE_ID + " text primary key"
		+ ", " + this.KEY_MOVIE_CID + " text" 
		+ ", " + this.KEY_MOVIE_IMDB_ID + " text" 
		+ ", " + this.KEY_MOVIE_NAME + " text not null" 
		+ ", " + this.KEY_MOVIE_ENGLISH_NAME + " text" 
		+ ", " + this.KEY_MOVIE_IMDB_DESC + " integer" 
		+ ", " + this.KEY_MOVIE_DESC + " text" 
		+ ", " + this.KEY_MOVIE_TR_DESC + " text" 
		+ ", " + this.KEY_MOVIE_IMG_URL + " text" 
		+ ", " + this.KEY_MOVIE_WIKIPEDIA_URL + " text" 
		+ ", " + this.KEY_MOVIE_IMDB_URL + " text" 
		+ ", " + this.KEY_MOVIE_LANG + " text" 
		+ ", " + this.KEY_MOVIE_STYLE + " text" 
		+ ", " + this.KEY_MOVIE_RATE + " double" 
		+ ", " + this.KEY_MOVIE_TIME + " long" 
		+ ", " + this.KEY_MOVIE_ACTORS + " text" 
		+ ", " + this.KEY_MOVIE_DIRECTORS + " text" 
		+ "); GO;";
		this.DATABASE_CREATE_SHOWTIME_TABLE = " create table if not exists " + this.DATABASE_SHOWTIME_TABLE
		+ " (" + this.KEY_SHOWTIME_ID + " integer primary key autoincrement"
		+ ", " + this.KEY_SHOWTIME_MOVIE_ID + " text not null" 
		+ ", " + this.KEY_SHOWTIME_THEATER_ID + " text not null" 
		+ ", " + this.KEY_SHOWTIME_TIME + " long not null" 
		+ ", " + this.KEY_SHOWTIME_LANG + " text " 
		+ ", " + this.KEY_SHOWTIME_RESERVATION_URL + " text " 
		+ "); GO;";
		this.DATABASE_CREATE_LOCATION_TABLE = " create table if not exists " + this.DATABASE_LOCATION_TABLE
		+ " (" + this.KEY_LOCALISATION_THEATER_ID + " text primary key"
		+ ", " + this.KEY_LOCALISATION_CITY_NAME + " text " 
		+ ", " + this.KEY_LOCALISATION_COUNTRY_NAME + " text " 
		+ ", " + this.KEY_LOCALISATION_COUNTRY_CODE + " text " 
		+ ", " + this.KEY_LOCALISATION_POSTAL_CODE + " text " 
		+ ", " + this.KEY_LOCALISATION_DISTANCE + " float " 
		+ ", " + this.KEY_LOCALISATION_DISTANCE_TIME + " long " 
		+ ", " + this.KEY_LOCALISATION_LATITUDE + " double " 
		+ ", " + this.KEY_LOCALISATION_LONGITUDE + " double " 
		+ ", " + this.KEY_LOCALISATION_SEARCH_QUERY + " text " 
		+ "); GO;";
		this.DATABASE_CREATE_REQUEST_TABLE = " create table if not exists " + this.DATABASE_REQUEST_TABLE
		+ " (" + this.KEY_REQUEST_ID + " integer primary key autoincrement"
		+ ", " + this.KEY_REQUEST_CITY_NAME + " text " 
		+ ", " + this.KEY_REQUEST_MOVIE_NAME + " text " 
		+ ", " + this.KEY_REQUEST_THEATER_ID + " text " 
		+ ", " + this.KEY_REQUEST_LATITUDE + " double " 
		+ ", " + this.KEY_REQUEST_LONGITUDE + " double " 
		+ ", " + this.KEY_REQUEST_TIME + " long " 
		+ ", " + this.KEY_REQUEST_NEAR_RESP + " integer " 
		+ "); GO;";
		this.DATABASE_CREATE_REVIEWS_TABLE = " create table if not exists " + this.DATABASE_REVIEW_TABLE
		+ " (" + this.KEY_REVIEW_ID + " integer primary key autoincrement"
		+ ", " + this.KEY_REVIEW_MOVIE_ID + " text " 
		+ ", " + this.KEY_REVIEW_AUTHOR + " text " 
		+ ", " + this.KEY_REVIEW_SOURCE + " text " 
		+ ", " + this.KEY_REVIEW_URL + " text " 
		+ ", " + this.KEY_REVIEW_RATE + " double " 
		+ ", " + this.KEY_REVIEW_TEXT + " text " 
		+ "); GO;";
		this.DATABASE_CREATE_VERSION_TABLE = " create table if not exists " + this.DATABASE_VERSION_TABLE
		+ " (" + this.KEY_VERSION_DB + " integer primary key"
		+ ", " + this.KEY_VERSION_APP + " integer " 
		+ "); GO;";
		this.DATABASE_CREATE_PREFERENCES_TABLE = " create table if not exists " + this.DATABASE_PREFERENCES_TABLE
		+ " (" + this.KEY_PREFERENCE_KEY + " text primary key"
		+ ", " + this.KEY_PREFERENCE_VALUE + " text not null " 
		+ "); GO;";
		
		/* DECLARATION DES SUPPRESSIONS DE TABLES */
		this.DROP_THEATER_TABLE = "DROP TABLE IF EXISTS " + this.DATABASE_THEATERS_TABLE+"; GO;";
		this.DROP_FAV_THEATER_TABLE = "DROP TABLE IF EXISTS " + this.DATABASE_FAV_THEATER_TABLE+"; GO;";
		this.DROP_MOVIE_TABLE = "DROP TABLE IF EXISTS " + this.DATABASE_MOVIE_TABLE+"; GO;";
		this.DROP_SHOWTIME_TABLE = "DROP TABLE IF EXISTS " + this.DATABASE_SHOWTIME_TABLE+"; GO;";
		this.DROP_LOCATION_TABLE = "DROP TABLE IF EXISTS " + this.DATABASE_LOCATION_TABLE+"; GO;";
		this.DROP_REQUEST_TABLE = "DROP TABLE IF EXISTS " + this.DATABASE_REQUEST_TABLE+"; GO;";
		this.DROP_REQVIEWS_TABLE = "DROP TABLE IF EXISTS " + this.DATABASE_REVIEW_TABLE+"; GO;";
		this.DROP_VERSION_TABLE = "DROP TABLE IF EXISTS " + this.DATABASE_VERSION_TABLE+"; GO;";
		this.DROP_PREFERENCES_TABLE = "DROP TABLE IF EXISTS " + this.DATABASE_PREFERENCES_TABLE+"; GO;";
	
		this.createTableDataBase(this.DATABASE_CREATE_VERSION_TABLE, this.DATABASE_VERSION_TABLE);
		
		this.extractVersionDataBase(this.callBackVersions.bind(this));
	}
	catch (e)
	{
		console.log('DBHelper.initDataBase : Error during initDataBase : '+e.message);
	}
};


/* Drop all tables of data base */
DBHelper.prototype.cleanDataBase = function () {
	//Data base will have 1M
	if (this.cst.LOG_DEBUG){
		console.log('DBHelper.cleanDataBase');
	}
	try {
		
		//create table theaters
		this.dropTableDataBase(this.DROP_THEATER_TABLE, this.DATABASE_THEATERS_TABLE);
		this.dropTableDataBase(this.DROP_MOVIE_TABLE, this.DATABASE_MOVIE_TABLE);
		this.dropTableDataBase(this.DROP_FAV_THEATER_TABLE, this.DATABASE_FAV_THEATER_TABLE);
		this.dropTableDataBase(this.DROP_SHOWTIME_TABLE, this.DATABASE_SHOWTIME_TABLE);
		this.dropTableDataBase(this.DROP_LOCATION_TABLE, this.DATABASE_LOCATION_TABLE);
		this.dropTableDataBase(this.DROP_REQUEST_TABLE, this.DATABASE_REQUEST_TABLE);
		this.dropTableDataBase(this.DROP_REVIEWS_TABLE, this.DATABASE_REVIEW_TABLE);
		this.dropTableDataBase(this.DROP_VERSION_TABLE, this.DATABASE_VERSION_TABLE);
		this.dropTableDataBase(this.DROP_PREFERENCES_TABLE, this.DATABASE_PREFERENCES_TABLE);
		
	}
	catch (e)
	{
		console.log('DBHelper.cleanDataBase : Error during cleanDataBase : '+e.message);
	}	
};


/* Function for creation of table */
DBHelper.prototype.createTableDataBase = function (scriptCreation, tableName) {
	this.nullHandleCount = 0;
	var dbTmp = this;
	this.db.transaction( 
	        (function (transaction) { 
	            transaction.executeSql(scriptCreation
	            		, []
	            		, function(transaction, result){
	            			if (dbTmp.cst.LOG_DEBUG){
	            				console.log('DBHelper.createTableDataBase : table created ! '+tableName);
	            			}
	            			return true;
	            		}
			            , function(transaction, error) { 
		                    console.log('DBHelper.createTableDataBase : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptCreation); 
		                    return true;
		                }); 
	        }).bind(this) 
	    );
};

/* Function for deletion of table */
DBHelper.prototype.dropTableDataBase = function (scriptDrop, tableName) {
	this.nullHandleCount = 0;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(scriptDrop
						, []
						, function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.dropTableDataBase : table drop ! '+tableName);
							}
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.dropTableDataBase : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptDrop); 
							return true;
						}); 
			}).bind(this) 
	);
};

/* INSERT METHOD */

DBHelper.prototype.insertTheater = function (theater) {
	this.nullHandleCount = 0;
	var id = this.addQuotes(theater.id);
	var theaterName = this.addQuotes(theater.theaterName);
	var phoneNumber = this.addQuotes(theater.phoneNumber);
	
	//Insert localisation
	if (theater.place != null){
		this.insertLocalisation(theater, theater.place);
	}
	
	if (this.DATABASE_INSERT_THEATERS == null){
		this.DATABASE_INSERT_THEATERS = "INSERT INTO " + this.DATABASE_THEATERS_TABLE
			+ " (" + this.KEY_THEATER_ID 
			+ ", " + this.KEY_THEATER_NAME  
			+ ", " + this.KEY_THEATER_PHONE  
			+ ") VALUES (?,?,?); GO;";
	}
	var request = this.DATABASE_INSERT_THEATERS;
	var dbTmp = this;
	this.db.transaction( 
        (function (transaction) { 
            transaction.executeSql(request
            		, [id,theaterName, phoneNumber]
                    , function(transaction, result){
            			if (dbTmp.cst.LOG_DEBUG){
            				console.log('DBHelper.insertTheater : Theater created '+theaterName);
            			}
		            	return true;
            		}
                    , function(transaction, error) { 
                        console.log('DBHelper.insertTheater : Error was '+error.message+' (Code '+error.code+')'+' | theater : '+theaterName+', request : '+request); 
                        return true;
                    }); 
        }).bind(this) 
    ); 
};

DBHelper.prototype.insertFavTheater = function (theater) {
	this.nullHandleCount = 0;
	var id = this.addQuotes(theater.id);
	var theaterName = this.addQuotes(theater.theaterName);
	var place = null;
	var countryCode = null;
	var postalCode = null;
	var latitude = null;
	var longitude = null;
	if (theater.place != null){
		place = this.addQuotes(theater.place.cityName);
		countryCode = this.addQuotes(theater.place.countryNameCode);
		postalCode = this.addQuotes(theater.place.postalCityNumber);
		latitude = theater.place.latitude;
		longitude = theater.place.longitude;
	}
	
	if (this.DATABASE_INSERT_FAV_THEATERS == null){
		this.DATABASE_INSERT_FAV_THEATERS = "INSERT INTO " + this.DATABASE_FAV_THEATER_TABLE
		+ " (" + this.KEY_FAV_TH_THEATER_ID 
		+ ", " + this.KEY_FAV_TH_THEATER_NAME  
		+ ", " + this.KEY_FAV_TH_THEATER_PLACE  
		+ ", " + this.KEY_FAV_TH_THEATER_COUNRTY_CODE  
		+ ", " + this.KEY_FAV_TH_THEATER_POSTAL_CODE  
		+ ", " + this.KEY_FAV_TH_THEATER_LAT  
		+ ", " + this.KEY_FAV_TH_THEATER_LONG  
		+ ") VALUES (?,?,?,?,?,?,?); GO;"; 
	}
	var request = this.DATABASE_INSERT_FAV_THEATERS;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [id,theaterName,place,countryCode,postalCode,latitude,longitude]
						   , function(transaction, result){
								if (dbTmp.cst.LOG_DEBUG){
									console.log('DBHelper.insertFavTheater : Theater Fav created '+theaterName);
								}
								return true;
							}
							, function(transaction, error) { 
								console.log('DBHelper.insertFavTheater : Error was '+error.message+' (Code '+error.code+')'+' | theater : '+theaterName+', request : '+request); 
								return true;
							}); 
			}).bind(this) 
	); 
};


DBHelper.prototype.insertMovie = function (movie) {
	this.nullHandleCount = 0;
	var movieId = this.addQuotes(movie.id);
	var cid = this.addQuotes(movie.cid);
	var imdbId = this.addQuotes(movie.imdbId);
	var name = this.addQuotes(movie.movieName);
	var englishName = this.addQuotes(movie.englishMovieName);
	var imdbDesc = 0;
	if (movie.imdbDesrciption != null && movie.imdbDesrciption == true){
		imdbDesc = 1;
	}
	var desc = this.addQuotes(movie.description);
	var trDesc = this.addQuotes(movie.trDescription);
	var imgUrl = this.addQuotes(movie.urlImg);
	var wikipediaUrl = this.addQuotes(movie.urlWikipedia);
	var imdbUrl = this.addQuotes(movie.urlImdb);
	var lang = this.addQuotes(movie.lang);
	var style = this.addQuotes(movie.style);
	var rate = movie.rate;
	var time = movie.movieTime;
	var actors = this.addQuotes(movie.actorList);
	var directors = this.addQuotes(movie.directorList);
	
	if (this.DATABASE_INSERT_MOVIES == null){
		this.DATABASE_INSERT_MOVIES = " INSERT INTO " + this.DATABASE_MOVIE_TABLE
		+ " (" + this.KEY_MOVIE_ID 
		+ ", " + this.KEY_MOVIE_CID  
		+ ", " + this.KEY_MOVIE_IMDB_ID  
		+ ", " + this.KEY_MOVIE_NAME  
		+ ", " + this.KEY_MOVIE_ENGLISH_NAME  
		+ ", " + this.KEY_MOVIE_IMDB_DESC  
		+ ", " + this.KEY_MOVIE_DESC  
		+ ", " + this.KEY_MOVIE_TR_DESC  
		+ ", " + this.KEY_MOVIE_IMG_URL  
		+ ", " + this.KEY_MOVIE_WIKIPEDIA_URL  
		+ ", " + this.KEY_MOVIE_IMDB_URL  
		+ ", " + this.KEY_MOVIE_LANG  
		+ ", " + this.KEY_MOVIE_STYLE  
		+ ", " + this.KEY_MOVIE_RATE  
		+ ", " + this.KEY_MOVIE_TIME  
		+ ", " + this.KEY_MOVIE_ACTORS  
		+ ", " + this.KEY_MOVIE_DIRECTORS  
		+ ") VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); GO;";
		
	}
	
	//We remove the movie before inserting 	
	this.removeMovie(movie);
	
	// We have to manage insert of reviews 
	if (movie.reviews != null){
		for (var i = 0; i < movie.reviews.length; i++){
			this.insertReview(movie.reviews[i]);
		}
	}
	var request = this.DATABASE_INSERT_MOVIES;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [movieId,cid,imdbId,name,englishName,imdbDesc,desc,trDesc,imgUrl,wikipediaUrl, imdbUrl,lang,style,rate,time,actors,directors]
						, function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.insertMovie : Movie created '+name + ', movie time : ' + time);
							}
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.insertMovie : Error was '+error.message+' (Code '+error.code+')'+' | request : '+request); 
							return true;
						}); 
			}).bind(this) 
	); 
};

DBHelper.prototype.insertShowTime = function (theater, movie, projection) {
	this.nullHandleCount = 0;
	var theaterId = this.addQuotes(theater.id);
	var movieId = this.addQuotes(movie.id);
	var time = projection.showtime;
	var lang = this.addQuotes(projection.lang);
	var url = this.addQuotes(projection.reservationLink);
	
	if (this.DATABASE_INSERT_SHOWTIMES == null){
		this.DATABASE_INSERT_SHOWTIMES = " INSERT INTO " + this.DATABASE_SHOWTIME_TABLE
			+ " (" + this.KEY_SHOWTIME_MOVIE_ID  
			+ ", " + this.KEY_SHOWTIME_THEATER_ID  
			+ ", " + this.KEY_SHOWTIME_TIME  
			+ ", " + this.KEY_SHOWTIME_LANG  
			+ ", " + this.KEY_SHOWTIME_RESERVATION_URL  
			+ ") VALUES(?,?,?,?,?); GO;"; 
	}
	
	var request = this.DATABASE_INSERT_SHOWTIMES;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [movieId,theaterId,time,lang,url]
						, function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.insertShowTime : ShowTime created '+theater.theaterName+' movie : '+movie.movieName+' time : '+projection.showtime);
							}
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.insertShowTime : Error was '+error.message+' (Code '+error.code+')'+' | request : '+request); 
							return true;
						}); 
			}).bind(this) 
	); 
};

DBHelper.prototype.insertLocalisation = function (theater, localisation) {
	this.nullHandleCount = 0;
	var theaterId = this.addQuotes(theater.id);
	var cityName = this.addQuotes(localisation.cityName);
	var countryName = this.addQuotes(localisation.countryName);
	var countryCode = this.addQuotes(localisation.countryNameCode);
	var postalCode = this.addQuotes(localisation.postalCityNumber);
	var distance = localisation.distance;
	var distanceTime = localisation.distanceTime;
	var latitude = localisation.latitude;
	var longitude = localisation.longitude;
	var searchQuery = this.addQuotes(localisation.searchQuery);
	
	if (this.DATABASE_INSERT_LOCALISATION == null){
		this.DATABASE_INSERT_LOCALISATION = " INSERT INTO " + this.DATABASE_LOCATION_TABLE
			+ " (" + this.KEY_LOCALISATION_THEATER_ID 
			+ ", " + this.KEY_LOCALISATION_CITY_NAME  
			+ ", " + this.KEY_LOCALISATION_COUNTRY_NAME  
			+ ", " + this.KEY_LOCALISATION_COUNTRY_CODE  
			+ ", " + this.KEY_LOCALISATION_POSTAL_CODE  
			+ ", " + this.KEY_LOCALISATION_DISTANCE  
			+ ", " + this.KEY_LOCALISATION_DISTANCE_TIME  
			+ ", " + this.KEY_LOCALISATION_LATITUDE  
			+ ", " + this.KEY_LOCALISATION_LONGITUDE  
			+ ", " + this.KEY_LOCALISATION_SEARCH_QUERY  
			+ ") VALUES(?,?,?,?,?,?,?,?,?,?); GO;";
	}
	
	var request = this.DATABASE_INSERT_LOCALISATION;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [theaterId,cityName,countryName,countryCode,postalCode,distance,distanceTime,latitude,longitude,searchQuery]
						, function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.insertLocalisation : Localisation created '+theaterId);
							}
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.insertLocalisation : Error was '+error.message+' (Code '+error.code+')'+' | request : '+request); 
							return true;
						}
						); 
			}).bind(this) 
	); 
};

DBHelper.prototype.insertSearchRequest = function (requestBean) {
	this.nullHandleCount = 0;
	var theaterId = this.addQuotes(requestBean.theaterId);
	var movieName = this.addQuotes(requestBean.movieName);
	var cityName = this.addQuotes(requestBean.cityName);
	var latitude = requestBean.latitude;
	var longitude = requestBean.longitude;
	var time = requestBean.time;
	var nearResp = requestBean.nearResp;
	if ((nearResp == null) || (nearResp == true) || (nearResp == 'true')){
		nearResp = 1;
	}else{
		nearResp = 0;
	}
	
	if (this.DATABASE_INSERT_REQUEST == null){
		this.DATABASE_INSERT_REQUEST = " INSERT INTO " + this.DATABASE_REQUEST_TABLE
			+ " (" + this.KEY_REQUEST_CITY_NAME  
			+ ", " + this.KEY_REQUEST_MOVIE_NAME  
			+ ", " + this.KEY_REQUEST_THEATER_ID  
			+ ", " + this.KEY_REQUEST_LATITUDE  
			+ ", " + this.KEY_REQUEST_LONGITUDE  
			+ ", " + this.KEY_REQUEST_TIME  
			+ ", " + this.KEY_REQUEST_NEAR_RESP 
			+ ") VALUES(?,?,?,?,?,?,?); GO;";
	}
	
	// We first remove old request
	this.clearRequest();
	
	var request = this.DATABASE_INSERT_REQUEST;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [cityName,movieName,theaterId,latitude,longitude,time, nearResp]
						, function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.insertSearchRequest : Search request created ');
							}
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.insertSearchRequest : Error was '+error.message+' (Code '+error.code+')'+' | request : '+request); 
							return true;
						}); 
			}).bind(this) 
	); 
};

DBHelper.prototype.updateSearchRequest = function (requestBean) {
	this.nullHandleCount = 0;
	var time = requestBean.time;
	var nearResp = requestBean.nearResp;
	if ((nearResp == null) || (nearResp == true) || (nearResp == 'true')){
		nearResp = 1;
	}else{
		nearResp = 0;
	}
	
	if (this.DATABASE_DELETE_REQUEST_FROM_TIME == null){
		this.DATABASE_DELETE_REQUEST_FROM_TIME = " DELETE FROM " + this.DATABASE_REQUEST_TABLE
			+ " WHERE " + this.KEY_REQUEST_TIME + " = ? ;GO;";
	}
	
	
	var request = this.DATABASE_DELETE_REQUEST_FROM_TIME;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [time]
						, function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.updateSearchRequest : Search request updated ');
							}
							dbTmp.insertSearchRequest(requestBean);
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.updateSearchRequest : Error was '+error.message+' (Code '+error.code+')'+' | request : '+request); 
							return true;
						}); 
			}).bind(this) 
	); 
};


DBHelper.prototype.insertVersion = function (appVersion) {
	this.nullHandleCount = 0;
	var dbVersion = parseInt(this.DATABASE_VERSION);
	var appVersionInsert = 0;
	if (appVersion != null){
		appVersionInsert = appVersion;
	}
	
	if (this.DATABASE_INSERT_VERSION == null){
		this.DATABASE_INSERT_VERSION = " INSERT INTO " + this.DATABASE_VERSION_TABLE
			+ " (" + this.KEY_VERSION_DB 
			+ ", " + this.KEY_VERSION_APP  
			+ ") VALUES(?,?); GO;"; 
	}
	
	var request = this.DATABASE_INSERT_VERSION;
	
	this.clearVersion();
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [dbVersion, appVersionInsert]
						, function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.insertVersion : version created ');
							}
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.insertVersion : Error was '); 
							return true;
						}); 
			}).bind(this) 
	); 
};

DBHelper.prototype.insertReview = function (review) {
	this.nullHandleCount = 0;
	var movieId = this.addQuotes(review.movieId);
	var author = this.addQuotes(review.author);
	var source = this.addQuotes(review.source);
	var url = this.addQuotes(review.urlReview);
	var rate = review.rate;
	var text = this.addQuotes(review.text);
	
	if (this.DATABASE_INSERT_REVIEWS == null){
		this.DATABASE_INSERT_REVIEWS = " INSERT INTO " + this.DATABASE_REVIEW_TABLE
		+ " (" + this.KEY_REVIEW_MOVIE_ID 
		+ ", " + this.KEY_REVIEW_AUTHOR  
		+ ", " + this.KEY_REVIEW_SOURCE  
		+ ", " + this.KEY_REVIEW_URL  
		+ ", " + this.KEY_REVIEW_RATE
		+ ", " + this.KEY_REVIEW_TEXT
		+ ") VALUES(?,?,?,?,?,?); GO;"; 
	}
	
	var request = this.DATABASE_INSERT_REVIEWS;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [movieId, author, source, url, rate, text]
						, function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.insertReview : review created ');
							}
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.insertReview : Error was '); 
							return true;
						}); 
			}).bind(this) 
	); 
};

DBHelper.prototype.insertPreference = function (key, value) {
	this.nullHandleCount = 0;
	var keyTmp = this.addQuotes(key);
	var valueTmp = this.addQuotes(value);
	
	if (this.DATABASE_INSERT_PREFERENCES == null){
		this.DATABASE_INSERT_PREFERENCES = " INSERT INTO " + this.DATABASE_PREFERENCES_TABLE
		+ " (" + this.KEY_PREFERENCE_KEY
		+ ", " + this.KEY_PREFERENCE_VALUE  
		+ ") VALUES(?,?); GO;"; 
	}
	
	var request = this.DATABASE_INSERT_PREFERENCES;
	
	this.removePreference(key);
	
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [keyTmp, valueTmp]
						, function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.insertPreference : preference created '+key+', value : '+value);
							}
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.insertPreference : Error was '+error.message); 
							return true;
						}); 
			}).bind(this) 
	); 
};

/* CLEAR METHODS*/


DBHelper.prototype.removeMovie = function (movie) {
	this.nullHandleCount = 0;
	
	if (this.DELETE_MOVIE == null){
		this.DELETE_MOVIE = 'DELETE FROM '+this.DATABASE_MOVIE_TABLE
		+' WHERE '+this.KEY_MOVIE_ID+' = ?'
		+';GO;';
	}
	
	var request = this.DELETE_MOVIE;
	var mId = this.addQuotes(movie.id);
	//Call remove of reviews of movie
	this.removeMovieReviews(movie);
	
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [mId]
						,function(transaction, results){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.removeMovie :  movie was removed.');
							}
						}
						, this.errorHandler.bind(this)
					); 
			}).bind(this) 
	);
};

DBHelper.prototype.removeMovieReviews = function (movie) {
	this.nullHandleCount = 0;
	
	if (this.DELETE_MOVIE_REVIEWS == null){
		this.DELETE_MOVIE_REVIEWS = 'DELETE FROM '+this.DATABASE_REVIEW_TABLE
		+' WHERE '+this.KEY_REVIEW_MOVIE_ID+' = ?'
		+';GO;';
	}
	
	var request = this.DELETE_MOVIE_REVIEWS;
	var mId = this.addQuotes(movie.id);
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [mId]
						   ,function(transaction, results){
								if (dbTmp.cst.LOG_DEBUG){
									console.log('DBHelper.removeMovieReviews :  reviews was removed.');
								}
							}
							, this.errorHandler.bind(this)
							); 
			}).bind(this) 
	);
};

DBHelper.prototype.removePreference = function (key) {
	this.nullHandleCount = 0;
	
	if (this.DELETE_PREFERENCE == null){
		this.DELETE_PREFERENCE = 'DELETE FROM '+this.DATABASE_PREFERENCES_TABLE
		+' WHERE '+this.KEY_PREFERENCE_KEY+' = ?'
		+';GO;';
	}
	
	var request = this.DELETE_PREFERENCE;
	var keyTmp = this.addQuotes(key);
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [keyTmp]
						,function(transaction, results){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.removePreference :  reviews was removed.');
							}
						}
						, this.errorHandler.bind(this)
						); 
			}).bind(this) 
	);
};

DBHelper.prototype.clearVersion = function () {
	this.nullHandleCount = 0;
	
	if (this.DELETE_VERSION == null){
		this.DELETE_VERSION = 'DELETE FROM '+this.DATABASE_VERSION_TABLE
		+';GO;';
	}
	
	var request = this.DELETE_VERSION;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, []
						   ,function(transaction, results){
								if (dbTmp.cst.LOG_DEBUG){
									console.log('DBHelper.clearVersion : version was removed.');
								}
							}
							, this.errorHandler.bind(this)
							); 
			}).bind(this) 
	);
};

DBHelper.prototype.clearRequest = function () {
	this.nullHandleCount = 0;
	
	if (this.DELETE_OLD_REQUEST == null){
		this.DELETE_OLD_REQUEST = 'DELETE FROM '+this.DATABASE_REQUEST_TABLE
		+' WHERE '+this.KEY_REQUEST_TIME+' < ?'
		+';GO;';
	}
	
	var request = this.DELETE_OLD_REQUEST;
	var date = new Date();
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [date.getTime()]
						,function(transaction, results){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.clearRequest : old request were removed.');
							}
						}
						, this.errorHandler.bind(this)
						); 
			}).bind(this) 
	);
};

DBHelper.prototype.clearTheaters = function (onSucess) {
	this.nullHandleCount = 0;
	
	if (this.DELETE_ALL_THEATERS == null){
		this.DELETE_ALL_THEATERS = 'DELETE FROM '+this.DATABASE_THEATERS_TABLE+';'
			+'GO;';
	}
	
	var request = this.DELETE_ALL_THEATERS;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, []
						,function(transaction, results){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.clearTheaters : All data were removed. '+results.rowsAffected);
							}
							dbTmp.clearLocations(onSucess);
						}
						, this.errorHandler.bind(this)
					); 
			}).bind(this) 
	);
};
DBHelper.prototype.clearLocations = function (onSucess) {
	this.nullHandleCount = 0;
	
	if (this.DELETE_ALL_LOCATIONS == null){
		this.DELETE_ALL_LOCATIONS = 'DELETE FROM '+this.DATABASE_LOCATION_TABLE+';'
		+'GO;';
	}
	
	var request = this.DELETE_ALL_LOCATIONS;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, []
						   ,function(transaction, results){
								if (dbTmp.cst.LOG_DEBUG){
									console.log('DBHelper.clearLocations : All data were removed. '+results.rowsAffected);
								}
								dbTmp.clearMovies(onSucess);
							}
							, this.errorHandler.bind(this)
							); 
			}).bind(this) 
	);
};

DBHelper.prototype.clearMovies = function (onSucess) {
	this.nullHandleCount = 0;
	
	if (this.DELETE_ALL_MOVIES == null){
		this.DELETE_ALL_MOVIES = 'DELETE FROM '+this.DATABASE_MOVIE_TABLE+';'
		+'GO;';
	}
	
	var request = this.DELETE_ALL_MOVIES;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, []
						   ,function(transaction, results){
								if (dbTmp.cst.LOG_DEBUG){
									console.log('DBHelper.clearMovies : All data were removed. '+results.rowsAffected);
								}
								dbTmp.clearShowTimes(onSucess);
							}
							, this.errorHandler.bind(this)
							); 
			}).bind(this) 
	);
};
DBHelper.prototype.clearShowTimes = function (onSucess) {
	this.nullHandleCount = 0;
	
	if (this.DELETE_ALL_SHOWTIMES == null){
		this.DELETE_ALL_SHOWTIMES = 'DELETE FROM '+this.DATABASE_SHOWTIME_TABLE+';'
		+'GO;';
	}
	
	var request = this.DELETE_ALL_SHOWTIMES;
	
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, []
						   ,function(transaction, results){
								if (dbTmp.cst.LOG_DEBUG){
									console.log('DBHelper.clearShowTimes : All data were removed. '+results.rowsAffected);
								}
								onSucess();
							}
							, this.errorHandler.bind(this)
							); 
			}).bind(this) 
	);
};

DBHelper.prototype.removeFavTheater = function (theater) {
	this.nullHandleCount = 0;
	
	var thId = this.addQuotes(theater.id);
	if (this.DELETE_FAV_THEATER == null){
		this.DELETE_FAV_THEATER = 'DELETE FROM '+this.DATABASE_FAV_THEATER_TABLE
						+' WHERE '+this.KEY_FAV_TH_THEATER_ID+' = ? '
						+';GO;';
	}
	
	var request = this.DELETE_FAV_THEATER;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [thId]
						,function(transaction, results){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.removeFavTheater.');
							}
						}
						, this.errorHandler.bind(this)
						); 
					}).bind(this) 
	);
};

/* REQUEST METHODS */

DBHelper.prototype.extractTheater = function (onSucess) {
	this.nullHandleCount = 0;
	// Query table1
	if (this.EXTRACT_ALL_THEATERS == null){
		this.EXTRACT_ALL_THEATERS = 'SELECT * '
								+' FROM '+this.DATABASE_THEATERS_TABLE+' th, '+this.DATABASE_LOCATION_TABLE+' loc'
								+' WHERE th.'+this.KEY_THEATER_ID+' = loc.'+this.KEY_LOCALISATION_THEATER_ID+';';
		
	}

	var thId = this.KEY_THEATER_ID;
	var thName = this.KEY_THEATER_NAME;
	var thPhone = this.KEY_THEATER_PHONE;
	var locCityName = this.KEY_LOCALISATION_CITY_NAME;
	var locCountryCode = this.KEY_LOCALISATION_COUNTRY_CODE;
	var locCountryName = this.KEY_LOCALISATION_COUNTRY_NAME;
	var locDist = this.KEY_LOCALISATION_DISTANCE;
	var locDistTime = this.KEY_LOCALISATION_DISTANCE_TIME;
	var locLat = this.KEY_LOCALISATION_LATITUDE;
	var locLong = this.KEY_LOCALISATION_LONGITUDE;
	var locPostalCode = this.KEY_LOCALISATION_POSTAL_CODE;
	var locQuery = this.KEY_LOCALISATION_SEARCH_QUERY;
	
	var request = this.EXTRACT_ALL_THEATERS;
	var dbTmp = this;
    this.db.transaction( 
        (function (transaction) { 
            transaction.executeSql(request
            		, []
            		, function(transaction, results) { 
            		    // Handle the results 
            		    try {
	            		   	var theaterList = [];
	            		   	if (dbTmp.cst.LOG_DEBUG){
	            		   		console.log('DBHelper.extractTheaters : Result of extraction theaters : '+results.rows.length+' theaters to construct');
	            		   	}
	            		   	var row = null;
	            		   	var theater = null;
	            		   	var location = null;
	            			for (var j = 0; j < results.rows.length; j++) {
	            				row = results.rows.item(j);
	            				theater = new TheaterBean();
	            				theater.id = dbTmp.removeQuotes(row[thId]);
	            				theater.theaterName = dbTmp.removeQuotes(row[thName]);
	            				theater.phoneNumber = dbTmp.removeQuotes(row[thPhone]);
	            				location = new LocalisationBean();
	            				location.cityName = dbTmp.removeQuotes(row[locCityName]);
	            				location.countryNameCode = dbTmp.removeQuotes(row[locCountryCode]);
	            				location.countryName = dbTmp.removeQuotes(row[locCountryName]);
	            				location.postalCityNumber = dbTmp.removeQuotes(row[locPostalCode]);
	            				location.distance = row[locDist];
	            				location.distanceTime = row[locDistTime];
	            				location.latitude = row[locLat];
	            				location.longitude = row[locLong];
	            				location.searchQuery = dbTmp.removeQuotes(row[locQuery]);
	            				theater.place = location;
	            				// On ajoute le cinéma à la liste		
	            				theaterList.push(theater);
	            			}
	            			onSucess(theaterList);
            			}
            			catch (e)
            			{
            				console.log('DBHelper.extractTheaters : Error during extracting theater : '+e.message);
            			} 

            		} 
            		, this.errorHandler.bind(this)); 
        }).bind(this) 
    );
};
DBHelper.prototype.extractTheaterFromId = function (onSucess, theaterIdRequest) {
	this.nullHandleCount = 0;
	// Query table1
	if (this.EXTRACT_THEATER_FROM_ID == null){
		this.EXTRACT_THEATER_FROM_ID = 'SELECT * '
			+' FROM '+this.DATABASE_THEATERS_TABLE+' th, '+this.DATABASE_LOCATION_TABLE+' loc'
			+' WHERE th.'+this.KEY_THEATER_ID+' = loc.'+this.KEY_LOCALISATION_THEATER_ID
			+' AND th.'+this.KEY_THEATER_ID+' = ? '
			+';';
		
	}
	var thId = this.KEY_THEATER_ID;
	var thName = this.KEY_THEATER_NAME;
	var thPhone = this.KEY_THEATER_PHONE;
	var locCityName = this.KEY_LOCALISATION_CITY_NAME;
	var locCountryCode = this.KEY_LOCALISATION_COUNTRY_CODE;
	var locCountryName = this.KEY_LOCALISATION_COUNTRY_NAME;
	var locDist = this.KEY_LOCALISATION_DISTANCE;
	var locDistTime = this.KEY_LOCALISATION_DISTANCE_TIME;
	var locLat = this.KEY_LOCALISATION_LATITUDE;
	var locLong = this.KEY_LOCALISATION_LONGITUDE;
	var locPostalCode = this.KEY_LOCALISATION_POSTAL_CODE;
	var locQuery = this.KEY_LOCALISATION_SEARCH_QUERY;
	
	var theaterId = this.addQuotes(theaterIdRequest);
	
	var request = this.EXTRACT_THEATER_FROM_ID;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [theaterId]
						   , function(transaction, results) { 
					// Handle the results 
					try {
						var theaterList = [];
						if (dbTmp.cst.LOG_DEBUG){
							console.log('DBHelper.extractTheaters : Result of extraction theaters : '+results.rows.length+' theaters to construct');
						}
						var row = null;
						var theater = null;
						var location = null;
						for (var j = 0; j < results.rows.length; j++) {
							row = results.rows.item(j);
							theater = new TheaterBean();
							theater.id = dbTmp.removeQuotes(row[thId]);
							theater.theaterName = dbTmp.removeQuotes(row[thName]);
							theater.phoneNumber = dbTmp.removeQuotes(row[thPhone]);
							location = new LocalisationBean();
							location.cityName = dbTmp.removeQuotes(row[locCityName]);
							location.countryNameCode = dbTmp.removeQuotes(row[locCountryCode]);
							location.countryName = dbTmp.removeQuotes(row[locCountryName]);
							location.postalCityNumber = dbTmp.removeQuotes(row[locPostalCode]);
							location.distance = row[locDist];
							location.distanceTime = row[locDistTime];
							location.latitude = row[locLat];
							location.longitude = row[locLong];
							location.searchQuery = dbTmp.removeQuotes(row[locQuery]);
							theater.place = location;
							// On ajoute le cinéma à la liste		
							theaterList.push(theater);
						}
						onSucess(theaterList);
					}
					catch (e)
					{
						console.log('DBHelper.extractTheaters : Error during extracting theater : '+e.message);
					} 
					
				} 
				, this.errorHandler.bind(this)); 
			}).bind(this) 
	);
};

DBHelper.prototype.extractFavTheaters = function (onSucess) {
	this.nullHandleCount = 0;
	// Query table1
	if (this.EXTRACT_FAV == null){
		this.EXTRACT_FAV = 'SELECT * '
								+' FROM '+this.DATABASE_FAV_THEATER_TABLE+';';
		
	}
	var thId = this.KEY_FAV_TH_THEATER_ID;
	var thName = this.KEY_FAV_TH_THEATER_NAME;
	var thLat = this.KEY_FAV_TH_THEATER_LAT;
	var thLong = this.KEY_FAV_TH_THEATER_LONG;
	var thCountryCode = this.KEY_FAV_TH_THEATER_COUNRTY_CODE;
	var thPostalCode = this.KEY_FAV_TH_THEATER_POSTAL_CODE;
	var thPlace = this.KEY_FAV_TH_THEATER_PLACE;
	
	var request = this.EXTRACT_FAV;
	var dbTmp = this;
    this.db.transaction( 
        (function (transaction) { 
            transaction.executeSql(request
            		, []
            		, function(transaction, results) { 
            		    // Handle the results 
            		    try {
	            		   	var theaterList = [];
	            		   	if (dbTmp.cst.LOG_DEBUG){
	            		   		console.log('DBHelper.extractFavTheaters : Result of extraction theaters : '+results.rows.length+' theaters to construct');
	            		   	}
	            		   	var row = null;
	            		   	var theater = null;
	            		   	var location = null;
	            			for (var j = 0; j < results.rows.length; j++) {
	            				row = results.rows.item(j);
	            				theater = new TheaterBean();
	            				theater.id = dbTmp.removeQuotes(row[thId]);
	            				theater.theaterName = dbTmp.removeQuotes(row[thName]);
	            				location = new LocalisationBean();
	            				location.cityName = dbTmp.removeQuotes(row[thPlace]);
	            				location.countryNameCode = dbTmp.removeQuotes(row[thCountryCode]);
	            				location.postalCityNumber = dbTmp.removeQuotes(row[thPostalCode]);
	            				location.latitude = row[thLat];
	            				location.longitude = row[thLong];
	            				theater.place = location;
	            				console.log('DBHelper.extractFavTheaters : th : '+theater.theaterName+', Localisation : '+location.countryNameCode+', '+row[thCountryCode]);
	            				// On ajoute le cinéma à la liste		
	            				theaterList.push(theater);
	            			}
	            			onSucess(theaterList);
            			}
            			catch (e)
            			{
            				console.log('DBHelper.extractFavTheaters : Error during extracting theater : '+e.message);
            			} 

            		} 
            		, this.errorHandler.bind(this)); 
        }).bind(this) 
    );
};

DBHelper.prototype.extractMovie = function (onSucess) {
	this.nullHandleCount = 0;
	// Query table1
	if (this.EXTRACT_ALL_MOVIES == null){
		this.EXTRACT_ALL_MOVIES = 'SELECT '+this.KEY_MOVIE_ID+', '+this.KEY_MOVIE_NAME+', '+this.KEY_MOVIE_ENGLISH_NAME+', '+this.KEY_MOVIE_TIME
								+' FROM '+this.DATABASE_MOVIE_TABLE+';';
		
	}
	var movieId = this.KEY_MOVIE_ID;
	var movieName = this.KEY_MOVIE_NAME;
	var enMovieName = this.KEY_MOVIE_ENGLISH_NAME;
	var movieTime = this.KEY_MOVIE_TIME;
	
	var dbTmp = this;
    this.db.transaction( 
        (function (transaction) { 
            transaction.executeSql(this.EXTRACT_ALL_MOVIES
            		, []
            		, function(transaction, results) { 
            		    // Handle the results 
            		    try {
	            		   	var movieList = [];
	            		   	if (dbTmp.cst.LOG_DEBUG){
	            		   		console.log('DBHelper.extractMovie : Result of extraction movies : '+results.rows.length+' movies to construct');
	            		   	}
	            		   	var row = null;
	            		   	var movie = null;
	            			for (var j = 0; j < results.rows.length; j++) {
	            				row = results.rows.item(j);
	            				movie = new MovieBean();
	            				movie.id = dbTmp.removeQuotes(row[movieId]);
	            				movie.movieName = dbTmp.removeQuotes(row[movieName]);
	            				movie.englishMovieName = dbTmp.removeQuotes(row[enMovieName]);
	            				movie.movieTime = row[movieTime];
	            				// On ajoute le film à la liste		
	            				movieList.push(movie);
	            			}
	            			onSucess(movieList);
            			}
            			catch (e)
            			{
            				console.log('DBHelper.extractMovie : Error during extracting movies : '+e.message);
            			} 

            		} 
            		, this.errorHandler.bind(this)); 
        }).bind(this) 
    );
};

DBHelper.prototype.completeMovie = function (onSucess, movie) {
	this.nullHandleCount = 0;
	// Query table1
	if (this.EXTRACT_MOVIE_FULL == null){
		this.EXTRACT_MOVIE_FULL = 'SELECT * '
		+' FROM '+this.DATABASE_MOVIE_TABLE
		+' WHERE '+this.KEY_MOVIE_ID+' = ?'
		+';';
		
	}
	var movieId = this.addQuotes(movie.id);
	var mId = this.KEY_MOVIE_ID;
	var mName = this.KEY_MOVIE_NAME;
	var mActors = this.KEY_MOVIE_ACTORS;
	var mDirectors = this.KEY_MOVIE_DIRECTORS;
	var mDesc = this.KEY_MOVIE_DESC;
	var mImdbDesc = this.KEY_MOVIE_IMDB_DESC;
	var mImdb = this.KEY_MOVIE_IMDB_ID;
	var mRate = this.KEY_MOVIE_RATE;
	var mStyle = this.KEY_MOVIE_STYLE;
	var mWikipediaUrl = this.KEY_MOVIE_WIKIPEDIA_URL;
	var mImdbUrl = this.KEY_MOVIE_WIKIPEDIA_URL;
	var mUrlImg = this.KEY_MOVIE_IMG_URL;
	var mTime = this.KEY_MOVIE_TIME;
	
	var dbTmp = this;
	var request = this.EXTRACT_MOVIE_FULL;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [movieId]
						, function(transaction, results) { 
							// Handle the results 
							try {
								if (dbTmp.cst.LOG_DEBUG){
									console.log('DBHelper.completeMovie : Result of extraction movies : '+results.rows.length+' movies to construct');
								}
								var row = null;
								for (var j = 0; j < results.rows.length; j++) {
									row = results.rows.item(j);
									if (dbTmp.cst.LOG_DEBUG){
										console.log('DBHelper.completeMovie : movie : '+movie.id+', time : '+movie.movieTime+', row[time] : '+row[mTime]);
									}
									movie.id = dbTmp.removeQuotes(row[mId]);
									movie.movieName = dbTmp.removeQuotes(row[mName]);
									movie.actorList = dbTmp.removeQuotes(row[mActors]);
									movie.directorList = dbTmp.removeQuotes(row[mDirectors]);
									movie.description = dbTmp.removeQuotes(row[mDesc]);
									movie.style = dbTmp.removeQuotes(row[mStyle]);
									movie.urlWikipedia = dbTmp.removeQuotes(row[mWikipediaUrl]);
									movie.urlImdb = dbTmp.removeQuotes(row[mImdbUrl]);
									movie.imdbId = dbTmp.removeQuotes(row[mImdb]);
									movie.imdbDesrciption = row[mStyle] == 1 ;
									movie.urlImg = dbTmp.removeQuotes(row[mUrlImg]);
									movie.rate = row[mRate];
									movie.movieTime = row[mTime];
									// On ajoute le film à la liste		
								}
								onSucess(movie);
							}
							catch (e)
							{
								console.log('DBHelper.extractMovie : Error during extracting movies : '+e.message);
							} 
							
						} 
						, this.errorHandler.bind(this)); 
			}).bind(this) 
	);
};

DBHelper.prototype.completeMovieReviews = function (onSucess, movie) {
	this.nullHandleCount = 0;
	// Query table1
	if (this.EXTRACT_REVIEWS == null){
		this.EXTRACT_REVIEWS = 'SELECT * '
			+' FROM '+this.DATABASE_REVIEW_TABLE
			+' WHERE '+this.KEY_REVIEW_MOVIE_ID+' = ?'
			+';';
		
	}
	var movieId = this.addQuotes(movie.id);
	var rMovieId = this.KEY_REVIEW_MOVIE_ID;
	var rAuthor = this.KEY_REVIEW_AUTHOR;
	var rSource = this.KEY_REVIEW_SOURCE;
	var rUrl = this.KEY_REVIEW_URL;
	var rRate = this.KEY_REVIEW_RATE;
	var rText = this.KEY_REVIEW_TEXT;
	
	var dbTmp = this;
	var request = this.EXTRACT_REVIEWS;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [movieId]
						, function(transaction, results) { 
							// Handle the results 
							try {
								if (dbTmp.cst.LOG_DEBUG){
									console.log('DBHelper.completeMovieReviews : Result of extraction movies : '+results.rows.length+' movies to construct');
								}
								var row = null;
								var reviewList = [];
								var review = null;
								for (var j = 0; j < results.rows.length; j++) {
									row = results.rows.item(j);
									review = new ReviewBean();
									review.movieId = dbTmp.removeQuotes(row[rMovieId]);
									review.author = dbTmp.removeQuotes(row[rAuthor]);
									review.source = dbTmp.removeQuotes(row[rSource]);
									review.urlReview = dbTmp.removeQuotes(row[rUrl]);
									review.rate = row[rRate];
									review.text = dbTmp.removeQuotes(row[rText]);
									// On ajoute le film à la liste
									reviewList.push(review);
								}
								movie.reviews = reviewList;
								onSucess(movie);
							}
							catch (e)
							{
								console.log('DBHelper.completeMovieReviews : Error during extracting movies : '+e.message);
							} 
							
						} 
						, this.errorHandler.bind(this)); 
			}).bind(this) 
	);
};

DBHelper.prototype.extractShowTimeFromTheater = function (theater, onSucess) {
	this.nullHandleCount = 0;
	// Query table1
	if (this.EXTRACT_SHOWTIME_FROM_THEATER == null){
		this.EXTRACT_SHOWTIME_FROM_THEATER = 'SELECT '+this.KEY_SHOWTIME_MOVIE_ID+', '+this.KEY_SHOWTIME_TIME+', '+this.KEY_SHOWTIME_LANG+', '+this.KEY_SHOWTIME_RESERVATION_URL
											+' FROM '+this.DATABASE_SHOWTIME_TABLE
											+' WHERE '+this.KEY_SHOWTIME_THEATER_ID+' = ?'
											+';';
		
	}
	var mId = this.KEY_SHOWTIME_MOVIE_ID;
	var showtime = this.KEY_SHOWTIME_TIME;
	var lang = this.KEY_SHOWTIME_LANG;
	var reservation = this.KEY_SHOWTIME_RESERVATION_URL;
	var thId = this.addQuotes(theater.id);
	
	var request = this.EXTRACT_SHOWTIME_FROM_THEATER;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request 
						, [thId]
						, function(transaction, results) { 
							// Handle the results 
							try {
								var projectionMap = [];
								if (dbTmp.cst.LOG_DEBUG){
									console.log('DBHelper.extractShowTimeFromTheater : Result of showtimes : '+results.rows.length+' showtimes to construct');
								}
								var row = null;
								var projection = null;
								var projectionList = [];
								var movieId = null
								var entryMovieMap = null
								for (var j = 0; j < results.rows.length; j++) {
									row = results.rows.item(j);
									movieId = dbTmp.removeQuotes(row[mId]);
									
									projectionList = null;
									for (var i = 0; i < projectionMap.length; i++){
										entryMovieMap = projectionMap[i];
										if (entryMovieMap['id'] == movieId){
											projectionList = entryMovieMap['data'];
											break;
										}
									}
									
									if (projectionList == null){
										projectionList = [];
										projectionMap.push({id:movieId,data:projectionList});
									}
									
									projection = new ProjectionBean();
									projection.showtime = row[showtime];
									projection.lang = dbTmp.removeQuotes(row[lang]);
									projection.reservationLink = dbTmp.removeQuotes(row[reservation]);
									// On ajoute le film à la liste
									projectionList.push(projection);
								}
								
								theater.movieMap = projectionMap;
								
								onSucess();
							}
							catch (e)
							{
								console.log('DBHelper.extractShowTimeFromTheater : Error during extracting showtimes : '+e.message);
							} 
							
						} 
						, this.errorHandler.bind(this)); 
			}).bind(this) 
	);
};

DBHelper.prototype.extractSearchRequest = function (onSucess) {
	this.nullHandleCount = 0;
	// Query table1
	if (this.EXTRACT_REQUEST == null){
		this.EXTRACT_REQUEST = 'SELECT * ' 
							+' FROM '+this.DATABASE_REQUEST_TABLE
							+';';
		
	}
	var cityName = this.KEY_REQUEST_CITY_NAME;
	var movieName = this.KEY_REQUEST_MOVIE_NAME;
	var thId = this.KEY_REQUEST_THEATER_ID;
	var time = this.KEY_REQUEST_TIME;
	var lat = this.KEY_REQUEST_LATITUDE;
	var long = this.KEY_REQUEST_LONGITUDE;
	var nearResp = this.KEY_REQUEST_NEAR_RESP;
	
	var request = this.EXTRACT_REQUEST;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request 
						, []
						, function(transaction, results) { 
							// Handle the results 
							try {
								var projectionMap = [];
								if (dbTmp.cst.LOG_DEBUG){
									console.log('DBHelper.extractSearchRequest : Result of searchRequest : '+results.rows.length+' request to construct');
								}
								var row = null;
								var request = null;
								var requestList = [];
								for (var j = 0; j < results.rows.length; j++) {
									row = results.rows.item(j);
									
									request = new RequestBean();
									request.cityName = dbTmp.removeQuotes(row[cityName]);
									request.movieName = dbTmp.removeQuotes(row[movieName]);
									request.time = row[time];
									request.latitude = row[lat];
									request.longitude = row[long];
									request.nearResp = row[nearResp] == 1;
									
									// On ajoute la recherche
									requestList.push(request);
								}
								onSucess(requestList);
							}
							catch (e)
							{
								console.log('DBHelper.extractSearchRequest : Error during extracting request : '+e.message);
							} 
							
						} 
						, this.errorHandler.bind(this)); 
			}).bind(this) 
	);
};

DBHelper.prototype.extractLastSearchRequest = function (onSucess) {
	this.nullHandleCount = 0;
	// Query table1
	if (this.EXTRACT_LAST_REQUEST == null){
		this.EXTRACT_LAST_REQUEST = 'SELECT * ' 
			+' FROM '+this.DATABASE_REQUEST_TABLE
			+' WHERE '+this.KEY_REQUEST_TIME+' = (SELECT MAX('+this.KEY_REQUEST_TIME+') FROM '+this.DATABASE_REQUEST_TABLE+')'
			+';';
		
	}
	var cityName = this.KEY_REQUEST_CITY_NAME;
	var movieName = this.KEY_REQUEST_MOVIE_NAME;
	var thId = this.KEY_REQUEST_THEATER_ID;
	var time = this.KEY_REQUEST_TIME;
	var lat = this.KEY_REQUEST_LATITUDE;
	var long = this.KEY_REQUEST_LONGITUDE;
	var nearResp = this.KEY_REQUEST_NEAR_RESP;
	
	var request = this.EXTRACT_LAST_REQUEST;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request 
						, []
						   , function(transaction, results) { 
					// Handle the results 
					try {
						if (dbTmp.cst.LOG_DEBUG){
							console.log('DBHelper.extractLastSearchRequest : Result of searchRequest : '+results.rows.length+' request to construct');
						}
						var row = null;
						var request = null;
						for (var j = 0; j < results.rows.length; j++) {
							row = results.rows.item(j);
							
							request = new RequestBean();
							request.cityName = dbTmp.removeQuotes(row[cityName]);
							request.movieName = dbTmp.removeQuotes(row[movieName]);
							request.time = row[time];
							request.latitude = row[lat];
							request.longitude = row[long];
							request.nearResp = row[nearResp] == 1;
							
							break;
						}
						onSucess(request);
					}
					catch (e)
					{
						console.log('DBHelper.extractLastSearchRequest : Error during extracting request : '+e.message);
					} 
					
				} 
				, this.errorHandler.bind(this)); 
			}).bind(this) 
	);
};

DBHelper.prototype.extractVersionDataBase = function (onSucess) {
	
	if(this.EXTRACT_VERSIONS == null){
		this.EXTRACT_VERSIONS = "SELECT * FROM "+this.DATABASE_VERSION_TABLE;
	}
	
	var request = this.EXTRACT_VERSIONS;
	var dbVersion = this.KEY_VERSION_DB;
	var appVersion = this.KEY_VERSION_APP;
	var dbTmp = this;
	this.db.transaction( 
	        (function (transaction) { 
	            transaction.executeSql(request
	            		, []
	            		, function(transaction, result){
	            			if (dbTmp.cst.LOG_DEBUG){
	            				console.log('DBHelper.extractVersionDataBase : '+result.rows.length);
	            			}
	            			try{
		            			var row = null;
		            		   	var dbVer = null;
		            		   	var appVer = null;
		            		   	var version = null;
		            			for (var j = 0; j < result.rows.length; j++) {
		            				row = result.rows.item(j);
		            				dbVer = row[dbVersion];
		            				appVer = row[appVersion];
		            				// On ajoute le film à la liste
		            				break;
		            			}
		            			if (dbTmp.cst.LOG_DEBUG){
		            				console.log('DBHelper.extractVersionDataBase : '+dbVer+', '+appVer);
		            			}
		            			if ((dbVer != null) && (appVer != null)){
		            				version = {db:dbVer,app:appVer};
		            			}
	            				onSucess(version);
	            			}catch (e) {
								console.log('DBHelper.extractVersionDataBase : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptCreation); 
							}
	            			return true;
	            		}
			            , function(transaction, error) { 
		                    console.log('DBHelper.extractVersionDataBase : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptCreation); 
		                    return true;
		                }); 
	        }).bind(this) 
	    );
};

DBHelper.prototype.extractPreferences = function (onSucess) {
	
	if(this.EXTRACT_PREFERENCES == null){
		this.EXTRACT_PREFERENCES = "SELECT * FROM "+this.DATABASE_PREFERENCES_TABLE;
	}
	
	var request = this.EXTRACT_PREFERENCES;
	var pKey = this.KEY_PREFERENCE_KEY;
	var pValue = this.KEY_PREFERENCE_VALUE;
	var dbTmp = this;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, []
					   , function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.extractPreferences : '+result.rows.length);
							}
							try{
								var row = null;
								var preferenceList = [];
								var preference = null;
								var keyTmp = null;
								var valueTmp = null;
								for (var j = 0; j < result.rows.length; j++) {
									row = result.rows.item(j);
									keyTmp = dbTmp.removeQuotes(row[pKey]);
									valueTmp = dbTmp.removeQuotes(row[pValue]);
									preference = {key:keyTmp, value:valueTmp};
									// On ajoute la préférence à la liste
									preferenceList.push(preference);
								}
								onSucess(preferenceList);
							}catch (e) {
								console.log('DBHelper.extractPreferences : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptCreation); 
							}
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.extractPreferences : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptCreation); 
							return true;
						}); 
			}).bind(this) 
	);
};

DBHelper.prototype.extractPreferenceValue = function (onSucess, key) {
	
	if(this.EXTRACT_PREFERENCE_VALUE == null){
		this.EXTRACT_PREFERENCE_VALUE = "SELECT * FROM "+this.DATABASE_PREFERENCES_TABLE
		+" WHERE "+this.KEY_PREFERENCE_KEY+" = ? ;"
		;
	}
	
	var keyTmp = this.addQuotes(key);
	var request = this.EXTRACT_PREFERENCE_VALUE;
	var pValue = this.KEY_PREFERENCE_VALUE;
	this.db.transaction( 
			(function (transaction) { 
				transaction.executeSql(request
						, [keyTmp]
						, function(transaction, result){
							if (dbTmp.cst.LOG_DEBUG){
								console.log('DBHelper.extractPreferenceValue : ');
							}
							try{
								var row = null;
								var valueTmp = null;
								for (var j = 0; j < result.rows.length; j++) {
									row = result.rows.item(j);
									valueTmp = dbTmp.removeQuotes(row[pValue]);
									break;
								}
								onSucess(valueTmp);
							}catch (e) {
								console.log('DBHelper.extractPreferenceValue : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptCreation); 
							}
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.extractPreferenceValue : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptCreation); 
							return true;
						}); 
			}).bind(this) 
	);
};


/* CALLBACK METHODS */


DBHelper.prototype.callBackVersions = function(version) {
	if (this.cst.LOG_DEBUG){
		console.log('DBHelper.callBackVersions : '+version);
	}
	try{
		if (version != null){
			var dbVersion = version['db'];
			if (dbVersion < 22){
				this.insertVersion(null);
			}
			if (dbVersion < 23){
				this.createTableDataBase(this.DATABASE_CREATE_PREFERENCES_TABLE, this.DATABASE_PREFERENCES_TABLE);
				this.insertVersion(null);
			}
			if (dbVersion < 24){
				this.dropTableDataBase(this.DROP_MOVIE_TABLE, this.DATABASE_MOVIE_TABLE);
				this.createTableDataBase(this.DATABASE_CREATE_MOVIE_TABLE, this.DATABASE_MOVIE_TABLE);
				this.insertVersion(null);
			}
			if (dbVersion < 25){
				this.dropTableDataBase(this.DROP_REQUEST_TABLE, this.DATABASE_REQUEST_TABLE);
				this.createTableDataBase(this.DATABASE_CREATE_REQUEST_TABLE, this.DATABASE_REQUEST_TABLE);
				this.insertVersion(null);
			}
		}else{
			//create table theaters
			this.createTableDataBase(this.DATABASE_CREATE_THEATER_TABLE, this.DATABASE_THEATERS_TABLE);
			this.createTableDataBase(this.DATABASE_CREATE_MOVIE_TABLE, this.DATABASE_MOVIE_TABLE);
			this.createTableDataBase(this.DATABASE_CREATE_FAV_THEATER_TABLE, this.DATABASE_FAV_THEATER_TABLE);
			this.createTableDataBase(this.DATABASE_CREATE_SHOWTIME_TABLE, this.DATABASE_SHOWTIME_TABLE);
			this.createTableDataBase(this.DATABASE_CREATE_LOCATION_TABLE, this.DATABASE_LOCATION_TABLE);
			this.createTableDataBase(this.DATABASE_CREATE_REQUEST_TABLE, this.DATABASE_REQUEST_TABLE);
			this.createTableDataBase(this.DATABASE_CREATE_REVIEWS_TABLE, this.DATABASE_REVIEW_TABLE);
			this.createTableDataBase(this.DATABASE_CREATE_VERSION_TABLE, this.DATABASE_VERSION_TABLE);
			this.createTableDataBase(this.DATABASE_CREATE_PREFERENCES_TABLE, this.DATABASE_PREFERENCES_TABLE);
			
			this.insertVersion(null);
			
		}
		this.callBackMethodInit();
	}catch (e) {
		console.log('DBHelper.callBackVersions : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptCreation);
	}
};

DBHelper.prototype.errorHandler = function(transaction, error) { 
    console.log('DBHelper.errorHandler : Error was '+error.message+' (Code '+error.code+')'); 
    return true;
};
