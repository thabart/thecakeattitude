var GoogleMapService = {
  getPlaceByLocation: function(latitude, longitude) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude;
    var dfd = jQuery.Deferred();
    $.get(url).then(function(jobj) {
      var result = jobj.results[0];
      var adrComponents = result.address_components;
      var adr = GoogleMapUtils.getAddress(adrComponents);
      dfd.resolve({ adr: adr, geometry: result.geometry, place_id: result.place_id });
    });
    return dfd;
  },
  getPlaceById: function(placeId) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?key=" + Constants.googleMapKey + '&place_id=' + placeId;
    var dfd = jQuery.Deferred();
    $.get(url).then(function(jobj) {
      var result = jobj.results[0];
      var adrComponents = result.address_components;
      var adr = GoogleMapUtils.getAddress(adrComponents);
      dfd.resolve({ adr: adr, geometry: result.geometry, place_id: result.place_id });
    });
    return dfd;
  }
};
