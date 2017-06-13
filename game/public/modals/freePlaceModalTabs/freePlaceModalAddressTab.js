var FreePlaceModalAddressTab = function() {};
FreePlaceModalAddressTab.prototype = {
  render: function() {
    var next = $.i18n('next'),
      previous = $.i18n('previous'),
      streetAddress = $.i18n('streetAddress'),
      postalCode = $.i18n('postalCode'),
      locality = $.i18n('locality'),
      country = $.i18n('country'),
      error = $.i18n('error'),
      enterAnAddressPlaceHodler = $.i18n('enterAnAddressPlaceHodler'),
      self = this;
    this.tab = $("<div class='container'>"+
      "<div class='alert-error'><b>"+error+" </b><span class='message'></span><span class='close'><i class='fa fa-times'></i></span></div>"+
      "<div>"+
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
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn next'>"+next+"</button>"+
      "</div>"+
    "</div>");
    $(this.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(this.tab).find('.next').click(function() {
      $(self).trigger('next');
    });
    $(this.tab).find('.alert-error .close').click(function() {
      self.hideError();
    });
    return this.tab;
  },
  displayError: function(message) {
    var errorElt = $(this.tab).find('.alert-error');
    errorElt.find('.message').html(message);
    errorElt.show();
  },
  hideError: function() {
    $(this.tab).find('.alert-error').hide();
  },
  disableNextBtn: function(b) {
    $(this.tab).find('.next').prop('disabled', b);
  },
  updateAddress: function(adr) {
    $(this.tab).find('.streetAdr').val(adr.street_address);
    $(this.tab).find('.postalCode').val(adr.postal_code);
    $(this.tab).find('.locality').val(adr.locality);
    $(this.tab).find('.country').val(adr.country);
    if (adr.postal_code === '' || adr.locality === '' || adr.country === '' || adr.street_address === '') {
      this.displayError($.i18n('error-adrMustBeComplete'));
      this.disableNextBtn(true);
      return;
    }

    this.disableNextBtn(false);
  },
  init: function() {
    var self = this;
    if (self.isInit) return;
    self.disableNextBtn(true);
    var getLocation = function() {
      var dfd = jQuery.Deferred();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var coordinates = position.coords
          dfd.resolve({lat: coordinates.latitude, lng: coordinates.longitude});
        }, function() {
          dfd.resolve({lat: 50, lng: 50});
        });
      } else {
        dfd.resolve({lat: 50, lng: 50});
      }

      return dfd;
    };
    getLocation().then(function(position) { // Get current location and display it.
      GoogleMapService.getPlaceByLocation(position.lat, position.lng).then(function(l) {
        self.updateAddress(l.adr);
      });
      var googleMap = $(self.tab).find('.google-map')[0];
      self.map = new google.maps.Map(googleMap, { center: position, scrollwheel: true, zoom: 8 });
      self.marker = new google.maps.Marker({
        map: self.map,
        position: position
      });
      var input = $(self.tab).find('.google-map-searchbox')[0];
      self.searchBox = new google.maps.places.SearchBox(input);
      self.searchBox.addListener('places_changed', function() { // Search places.
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
      self.isInit = true;
    });
  }
};
