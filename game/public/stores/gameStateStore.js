(function() {
  var _currentMap = null;
  var _mapChanged = 'mapChanged';
  var _lastPlayerPosition = null;
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
    onCurrentMapChanged: function(callback) {
      $(this).on(_mapChanged, callback);
    }
  };
})();
