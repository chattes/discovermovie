var sentiment = require('sentiment');

module.exports.calculate = function(movie){

	//Point for Awards--

	var discoRating = 0;
	if(movie.awards !== undefined) {
		discoRating += 1;
		if(movie.awards.wins>1 && movie.awards.wins<=3) discoRating += 1;
		if(movie.awards.wins>3 && movie.awards.wins<=6) discoRating += 2;
		if(movie.awards.wins>6) discoRating += 5;
		if(movie.awards.nominations>1 && movie.awards.nominations<=3) discoRating += 0.5;
		if(movie.awards.nominations>3 && movie.awards.nominations<=6) discoRating += 1;
		if(movie.awards.nominations>6) discoRating += 3;
	}


	//If Movie Released in USA
	if(movie.countries !== undefined && movie.countries.findIndex(function(country) {

		if(country.toString() === 'USA') return true;
	})!== -1) discoRating += 0.5;

	//IMDB Considertation
	if(movie.imdb.rating>0&&movie.imdb.rating<=4) discoRating += 0.3;
	if(movie.imdb.rating>4&&movie.imdb.rating<=6) discoRating += 0.5;
	if(movie.imdb.rating>6) discoRating += 1;
	//IMDB Votes
	if(movie.imdb.votes>0&&movie.imdb.votes<=1000) discoRating -= 0.3;
	if(movie.imdb.votes>1000&&movie.imdb.votes<=10000) discoRating += 0.1;
	if(movie.imdb.votes>10000&&movie.imdb.votes<=100000) discoRating += 0.3;
	if(movie.imdb.votes>100000&&movie.imdb.votes<=500000) discoRating += 0.4;
	if(movie.imdb.votes>500000) discoRating += 0.5;

	//Metacritic
	if(movie.metacritic>0&&movie.metacritic<=10) discoRating -= 0.1;
	if(movie.metacritic>10&&movie.metacritic<=30) discoRating += 0.1;
	if(movie.metacritic>30&&movie.metacritic<=60) discoRating += 0.2;
	if(movie.metacritic>60&&movie.metacritic<=70) discoRating += 0.3;
	if(movie.metacritic>70&&movie.metacritic<=85) discoRating += 0.4;
	if(movie.metacritic>85&&movie.metacritic<=90) discoRating += 0.5;
	if(movie.metacritic>90) discoRating += 0.7;

	//Tomatoes
	//Analyse Sentiment of Consensus
	var consensus = !!movie.tomato.consensus ? movie.tomato.consensus : null;
	if(consensus){
		var sentiRating = sentiment(movie.tomato.consensus.toString().replace(/\'/g,"\""));	
	}
	if(sentiRating!==undefined) discoRating += sentiRating.comparative;
	if(movie.tomato.fresh > movie.tomato.rotten) discoRating += 1;
	if(movie.tomato.fresh < movie.tomato.rotten) discoRating -= 1;
	if(movie.tomato.image === "rotten") discoRating -= 1;
	if(movie.tomato.meter>50) discoRating += 0.5;
	if(movie.tomato.userMeter>50) discoRating += 2.5;
	if(movie.tomato.reviews<10) discoRating -= 0.5;
	if(movie.tomato.userReviews<500) discoRating -= 1.5;
	if(movie.tomato.reviews<10) discoRating -= 0.5;

	//Tomato Ratings Calculation
	if(movie.tomato.rating>0&&movie.tomato.rating<=3) discoRating -= 0.1;
	if(movie.tomato.rating>4&&movie.tomato.rating<=6) discoRating += 0.1;
	if(movie.tomato.rating>6&&movie.tomato.rating<=8) discoRating += 0.3;
	if(movie.tomato.rating>8) discoRating += 0.5;

	if(movie.tomato.userRating>0&&movie.tomato.userRating<=2) discoRating -= 0.5;
	if(movie.tomato.userRating>2&&movie.tomato.userRating<=4) discoRating += 2.0;
	if(movie.tomato.userRating>4) discoRating += 3;

	return discoRating;

}
