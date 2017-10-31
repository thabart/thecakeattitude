'use strict';
game.Stores = game.Stores || {};
var GameMenuStoreCl = function() {
	this.displayAuthenticateMethodChooserBox = function() {
		$(this).trigger('authenticateMethodChooserBoxDisplayed');
	};
	this.displayAuthentication = function() {
		$(this).trigger('authenticationDisplayed');
	};
	this.listenDisplayAuthentication = function(callback) {
		$(this).on('authenticationDisplayed', callback);
	};
	this.listenAuthenticateMethodChooserBoxDisplayed = function(callback) {
		$(this).on('authenticateMethodChooserBoxDisplayed', callback);
	};
};


game.Stores.MenuStore = new GameMenuStoreCl();