(function() {
  var _subscribers = [];
  var AppDispatcher = {
    dispatch: function(data) { // Dispatch message to subscribers.
      _subscribers.forEach(function(subscriber) {
        subscriber.callback(data);
      });
    },
    register: function(callback) { // Register subscriber.
      var caller = arguments.callee.caller;
      _subscribers.push({instance: caller, callback: callback });
    },
    remove: function() { // Remove subscriber.
      var caller = arguments.callee.caller;
      var subscribers = _subscribers.filter(function(s) { return s.instance === caller });
      if (subscribers && subscribers.length === 1) {
        _subscribers.splice($.inArray(subscribers[0], _subscribers), 1);
      }
    }
  };

  window.AppDispatcher = AppDispatcher;
})();
