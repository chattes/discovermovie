var config = require('../config/appkeys');
var tweetModel = require('../model/twitterdb');
var async = require('async');
var twitter = require('twit');
var https = require('https');
var querystring = require('querystring');
var bearer = config.twitter.consumer_key + ':'+ config.twitter.consumer_secret;

module.exports = {

	init: function() {
		var base64ed = new Buffer(bearer).toString("base64");

		var options = {
			port: 443,
			hostname: "api.twitter.com",
			path: "/oauth2/token",
			method: "post",
			headers: {
				Authorization: "Basic " + base64ed,
				"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
				"User-Agent": "discoverMovie"
			}
		};		
		var reqtwi = https.request(options, res => {
			res.on("data", d => {
				var twiToken = JSON.parse(d.toString());
				console.log(twiToken.access_token);
				twitConfig = {
					consumer_key:config.twitter.consumer_key,
					consumer_secret:config.twitter.consumer_secret,
					bearer_token:twiToken.access_token,
					app_only_auth:true
				}
				client = new twitter(twitConfig);
			})
		})
		reqtwi.on("error", e => {
			console.log(e);
		});
		reqtwi.write(querystring.stringify({
			"grant_type": 'client_credentials'
		}))
		reqtwi.end();

	},

	getPosts: function(doneCB,moviesList) {
		if(client!=null){
			async.each(moviesList.results, function(movie, cbTweet) {

				var qs = '\"'+movie.title+'\" '+'since:'+movie.release_date;
				console.log(qs)
				client.get('search/tweets', {q: movie.title,count:100,lang:'en'},function(err,tweets,response){
					if (err){
						console.log('Tweets:' + tweets);
						console.log('err:' + err);
						console.log('Response:' + response);
						cbTweet(null);

					}else{
						async.each(tweets.statuses,function(tweet,cbtweetsave){
							tweetModel.find({movie_id:movie.id,tweetId:tweet.id},function(err,tweetSave) {
								if(err) return cbtweetsave(err);
								if(!err&&tweetSave!=undefined&&tweetSave.length>0) return cbtweetsave(null);
								var myTweetSch = {};
								myTweetSch.movie_id = movie.id;
								myTweetSch.text = tweet.text
								myTweetSch.tweetId = tweet.id;
								myTweetSch.favorite_count = tweet.favorite_count;
								myTweetSch.retweet_count = tweet.retweet_count;
								myTweetSch.create_at = tweet.created_at;
								var newTweet = new tweetModel(myTweetSch);
								newTweet.save(function(err) {
									cbtweetsave(err);
								})

							})							
						},function(err) {
							cbTweet(err);
						});
					}

				})			
			}, function (err) {
				doneCB(err);
			});



		}

	}
};
