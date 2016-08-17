var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var TweetSchema = new Schema({
	movie_id: {type: Number,'default':0},
	text: {type: String},
	tweetId: {type: Number,'default':0},
	favorite_count: {type: Number,'default':0},
	retweet_count: {type: Number,'default':0},
	create_at: {type: Date,'default':Date.now}
});


module.exports = mongoose.model('tweetdb',TweetSchema);
