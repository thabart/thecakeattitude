var FreePlaceModalAddressTab = function() {};
FreePlaceModalAddressTab.prototype = {
  render: function() {
    var next = $.i18n('next'),
      previous = $.i18n('previous'),
      streetAddress = $.i18n('streetAddress'),
      postalCode = $.i18n('postalCode'),
      locality = $.i18n('locality'),
      country = $.i18n('country'),
      self = this;
    this.tab = $("<div class='container'>"+
      "<div>"+
        "<section class='col-6'>"+
          "<div>"+
            "<label>"+streetAddress+"</label>"+
            "<input type='text' class='input-control' readonly />"+
          "</div>"+
          "<div>"+
            "<label>"+postalCode+"</label>"+
            "<input type='text' class='input-control' readonly />"+
          "</div>"+
          "<div>"+
            "<label>"+locality+"</label>"+
            "<input type='text' class='input-control' readonly />"+
          "</div>"+
          "<div>"+
            "<label>"+country+"</label>"+
            "<input type='text' class='input-control' readonly />"+
          "</div>"+
        "</section>"+
        "<section class='col-6'>"+
          "<input type='text' class='google-map-searchbox input-control' />"+
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
    return this.tab;
  },
  init: function() {
    if (this.isInit) return;
    var googleMap = $(this.tab).find('.google-map')[0];
    var map = new google.maps.Map(googleMap, { center: {lat: -34.397, lng: 150.644}, scrollwheel: false, zoom: 8 });
    var input = $(this.tab).find('.google-map-searchbox')[0];
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    this.isInit = true;
  }
};
