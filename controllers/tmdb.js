var config = require('../config/appkeys');
var omdb = require('../localModules/omdb');
var rating = require('../localModules/helpers/discoRating');
var twitter = require('./twitter');
var moviedb = require('moviedb')(config.tmdb.key);
var async = require('async');
var query_en = 'primary_release_year=2014&sort_by=release_date.asc&language=en';
var query_hi = 'primary_release_year=2014&sort_by=vote_average.desc&language=bn';
var moviemdl = require('../model/moviedb');
var queryCompleted = 0;
var queryCalled = 0;
var allQueries = [];
var querybatch = [];

// twitter.init();

function _filter_criteria(movie){
	//filter out the movies which does not match the below criteria
	if(movie.tomato === undefined||movie.dvd===null||movie.metacritic===null
		||movie.imdb===undefined||movie.imdb.votes>1000000) {
			return true;
		}
	return false;


}

function saveMovie(saveList){
	//Check if Movie does not exist and SAVE

	async.each(saveList,function(saveMovie,saveCB) {
		moviemdl.find({"movieData.id":saveMovie.id},function(err,moviesFound) {
			if(err) return saveCB(err);
			if(moviesFound !== undefined && moviesFound.length>0) return saveCB(null);
			var newMovie = new moviemdl();
			newMovie.movieData = saveMovie;
			newMovie.save(function (err) {
				if (err) console.log('Error saving movie ' + newMovie.movieData.title);
				saveCB(err);
			});

		});


	},function(err) {
		if(err) console.log("Error Occured While Saving Movie to Database");
		if(queryCalled === allQueries.length){
		console.log("Movie Query Completed Successfully!");
		//Reset Counter
		queryCalled = 0;
		}
	});
}

function _filter_movie(movielist){

	console.log("Actual List: "+movielist.length);
	async.mapLimit(movielist,20,function(movieQ,movieCB) {
		//Get details from OMDB	
		var movieQTemp = movieQ;
		omdb.get({ title: movieQ.title}, {tomatoes:true}, function(err, movie) {

			if(!movie||_filter_criteria(movie)) 
			{
				// return movieCB(null,false);
				movieQTemp.omdb = null;
				return movieCB(null,movieQTemp);
			}
			// return (_filter_criteria(movie) ? movieCB(null,true) : movieCB(null,false));
			movieQTemp.omdb = movie;
			//Title Mismatch TODO
			// if(movieQTemp.title !== movie.title){
			// 	console.log("Sent Title: "+movieQTemp.title);
			// 	console.log("Received Title: "+movie.title);
			// 	//For Now Reject the Movie as I need the Poster from TMDB and OMDB Poster needs a Donation
			// 	// throw "Title Mismatch";
			// }
			return movieCB(null,movieQTemp);


		});

	},function(err,enhancedList) {
		if(err) return console.log("Error occured while enhancing list ERROR: "+err);
		//Filter Results

		async.filter(enhancedList,function(enhMovie,fltrCB) {

			//Condition for Filter - not OMDB not NULL
			fltrCB(null,!!enhMovie.omdb);
		},function(err,filteredResults) {

			console.log("Enhanced List: "+filteredResults.length);
			console.log("Calculating Discovery rating...")
			async.map(filteredResults,function(fltrMovie,cbMap) {
				//Create an modified List adding the DiscoverRating, 
				//the dicover rating is calculated and will be used to sort movies	
				fltrMovie.discoveryRating = rating.calculate(fltrMovie.omdb);
				cbMap(null,fltrMovie);

			},function(err,transformed) {
				console.log("Transformation Complete: "+transformed.length);	
				saveMovie(transformed);
			});


		});
	});

}

function _queryTMDB(queryList){

	queryCalled++;
	console.log("Querying TMDB...")
	var movieDbList = [];
	async.each(queryList,function(query,queryCB) {
		moviedb.discoverMovie(query,function(err,list) {

			if(err) {return queryCB(err);}
			movieDbList = movieDbList.concat(list.results);
			queryCB(null);

		});
	},function(err) {
		if(err) {return console.log("Error Occured while processing "+err);}
		// console.log(movieDbList.length);
		_filter_movie(movieDbList);
	}

	);

}





module.exports = {
	startDiscover: function (req, res, next) {
		moviedb.discoverMovie(query_en, function (err, list) {
			if (err) {return console.log(err);}
			_filter_movie(list.results);	
			//Query Limitation has been set by TMDB API- 40 Queries ---10 Second Wait Time--->Next Query
			for (var page_no = 2; page_no <= list.total_pages; page_no++) {
				query_temp = query_en + '&page=' + page_no;
				querybatch.push(query_temp);
				if( page_no % 30 === 0){
					allQueries.push(querybatch);
					querybatch = [];//initialize the array
				}
			}
			if(querybatch.length>0) allQueries.push(querybatch);


			res.status(404).end();	

			console.log("Total Queries: "+allQueries.length);
			for(var i=0;i<allQueries.length;i++){

				setTimeout(_queryTMDB,i*65000,allQueries[i]);

			}


		}

		);

	}
};
