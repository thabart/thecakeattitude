'use strict';
var express = require('express');
var path = require("path");
var fs = require('fs');
var bodyParser = require('body-parser');
var Promise = require('promise');
var request = require('request');
var app = express();

const host = "www.habbo.com.tr";
const habboPort = 443;

var download = function(uri, filename, callback){
	return new Promise(function(resolve) {
		var opts = {
			url: uri,
			method: 'GET',
			headers: {
				'User-Agent': 'Fiddler'
			}
		};
	  request(opts, function(err, res, body){
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);
		request(opts).pipe(fs.createWriteStream(filename)).on('close', function() {
			resolve();
		});
	  });		
	});
};

app.use(bodyParser.json());
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/resources', express.static(__dirname + '/resources'));
app.post('/player', function(req, res) {	
	var body = req.body;
	var figure = figure = req.body.figure;
	var dir = path.join(__dirname + "/resources/players/" + figure);
	if (fs.existsSync(dir)) {
		res.status(500).send({error : "The directory already exists"}); // The directory already exists.
		return;
	}
	
	fs.mkdirSync(dir);
	var promises = [];
	for (var direction = 3; direction <= 10; direction++) {
		var url = "https://www.habbo.de/habbo-imaging/avatarimage?figure="+figure+"&direction="+direction+"&head_direction="+direction+"&action=std&gesture=std&size=n&frame=0&img_format=png";
		promises.push(download(url, dir + "/" + (direction - 3)+"_0.png"));
		for(var i = 0; i <= 3; i++) {
			var wurl = "https://www.habbo.de/habbo-imaging/avatarimage?figure="+figure+"&direction="+direction+"&head_direction="+direction+"&action=wlk&gesture=std&size=n&frame="+i+"&img_format=png";
			promises.push(download(wurl, dir + "/" + (direction - 3) + "_" + (i + 1) + ".png"));
		}
	}
	
	Promise.all(promises).then(function() {		
		res.sendStatus(200);
	});
});
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});
var port = process.env.PORT || 3002;
app.listen(port, function() {
	console.log('Game is listening on port ' + port);
});
