'use strict';
var Constants = {
	SessionName: 'gameAccessToken',
	ClientId : 'game',
	ClientSecret: 'game',
	openIdWellKnownConfiguration: 'http://localhost:5001/.well-known/openid-configuration',
	userClaims : 'http://localhost:5001/users/claims',
	userPublicClaims : 'http://localhost:5001/users/{id}/public',
	googleMapUrl: 'http://maps.googleapis.com/maps/api',
	apiUrl: 'http://localhost:5000',
	apiConfigurationUrl: 'http://localhost:5000/.well-known/configuration',
	socketServer: 'http://localhost:3001',
	gameSelector: '#game',
	emoticons: [ // All the emoticons : http://irowiki.org/wiki/Emotes
		{
			"sprite": "sorry",
			"cmd": "/sry",
			"fps": 12,
			"img" : "/styles/emoticons/sorry-overview.png"
		},
		{
			"sprite": "love-eyes",
			"cmd": "/awsm",
			"fps": 12,
			"img" : "/styles/emoticons/love-eyes-overview.png"
		},
		{
			"sprite": "money",
			"cmd": "/$",
			"fps": 12,
			"img" : "/styles/emoticons/money-overview.png"
		},
		{
			"sprite": "love",
			"cmd": "/lv2",
			"fps": 12,
			"img" : "/styles/emoticons/love-overview.png"
		},
		{
			"sprite": "thanks",
			"cmd": "/thx",
			"fps": 12,
			"img": "/styles/emoticons/thx-overview.png"
		}
	]
};
