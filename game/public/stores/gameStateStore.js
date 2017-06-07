(function() {
  var _currentMap = null;
  window.GameStateStore = {
    getCurrentMap: function() {
      return _currentMap;
    },
    setCurrentMap: function(map) {
      _currentMap = map;
    }
  };
})();
