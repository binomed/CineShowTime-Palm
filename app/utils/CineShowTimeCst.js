function CineShowTimeCst(){
	
	this.KEY_MENU_SORT = "cmd-sort";
	this.KEY_MENU_CALL = "cmd-call";
	this.KEY_MENU_TRAILER = "cmd-trailer";
	this.KEY_MENU_TRANSLATE = "cmd-translate";
	this.KEY_MENU_MAP_THEATER = "cmd-map-theater";
	this.KEY_MENU_DRIVE_THEATER = "cmd-drive-theater";
	this.KEY_MENU_ABOUT = "cmd-about";
	this.KEY_MENU_HELP = "cmd-help";
	this.KEY_MENU_PREFS = "cmd-prefs";
	
	this.KEY_SUB_MENU_SORT_THEATER_NAME = "cmd-sub-sort-th-name";
	this.KEY_SUB_MENU_SORT_THEATER_DISTANCE = "cmd-sub-sort-th-dist";
	this.KEY_SUB_MENU_SORT_SHOWTIME = "cmd-sub-sort-showtime";
	this.KEY_SUB_MENU_SORT_MOVIE_NAME = "cmd-sub-sort-movie-name";
	
	this.ERROR_WRONG_PLACE = 1;
	this.ERROR_WRONG_DATE = 2;
	this.ERROR_NO_DATA = 3;
	this.ERROR_CUSTOM_MESSAGE = 4;
	
	this.BLN_DEBUG = false;
	this.LOG_DEBUG = true;
	
	this.URL_SERVER = "http://7.latest.binomed-cineshowtime-palm.appspot.com/";
	this.URL_DIST   = "http://maps.google.com/maps/nav?q=from:#{from}%20to:#{to}&ie=utf8&oe=utf8&sensor=false&key=#{key}";
	
	this.GOOGLE_MAPS_KEY = "ABQIAAAA_CXWycTt44_mg_LxLiivrhQz_QRRxxi6fl4J7vAWJHWRTZbJMxRlf6zcT0T6E3oP7DzsBFXaWyFfjg";
	//this.URL_SERVER = "http://localhost:8888/";
	
	
	this.LAST_CHANGE_MESSAGE = "<ul class='versions'>"
	                        + "  <li class='current'>V1.2.0</li>"
                          + "    <ul>"
                          + "      <li>Added \"light\" display theme</li>"
                          + "      <li>Added \"what's new\" feature</li>"
                          + "      <li>Changed header logo</li>"
                          + "      <li>Fixed a \"favorite theaters\" bug</li>"
                          + "      <li>Fixed distances bug</li>"                       
                          + "    </ul>"               
                          + "  <li>V1.1.0</li>"
                          + "    <ul>"
                          + "      <li>Added reservation system for US, ES</li>"
                          + "      <li>Changed management of results</li>"
                          + "      <li>Changed application icon</li>"
                          + "      <li>Auto detection of the phone hour format</li>"
                          + "      <li>Fixed little bugs</li>"                                            
                          + "    </ul>"
                          + "  <li>V1.0.4</li>"
                          + "    <ul>"
                          + "      <li>Fixed hour format for showtimes</li>"
                          + "      <li>Fixed search with space</li>"
                          + "      <li>Fixed internationalization</li>"
                          + "    </ul>"
                          + "  <li>V1.0.3</li>"
                          + "    <ul>"
                          + "      <li>Fixed minor bugs</li>"
                          + "    </ul>"
                          + "  <li>V1.0.2</li>"
                          + "    <ul>"
                          + "      <li>Fixed launch bug</li>"
                          + "      <li>Added support of Italian language</li>"
                          + "    </ul>"
                          + "  <li>V1.0.1</li>"
                          + "    <ul>"
                          + "      <li>Fixed minor bugs</li>"
                          + "    </ul>  "
                          + "  <li>V1.0.0</li>"
                          + "    <ul>  "
                          + "      <li>First Version</li>"
                          + "    </ul>"
                          + "</ul>";
}
