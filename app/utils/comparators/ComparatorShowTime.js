function ComparatorShowTime(){
	this.date = new Date();
	this.currentTime = this.date.getTime();
}

ComparatorShowTime.prototype.compare = function(movieMap1, movieMap2){
	var result = 0;
	var min1 = -1;
	var min2 = -1;
	var minTmp = null;
	for (var i = 0; i < movieMap1.data.length; i++){
		minTmp = parseInt(movieMap1.data[i].showtime) - this.currentTime;
		if ((min1 == -1) || ((minTmp < min1) && (minTmp > 0))){
			min1 = minTmp;
		}else if (minTmp < 0){
			min1 = 999999999;
		}
	}
	for (var i = 0; i < movieMap2.data.length; i++){
		minTmp = parseInt(movieMap2.data[i].showtime) - this.currentTime;
		if ((min2 == -1) || ((minTmp < min2)&& (minTmp > 0))){
			min2 = minTmp;
		}else if (minTmp < 0){
			min2 = 999999999;
		}
	}
	
	if ((min1 > 0) && (min2 > 0) && (min1 < min2)){
		result = -1;
	}else if ((min1 > 0) && (min2 > 0) && (min1 > min2)){
		result = 1;
	}else if((min1 > 0) && (min2 < 0)){
		result = -1;
	}else if((min1 < 0) && (min2 > 0)){
		result = 1;
	}
	return result;
};