'use strict';
game.Stores = game.Stores || {};
var GameMenuStoreCl = function() {
	this.displayAuthenticateMethodChooserBox = function() {
		$(this).trigger('authenticateMethodChooserBoxDisplayed');
	};
	this.displayAuthentication = function() {
		$(this).trigger('authenticationDisplayed');
	};
	this.displayMenu = function() {
		$(this).trigger('menuDisplayed');
	};
	this.listenDisplayAuthentication = function(callback) {
		$(this).on('authenticationDisplayed', callback);
	};
	this.listenDisplayMenu = function(callback) {
		$(this).on('menuDisplayed', callback);
	};
	this.listenAuthenticateMethodChooserBoxDisplayed = function(callback) {
		$(this).on('authenticateMethodChooserBoxDisplayed', callback);
	};
};


game.Stores.MenuStore = new GameMenuStoreCl();