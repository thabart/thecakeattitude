(function() {
  var _currentMap = null;
  var _mapChanged = 'mapChanged';
  var _userChanged = 'userChanged';
  var _onSizeChanged = 'sizeChanged';
  var _lastPlayerPosition = null;
  var _user = null;
  var _size = null;
  var _sizeChangedListeners = [];
  var _userChangedListeners = [];
  window.GameStateStore = {
    getCurrentMap: function() {
      return _currentMap;
    },
    setCurrentMap: function(map) {
      _currentMap = map;
      $(this).trigger(_mapChanged, [ { map: map } ]);
    },
    saveLastPlayerPosition: function(position) {
      _lastPlayerPosition = position;
    },
    getLastPlayerPosition: function() {
      return _lastPlayerPosition;
    },
    getUser: function() {
      return _user;
    },
    setUser: function(user) {
      _user = user;
      _userChangedListeners.forEach(function(record) {
        record.callback(user);
      });
    },
    getSize: function() {
      return _size;
    },
    setSize: function(size) {
      _size = size;
      _sizeChangedListeners.forEach(function(record) {
        record.callback(size);
      });
    },
    onCurrentMapChanged: function(callback) {
      $(this).on(_mapChanged, callback);
    },
    onUserChanged: function(callback) {
      var self = this;
      _userChangedListeners.push({instance: self, callback: callback});
    },
    offUserChanged: function() {
      var self = this;
      var instances = _userChangedListeners.filter(function(rec) { return rec.instance === self });
      if (instances && instances.length === 1) {
        _userChangedListeners.splice($.inArray(instances[0], _userChangedListeners), 1);
      }

      console.log(_userChangedListeners);
    },
    onSizeChanged: function(callback) {
      var self = this;
      _sizeChangedListeners.push({instance: self, callback: callback});
    },
    offSizeChanged: function() {
      var self = this;
      var instances = _sizeChangedListeners.filter(function(rec) { return rec.instance === self });
      if (instances && instances.length === 1) {
        _sizeChangedListeners.splice($.inArray(instances[0], _sizeChangedListeners), 1);
      }
    }
  };
})();
