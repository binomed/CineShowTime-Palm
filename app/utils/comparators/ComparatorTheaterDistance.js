function ComparatorTheaterDistance(){
	
}

ComparatorTheaterDistance.prototype.compare = function(theater1, theater2){
	var result = 0;
	var dist1 = -1;
	var dist2 = -1;
	if ((theater1.place != null) && (theater2.place != null)){
		dist1 = parseFloat(theater1.place.distance);
		if (isNaN(dist1)){
			dist1 = -1;
		}
		dist2 = parseFloat(theater2.place.distance);
		if (isNaN(dist2)){
			dist2 = -1;
		}
	}
	if ((dist1 != -1) && (dist2 != -1) && (dist1 < dist2)){
		result = -1;
	}else if ((dist1 != -1) && (dist2 != -1) && (dist1 > dist2)){
		result = 1;
	}else if ((dist1 != -1) && (dist2 == -1)){
		result = -1;
	}else if ((dist1 == -1) && (dist2 != -1)){
		result = 1;
	}
	return result;
};