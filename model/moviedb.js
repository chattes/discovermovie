var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// var MovieSchema = new Schema({
// 	poster_path: {type: String},
// 	adult: {type: Boolean},
// 	overview: {type: String},
// 	release_date: {type: String},
// 	original_title: {type: String},
// 	original_language: {type: String},
// 	title: {type: String},
// 	backdrop_path: {type: String},
// 	video: {type: Boolean},
// 	vote_average: {type:Number,'default':0},
// 	vote_count: {type:Number,'default':0}, 
// 	popularity: {type:Number,'default':0}, 
// 	id: {type:Number,'default':0}, 
// 	genre_ids:[] 
//
// });

var MovieSchema = new Schema(
	{movieData: {type: Object}}
);

module.exports = mongoose.model('moviedb',MovieSchema);
