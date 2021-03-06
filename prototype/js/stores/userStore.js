'use strict';
game.Stores = game.Stores || {};
var UserStoreCl = function() {
	var _currentUser = {};

	this.setCurrentUser = function(currentUser) {
		this._currentUser = currentUser;
		$(this).trigger('currentUserChanged');
	};

	this.getCurrentUser = function() {
		return this._currentUser;
	};

	this.updateCurrentUser = function(user) {
		this._currentUser = $.extend(this._currentUser, user);
		$(this).trigger('currentUserChanged');
	};

	this.listenCurrentUserChanged = function(callback) {
		$(this).on('currentUserChanged', callback);
	};

	this.unsubscribeCurrentUserChanged = function(callback) {
		$(this).off('currentUserChanged',  callback);
	};
};


game.Stores.UserStore = new UserStoreCl();
