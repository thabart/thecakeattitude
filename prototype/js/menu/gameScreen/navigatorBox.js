game.Menu = game.Menu || {};
game.Menu.NavigatorBox = me.Object.extend({
  init: function() {
    this._request = { count: 2, start_index: 0 };
    this.navigatorBox =$("<div class='modal blue lg navigator-box'>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<div class='top'>"+
            "<span data-i18n='navigator_title'></span> <div class='close'></div>"+
          "</div>"+
          "<div class='body'>"+          
              // HEADER.
              "<div class='header'>"+
                "<ul class='no-style tabs gray menu'>"+
                  "<li data-target='.shops-tab' class='active'><span data-i18n='shops'></span></li>"+
                  "<li data-target='.rooms-tab'><span data-i18n='rooms'></span></li>"+
                "</ul>"+
              "</div>"+
              // CONTENT.
              "<div class='loading' data-i18n='loading' style='display: none;'></div>"+
              "<div style='padding: 10px;' class='tab-container'>"+
                "<div class='shops-tab tab' style='height: 500px;'>"+
                  "<div class='col-4'>"+
                    // ORDER BY
                    "<div class='gray-panel'>"+
                      "<div class='top'></div>"+
                      "<div class='body'>"+
                        "<label data-i18n='orderBy'></label>"+
                        "<div class='input'>"+
                          "<div class='top'></div>"+
                          "<div class='body'>"+
                            "<select class='shop-order'>"+
                              "<option data-i18n='creation_date_desc' data-ordername='create_datetime' data-order='desc'></option>"+
                              "<option data-i18n='creation_date_asc' data-ordername='create_datetime' data-order='asc'></option>"+
                              "<option data-i18n='reputation_desc' data-ordername='average_score' data-order='desc'></option>"+
                              "<option data-i18n='reputation_asc' data-ordername='average_score' data-order='asc'></option>"+
                            "</select>"+
                          "</div>"+
                          "<div class='bottom'></div>"+
                        "</div>"+
                      "</div>"+
                       "<div class='bottom'></div>"+
                    "</div>"+
                    // FILTER ON CATEGORIES.
                    "<div class='gray-panel' style='padding-top: 5px;'>"+
                      "<div class='top'></div>"+
                      "<div class='body'>"+
                        "<div class='body'>"+
                          "<label data-i18n='categories'></label>"+
                          "<div class='treeview filters'>"+
                            "<ul>"+
                              "<li>"+
                                "<span class='node-toggle'></span>"+
                                "<span>Habits</span>"+
                                "<ul>"+
                                  "<li class='filter'>Chaussures</li>"+
                                "</ul>"+
                              "</li>"+
                            "</ul>"+
                          "</div>"+
                        "</div>"+
                      "</div>"+
                       "<div class='bottom'></div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='col-8'>"+
                    "<ul class='list shops' style='padding: 0 10px 0 10px'></ul>"+
                    "<ul class='navigations'></ul>"+
                  "</div>"+
                "</div>"+
                "<div class='rooms-tab tab' style='display: none; height: 500px;'>"+
                  "<ul>"+
                    "<li data-i18n='coffee-store'></li>"+
                    "<li data-i18n='reception'></li>"+
                  "</ul>"+
                "</div>"+
                "<div>"+
                  "<button class='button button-gray' data-i18n='navigate'></button>"+
                "</div>"+
              "</div>"+
          "</div>"+
          "<div class='bottom'>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(document.body).append(this.navigatorBox);
    $(this.navigatorBox).i18n();
    $(this.navigatorBox).hide();
    $(this.navigatorBox).draggable({ "handle": ".top" });
    this.refresh();
    this.addListeners();
  },
  refresh: function() {
    var self = this;
    self.displayLoading(true);
    game.Services.ShopsService.search(this._request).then(function(r) {
      var shops = r['_embedded'],
        navigation = r['_links']['navigation'];
      if (!(shops instanceof Array)) {
        shops = [shops];
      }

      $(self.navigatorBox).find('.shops').empty();
      $(self.navigatorBox).find('.navigations').empty();
      shops.forEach(function(shop) {
        var profileImage = shop.profile_image;
        if (!profileImage) {
          profileImage = "/img/default-shop.png";
        }

        var elt = $("<li>"+
          "<div class='col-3'>"+
            "<img src='"+profileImage+"' width='50' />"+
          "</div>"+
          "<div class='col-9'>"+
            "<h3>"+shop.name+"</h3>"+
            "<ul class='tags'></ul>"+
          "</div>"+
        "</li>");
        $(elt).click(function() {
          $(self.navigatorBox).find('.shops li').removeClass('active');
          $(this).addClass('active');
        });
        shop.tags.forEach(function(tag) {
          elt.find('ul').append("<li>"+tag+"</li>");
        });
        $(self.navigatorBox).find('.shops').append(elt);
      });

      if (navigation && navigation.length > 0) {
        navigation.forEach(function(nav) {
          var n = $("<li>"+nav.name+"</li>");
          $(self.navigatorBox).find('.navigations').append(n);
          $(n).click(function() {
            $(self.navigatorBox).find('.navigations li').removeClass('active');
            $(this).addClass('active');
            var page = $(this).html();
            self._request.start_index = self._request.count * (parseInt(page) - 1);
            self.refresh();
          });
        });
      }
      
      self.displayLoading(false);
    }).catch(function() {
      self.displayLoading(false);
    });
  },
  displayLoading: function(b) {
    if (b) {
      $(this.navigatorBox).find('.tab-container').hide();
      $(this.navigatorBox).find('.loading').show();
    } else {
      $(this.navigatorBox).find('.tab-container').show();
      $(this.navigatorBox).find('.loading').hide();
    }
  },
  addListeners: function() {
    var self = this;
    $(self.navigatorBox).find('.menu li').click(function() {      
      $(self.navigatorBox).find('.tabs li').removeClass('active');
      $(this).addClass('active');
      $(self.navigatorBox).find('.tab').hide();
      var target = $(this).data('target');
      $(self.navigatorBox).find(target).show();
    });
    $(self.navigatorBox).find('.filters .node-toggle').click(function(e) {
      e.stopPropagation();
      var li = $(this).closest('li');
      if(li.hasClass('active')) {
        li.removeClass('active');
      } else {
        li.addClass('active');
      }
    });
    $(self.navigatorBox).find('.close').click(function() {
      $(self.navigatorBox).hide();
    });
    $(self.navigatorBox).find('.shop-order').change(function() {
      var opt = $(this).find(':selected');
      var orderName = $(opt).data('ordername'),
        order = $(opt).data('order');
      self._request['orders'] = [ { method : order, target: orderName } ];
      self.refresh();
    });
  },
  toggle: function() { // Toggle the box.
    $(this.navigatorBox).toggle();
  },
  destroy: function() {
    if (this.navigatorBox) $(this.changeLookBox).remove();
  }
});
