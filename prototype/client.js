'use strict';
var Pixelsmith = require('pixelsmith');
var express = require('express');
var concat = require('concat-stream');
var path = require("path");
var fs = require('fs');
var bodyParser = require('body-parser');
var Promise = require('promise');
var request = require('request');
var through2 = require('through2');
var app = express();

const host = "www.habbo.com.tr";
const habboPort = 443;

var download = function(uri, filename, row, col){
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
			resolve({filename: filename, order: (row * 5) + col});
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
		promises.push(download(url, dir + "\\" + (direction - 3)+"_0.png", (direction - 3), 0));
		for(var i = 0; i <= 3; i++) {
			var wurl = "https://www.habbo.de/habbo-imaging/avatarimage?figure="+figure+"&direction="+direction+"&head_direction="+direction+"&action=wlk&gesture=std&size=n&frame="+i+"&img_format=png";
			promises.push(download(wurl, dir + "\\" + (direction - 3) + "_" + (i + 1) + ".png", (direction - 3), (i + 1)));
		}
	}
	
	Promise.all(promises).then(function(sprites) {		
		var pixelsmith = new Pixelsmith();
		sprites = sprites.sort(function(a, b) {
			return a.order - b.order;
		});
		var sprs = sprites.map(function(s) { return s.filename; });
		pixelsmith.createImages(sprs, function handleImages (err, imgs) {	
			var width = imgs[0].width;
			var height = imgs[0].height;		
			var canvas = pixelsmith.createCanvas(width * 5, height * 8);		
			for (var row = 0; row < 8; row++) {
				for (var col = 0; col < 5; col++) {
					canvas.addImage(imgs[(row * 5) + col], (col * width), (row * height));
				}				
			}
			
			var resultStream = canvas['export']({format: 'png'});
			var imageStream = through2();
			resultStream.pipe(imageStream);
			imageStream.pipe(concat({encoding: 'buffer'}, function handleImage (buff) {
				fs.writeFileSync(dir + "\\" + "sprite.png", buff);		
				res.sendStatus(200);			
			}));
		});
	}).catch(function(e) {
		console.log(e);
	});
});
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});
var port = process.env.PORT || 3002;
app.listen(port, function() {
	console.log('Game is listening on port ' + port);
});
