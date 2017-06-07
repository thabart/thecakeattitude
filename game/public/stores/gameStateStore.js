(function() {
  var _currentMap = null;
  var _mapChanged = 'mapChanged';
  window.GameStateStore = {
    getCurrentMap: function() {
      return _currentMap;
    },
    setCurrentMap: function(map) {
      _currentMap = map;
      $(this).trigger(_mapChanged, [ { map: map } ]);
    },
    onCurrentMapChanged: function(callback) {
      $(this).on(_mapChanged, callback);
    }
  };
})();
