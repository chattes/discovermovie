var tmdb = require('./tmdb');
var moviemdl = require('../model/moviedb');
module.exports = {
	index: function(req,res){
		var viewmodel = {

			title:"Browse Movies",
			movies:[],
			pagination:{}
		};
		var page_no = req.query.p
		if(page_no === undefined)
			viewmodel.pagination.page =1;
		else
			viewmodel.pagination.page = page_no;
		moviemdl.count({},function(err,count) {
			viewmodel.pagination.pageCount = Math.floor(count / 25);
			console.log(viewmodel.pages);
		});
		moviemdl.find(
			// {'movieData.discoveryRating':{$gt:10}}
				function(err,movies){
			if(err){
				res.render('error',{message:'Error Querying for Movies',err:err});

			}
			movies.map(function(movie){

				if(movie.movieData.poster_path)
					movie.movieData.poster_path = 'http://image.tmdb.org/t/p/w500'+movie.movieData.poster_path;
				else
					
					movie.movieData.poster_path = 'http://directaerojobs.com/web/uploads/photoIndisponiblePuzzle.jpg';
				viewmodel.movies.push(movie.movieData);
			});
			// viewmodel.movies = movies;
			res.render('index',viewmodel);
		}).skip((page_no-1)*20).limit(20).sort({"movieData.discoveryRating":-1});	
	}
};
