'use strict';
var Constants = {
	ClientId : 'game',
	ClientSecret: 'game',
	sessionName: 'shopInGame-2-AccessToken',
  googleMapKey: 'AIzaSyBN72d3ipuyzbqhJgjwav5HnnKkLqp3KCU',
	callbackUrl: 'http://localhost:3000/callback',
	googleMapUrl: 'http://maps.googleapis.com/maps/api',
	apiUrl: 'http://localhost:5000',
	apiConfigurationUrl: 'http://localhost:5000/.well-known/configuration',
	openIdUrl: 'http://localhost:5001',
	openIdWellKnownConfiguration: 'http://localhost:5001/.well-known/openid-configuration',
	userClaims : 'http://localhost:5001/users/claims',
	userPublicClaims : 'http://localhost:5001/users/{id}/public',
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
	],
	playerConfiguration: {
		male: { // Configure male player.
			hairCuts: [
				{ // Black.
					image: '/styles/heads/men/black.png',
					atlasJson: 'public/sprites/blackHeadsMen.json',
					name: 'blackHeadsMen',
					colorKey: 'black',
					faces: [
						{
							name: 'first',
							overviewImage: '/styles/heads/men/first-hc-black-overview.png',
							animations: [
								{
									name: 'bottom',
									tiles: [0]
								},
								{
									name: 'bottomRight',
									tiles: [1]
								},
								{
									name: 'right',
									tiles: [2]
								},
								{
									name: 'topRight',
									tiles: [3]
								},
								{
									name: 'top',
									tiles: [4]
								},
								{
									name: 'topLeft',
									tiles: [5]
								},
								{
									name: 'left',
									tiles: [6]
								},
								{
									name: 'bottomLeft',
									tiles: [7]
								}
							]
						},
						{
							name: 'second',
							overviewImage: '/styles/heads/men/second-hc-black-overview.png'
						}
					]
				}
			]
		}
	}
};
