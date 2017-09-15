'use strict';
var express = require('express');
var path = require("path");
var bodyParser = require('body-parser');
var app = express();
var services = require('./server/services');

var baseUrl = 'http://localhost:3000';
var options = {
	clientId : 'website',
	clientSecret: 'website'
};

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', baseUrl);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

/*
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/build/index.html'));
});
*/

// app.use('/', express.static(__dirname + '/build'));

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.post('/login', function(req, res) { // TODO : Implement logs function.
	var body = req.body;
	services.OpenidService.passwordAuthentication(body.login, body.password).then(function(r) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(r));
	}).catch(function() {
		res.sendStatus(401);
	});
});
app.get('/paypalcallback', function(req, res) { // TODO : get authorization code + get access token.
	var code = req.query['code'];
	if (!code) {
		res.sendStatus(500);
		return;
	}

	services.PaypalService.getOpenIdAccessToken(code).then(function(result) {
		res.redirect(baseUrl + '/paypal?access_token=' + result.access_token);
	}).catch(function(e) {
		res.sendStatus(500);
	});
});

app.listen(3003, function() {
	console.log('Game is listening on port 3003!');
});
