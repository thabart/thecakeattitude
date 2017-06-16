var AddressSearch = function() { };
AddressSearch.prototype = {
  render: function() {
    var self = this,
      streetAddress = $.i18n('streetAddress'),
      postalCode = $.i18n('postalCode'),
      locality = $.i18n('locality'),
      country = $.i18n('country'),
      error = $.i18n('error'),
      enterAnAddressPlaceHodler = $.i18n('enterAnAddressPlaceHodler');
    self.component = $("<div>"+
      "<div class='alert-error'><b>"+error+" </b><span class='message'></span><span class='close'><i class='fa fa-times'></i></span></div>"+
      "<div class='adr-search'>"+
        "<section class='col-6'>"+
          "<div>"+
            "<label>"+streetAddress+"</label>"+
            "<input type='text' class='input-control streetAdr' readonly />"+
          "</div>"+
          "<div>"+
            "<label>"+postalCode+"</label>"+
            "<input type='text' class='input-control postalCode' readonly />"+
          "</div>"+
          "<div>"+
            "<label>"+locality+"</label>"+
            "<input type='text' class='input-control locality' readonly />"+
          "</div>"+
          "<div>"+
            "<label>"+country+"</label>"+
            "<input type='text' class='input-control country' readonly />"+
          "</div>"+
        "</section>"+
        "<section class='col-6'>"+
          "<input type='text' class='google-map-searchbox input-control' placeholder='"+enterAnAddressPlaceHodler+"' />"+
          "<div class='google-map'></div>"+
        "</section>"+
      "</div>"+
    "</div>");
    $(self.component).find('.alert-error .close').click(function() {
      self.hideError();
    });
    return self.component;
  },
  hideError: function() {
    $(this.component).find('.alert-error').hide();
  },
  displayError: function(message) {
    var errorElt = $(this.component).find('.alert-error');
    errorElt.find('.message').html(message);
    errorElt.show();
  },
  updateAddress: function(adr) {
    $(this.component).find('.streetAdr').val(adr.street_address);
    $(this.component).find('.postalCode').val(adr.postal_code);
    $(this.component).find('.locality').val(adr.locality);
    $(this.component).find('.country').val(adr.country);
    if (adr.postal_code === '' || adr.locality === '' || adr.country === '' || adr.street_address === '') {
      this.displayError($.i18n('error-adrMustBeComplete'));
      $(this).trigger('error');
      return;
    }

    $(this).trigger('success');
  },
  getAddress: function() {
    var self = this;
    return {
      street_address: $(self.component).find('.streetAdr').val(),
      postal_code: $(self.component).find('.postalCode').val(),
      locality: $(self.component).find('.locality').val(),
      country: $(self.component).find('.country').val()
    };
  },
  getGooglePlaceId: function() {
    return this.marker.placeId;
  },
  init: function() {
    var self = this;
    var getLocation = function() { // Get geolocation.
      var dfd = jQuery.Deferred();
      var getDefaultLocation = function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var coordinates = position.coords;
            dfd.resolve({lat: coordinates.latitude, lng: coordinates.longitude});
          }, function() {
            dfd.resolve({lat: 50, lng: 50});
          });
        } else {
          dfd.resolve({lat: 50, lng: 50});
        }
      };
      var googlePlaceId = GameStateStore.getUser().google_place_id;
      if (googlePlaceId) {
        GoogleMapService.getPlaceById(googlePlaceId).then(function(r) {
          dfd.resolve(r.geometry.location)
        }).fail(function() {
          getDefaultLocation();
        });
      } else {
        getDefaultLocation();
      }

      return dfd;
    };

    getLocation().then(function(position) { // Get current location and display it.
      GoogleMapService.getPlaceByLocation(position.lat, position.lng).then(function(l) {
        var googleMap = $(self.component).find('.google-map')[0];
        self.map = new google.maps.Map(googleMap, { center: position, scrollwheel: true, zoom: 8 });
        self.marker = new google.maps.Marker({
          map: self.map,
          placeId: l.place_id,
          position: position
        });
        var input = $(self.component).find('.google-map-searchbox')[0];
        $(input).on('keydown', function(e) {
          if (e.which == 13) {
            return false;
          }
        });
        self.searchBox = new google.maps.places.SearchBox(input);
        self.searchBox.addListener('places_changed', function(e) { // Search places.
          self.hideError();
          var places = self.searchBox.getPlaces();
          if (places.length === 0) return;
          if (places.length > 1) {
            self.displayError($.i18n('error-onlyOneAdr'));
            return;
          }

          self.marker.setMap(null);
          var place = places[0];
          var adr = GoogleMapUtils.getAddress(place.address_components);
          if (place.geometry) {
            self.marker = new google.maps.Marker({
              map: self.map,
              placeId: place.place_id,
              position: place.geometry.location
            });

            var bounds = new google.maps.LatLngBounds();
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }

            self.map.fitBounds(bounds);
          }

          self.updateAddress(adr);
        });

        self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        $(self).trigger('initialized');
        self.updateAddress(l.adr);
      });
    });
  }
};
