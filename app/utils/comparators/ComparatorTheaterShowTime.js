function ComparatorTheaterShowTime(){
	this.date = new Date();
	this.currentTime = this.date.getTime();
}

ComparatorTheaterShowTime.prototype.compare = function(theater1, theater2){
	var result = 0;
	var min1 = -1;
	var min2 = -1;
	var minTmp = null;
	
	var movieMap1 = theater1.movieMap[0];
	var movieMap2 = theater2.movieMap[0];
	for (var i = 0; i < movieMap1.data.length; i++){
		minTmp = parseInt(movieMap1.data[i].showtime) - this.currentTime;
		if ((min1 == -1) || ((minTmp < min1)&& (minTmp > 0))){
			min1 = minTmp;
		}
	}
	for (var i = 0; i < movieMap2.data.length; i++){
		minTmp = parseInt(movieMap2.data[i].showtime) - this.currentTime;
		if ((min2 == -1) || ((minTmp < min2)&& (minTmp > 0))){
			min2 = minTmp;
		}
	}
	if (min1 < min2){
		result = -1;
	}else if (min1 > min2){
		result = 1;
	}
	return result;
};