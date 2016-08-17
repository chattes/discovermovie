var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require('./routes/routes');
var d3 = require('d3');
var hbs = require('hbs');
var paginate = require('handlebars-paginate');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',exphbs.create({

	defaultLayout: 'layout',
	layoutsDir: app.get('views')+'/layouts',
	helpers:{

		drawPie: function(id) {
			console.log(id);
		},
		times: function(number){
			var pagination = "";
			for(var i=0;i<number;i++){
				var page = i+1;
				pagination += '<li class="page-item"><a class="page-link" href="'+page+'">'+page+'</a></li>' 
			}
			return new hbs.handlebars.SafeString(pagination);
			// return pagination; 
		},
		paginate: paginate
	}

}).engine);
// hbs.handlebars.registerHelper('paginate',require('handlebars-paginate'));
app.set('view engine', 'handlebars');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public",express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

routes(app);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
//Connect to MongoDB
mongoose.connect('mongodb://localhost/discovermovies');
mongoose.connection.on('open', function () {
	console.log('Mongoose connected.');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
