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
var services = require('./server/services');
var app = express();

const isProxyEnabled = true;
const nbJobs = 0;
const maxNbJobs = 5;

function sleep(x) {
	return function(cb) {
		setTimeout(cb, x);
	}
}

var download = function(uri, filename, row, col){
	return new Promise(function(resolve, reject) {
		var proxiedRequest = isProxyEnabled ? request.defaults({ 'proxy' : 'http://proxybc.riziv.org:8080' }) : request;
		var opts = {
			url: uri,
			method: 'GET',
			headers: {
				'User-Agent': 'Fiddler'
			}
		};

		proxiedRequest(opts).on('error', function(e) {
			console.log(e);
			reject(e);
		}).pipe(fs.createWriteStream(filename)).on('close', function() {
			resolve({filename: filename, order: (row * 5) + col});
		}).on('error', function(e) {
			reject(e);
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
app.post('/player', function(req, res) { // Add player sprite.
	var body = req.body;
	var figure = figure = req.body.figure;
	var dir = path.join(__dirname + "/resources/players/" + figure);
	if (fs.existsSync(dir)) {
		res.status(200).send({ sprite : "/resources/players/" + figure + "/sprite.png" }); // The directory already exists.
		return;
	}
	
	fs.mkdirSync(dir);
	var promises = [];
	var direction = 3,
		files = [];
	var downloadFiles = function(direction) {
		var subPromises = [];
		var url = "https://www.habbo.de/habbo-imaging/avatarimage?figure="+figure+"&direction="+direction+"&head_direction="+direction+"&action=std&gesture=std&size=n&frame=0&img_format=png";
		subPromises.push(download(url, dir + "\\" + (direction - 3) + "_0.png", (direction - 3), 0));
		for(var i = 0; i <= 3; i++) {
			var wurl = "https://www.habbo.de/habbo-imaging/avatarimage?figure="+figure+"&direction="+direction+"&head_direction="+direction+"&action=wlk&gesture=std&size=n&frame="+i+"&img_format=png";
			subPromises.push(download(wurl, dir + "\\" + (direction - 3) + "_" + (i + 1) + ".png", (direction - 3), (i + 1)));
		}
		
		return subPromises;
	};

	var downloadAllDirs = new Promise(function(resolve) {
		var cb = function() {
			if (direction > 10) { resolve(files); return; }
			Promise.all(downloadFiles(direction)).then(function(fs) {
				setTimeout(function() {
					direction++;
					files = files.concat(fs);
					cb();
				}, 1000);
			});
		};
		cb();
	});
	
	downloadAllDirs.then(function(sprites) {		
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
					var img = imgs[(row * 5) + col];
					if (!img) { continue; }
					canvas.addImage(img, (col * width), (row * height));
				}				
			}
			
			var resultStream = canvas['export']({format: 'png'});
			var imageStream = through2();
			resultStream.pipe(imageStream);
			imageStream.pipe(concat({encoding: 'buffer'}, function handleImage (buff) {
				fs.writeFileSync(dir + "\\" + "sprite.png", buff);		
				res.status(200).send({ sprite : "/resources/players/" + figure + "/sprite.png" }); 		
			}));
		});
	}).catch(function(e) {
		console.log(e);
	});
});
app.post('/login', function(req, res) { // Authenticate the user.
	var body = req.body;
	services.OpenidService.passwordAuthentication(body.login, body.password).then(function(r) {
    	res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(r));
	}).catch(function(e) {
		res.sendStatus(401);
	});
});
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});
var port = process.env.PORT || 3002;
app.listen(port, function() {
	console.log('Game is listening on port ' + port);
});
