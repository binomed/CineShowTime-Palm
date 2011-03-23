function ComparatorMovieName(){
	
}

ComparatorMovieName.prototype.compare = function(movie1, movie2){
	var result = 0;
	console.log("ComparatorMovieName.compare : ");
	if (movie1.movieName < movie2.movieName){
		result = -1;
	}else if (movie1.movieName > movie2.movieName){
		result = 1;
	}
	return result;
};