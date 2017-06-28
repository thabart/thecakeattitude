(function() {
  var _shop = null;
  var _shopChangedListeners = [];
  window.ShopMapStateStore = {
    getShop: function() {
      return _shop;
    },
    setShop: function(shop) {
      _shop = shop;
      _shopChangedListeners.forEach(function(record) {
        record.callback(size);
      });
    },
    onShopChanged: function(callback) {
      var self = this;
      _userChangedListeners.push({instance: self, callback: callback});
    },
    offShopChanged: function() {
      var self = this;
      var instances = _userChangedListeners.filter(function(rec) { return rec.instance === self });
      if (instances && instances.length === 1) {
        _userChangedListeners.splice($.inArray(instances[0], _userChangedListeners), 1);
      }
    }
  };
})();
