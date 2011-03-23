function ComparatorTheaterName(){
	
};

ComparatorTheaterName.prototype.compare = function(theater1, theater2){
	var result = 0;
	if (theater1.theaterName < theater2.theaterName){
		result = -1;
	}else if (theater1.theaterName > theater2.theaterName){
		result = 1;
	}
	return result;
};