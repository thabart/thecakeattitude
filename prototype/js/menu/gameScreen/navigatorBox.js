game.Menu = game.Menu || {};
game.Menu.NavigatorBox = me.Object.extend({
  init: function() {
    this._request = { count: 5, start_index: 0 };
    var currentUser = game.Stores.UserStore.getCurrentUser();
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
              "<div style='padding: 10px;' class='tab-container'>"+
                "<div class='shops-tab tab' style='height: 500px;'>"+
                  "<div class='col-4'>"+
                    // ORDER BY
                    "<div class='gray-panel'>"+
                      "<div class='top'></div>"+
                      "<div class='body'>"+
                        "<div>"+ // Display order by.
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
                        ( currentUser && !currentUser.is_visitor ? "<div><input type='checkbox' class='displayMyShops' /> <label data-i18n='display-my-shops'></label></div>"  : "" ) +
                      "</div>"+
                       "<div class='bottom'></div>"+
                    "</div>"+
                    // FILTER ON CATEGORIES.
                    "<div class='gray-panel' style='padding-top: 5px;'>"+
                      "<div class='top'></div>"+
                      "<div class='body shop-categories-loading' data-i18n='loading' style='display: none;' />"+
                      "<div class='body shop-categories-container'>"+
                        "<a href='#' class='clear-filter' data-i18n='clear-filter'></a>"+
                        "<div class='treeview filters'>"+
                          "<ul class='shop-categories'></ul>"+
                        "</div>"+
                      "</div>"+
                       "<div class='bottom'></div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='col-8'>"+ // Display the shops.
                    "<div class='shops-loading' data-i18n='loading' style='display: none;'></div>"+
                    "<div class='shops-container'>"+
                      "<ul class='list shops' style='padding: 0 10px 0 10px'></ul>"+
                      "<ul class='navigations'></ul>"+
                    "</div>"+
                  "</div>"+
                "</div>"+
                "<div class='rooms-tab tab' style='display: none; height: 500px;'>"+
                  "<ul class='place-selector'>"+
                    "<li class='navigate-coffee-house'>"+
                      "<img src='/img/icons/coffee-house.png' />"+
                      "<div data-i18n='coffee-house'></div>"+
                    "</li>"+
                    "<li class='navigate-reception'>"+
                      "<img src='/img/icons/reception.png' />"+
                      "<div data-i18n='reception'></div>"+
                    "</li>"+
                  "</ul>"+
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
    this.refreshShops();
    this.refreshShopCategories();
    this.addListeners();
  },
  refreshShops: function() { // Refresh the shops.
    var self = this;
    self.displayShopsLoading(true);
    $(self.navigatorBox).find('.list.shops').empty();
    game.Services.ShopsService.search(this._request).then(function(r) { // Display the shops.
      var shops = r['_embedded'],
        navigation = r['_links']['navigation'];
      if (!(shops instanceof Array)) {
        shops = [shops];
      }

      self.displayShops(shops);
      self.displayNavigation(navigation);
      self.displayShopsLoading(false);
    }).catch(function() {
      self.displayShopsLoading(false);
    });
  },
  refreshShopCategories: function() { // Refresh the shop categories.
    var self = this;
    self.displayShopCategoriesLoading(true);
    game.Services.ShopCategoriesService.getAll().then(function(result) { // Display the categories.
      var shopCategories = result['_embedded'];
      var shopCategoriesElt = $(self.navigatorBox).find('.shop-categories');
      shopCategories.forEach(function(shopCategory) {
        if (shopCategory.parent_id && shopCategory.parent_id !== null) { return; }
        var parent = $("<li>"+
          "<span class='node-toggle'></span>"+
          "<span>"+shopCategory.name+"</span>"+
          "<ul class='children'></ul>"+
        "</li>");
        if (shopCategory.children) {
          var childrenElt = parent.find('.children');
          shopCategory.children.forEach(function(child) {
            var elt = $("<li data-id='"+child.id+"' class='filter'>"+child.name+"</li>");
            childrenElt.append(elt);
            $(elt).click(function() {
              self._request.category_id = [ $(this).data('id') ];
              $(self.navigatorBox).find('.shop-categories .filter').removeClass('active');
              $(this).addClass('active');
              self.refreshShops();
            });
          });
        }
        shopCategoriesElt.append(parent);
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
      self.displayShopCategoriesLoading(false);
    }).catch(function() {
      self.displayShopCategoriesLoading(false);
    });
  },
  displayShops: function(shops) { // Display the shops.
    var self = this;
    $(self.navigatorBox).find('.shops').empty();
    shops.forEach(function(shop) {
      var profileImage = shop.profile_image;
      if (!profileImage) {
        profileImage = "/img/default-shop.png";
      }

      var currentUser = game.Stores.UserStore.getCurrentUser();
      var isOwner = currentUser && currentUser.sub && shop.subject === currentUser.sub;
      var elt = $("<li data-id='"+shop.id+"' style='cursor: pointer;'>"+
        "<div class='col-3'>"+
          "<img src='"+profileImage+"' width='50' />"+
        "</div>"+
        "<div class='col-9'>"+
          "<h3 class='no-style' style='display: inline-block;'>"+shop.name+"</h3>" + ( isOwner ? "<span data-i18n='mine' style='margin-left: 5px;' class='badge green' style='font-style: oblique;'></span>" : "" ) +
          "<div class='score' style='padding: 3px 0px 3px 0px;'></div>"+
          "<ul class='tags'></ul>"+
        "</div>"+
      "</li>");
      $(elt).click(function() {
        var id = $(this).data('id');
        me.loader.onload = function() {
          me.state.change(me.state.PLAY, "shop", id);
        };
        me.loader.preload({});
        me.state.change(me.state.LOADING)
      });
      shop.tags.forEach(function(tag) {
        elt.find('ul').append("<li>"+tag+"</li>");
      });
      $(self.navigatorBox).find('.shops').append(elt);
      $(elt).i18n();
      $(elt).find('.score').rateYo({
        rating: shop.average_score,
        readOnly: true,
        starWidth: "10px"
      });
    });
  },
  displayNavigation: function(navigation) { // Display the navigation bar.
    var self = this;
    self.navigation
    $(self.navigatorBox).find('.navigations').empty();
    if (navigation && navigation.length > 0) {
      var indice = 0;
      navigation.forEach(function(nav) {
        var n = $("<li class='"+( indice === 0 ? "active": "" )+"'>"+nav.name+"</li>");
        $(self.navigatorBox).find('.navigations').append(n);
        $(n).click(function() {
          $(self.navigatorBox).find('.navigations li').removeClass('active');
          $(this).addClass('active');
          var page = $(this).html();
          self._request.start_index = self._request.count * (parseInt(page) - 1);
          self.displayShopsLoading(true);
          game.Services.ShopsService.search(self._request).then(function(r) {
            var shops = r['_embedded'],
              navigation = r['_links']['navigation'];
            if (!(shops instanceof Array)) {
              shops = [shops];
            }

            self.displayShops(shops);
            self.displayShopsLoading(false);
          }).catch(function() {
            self.displayShopsLoading(false);
          });
        });
        indice++;
      });
    }
  },
  displayShopsLoading: function(b) { // Display shops loader.
    if (b) {
      $(this.navigatorBox).find('.shops-container').hide();
      $(this.navigatorBox).find('.shops-loading').show();
    } else {
      $(this.navigatorBox).find('.shops-container').show();
      $(this.navigatorBox).find('.shops-loading').hide();
    }
  },
  displayShopCategoriesLoading: function(b) { // Display shop categories loader.
    if (b) {
      $(this.navigatorBox).find('.shop-categories-container').hide();
      $(this.navigatorBox).find('.shop-categories-loading').show();
    } else {
      $(this.navigatorBox).find('.shop-categories-container').show();
      $(this.navigatorBox).find('.shop-categories-loading').hide();
    }
  },
  addListeners: function() { // Add listeners.
    var self = this;
    $(self.navigatorBox).find('.menu li').click(function() {
      $(self.navigatorBox).find('.tabs li').removeClass('active');
      $(this).addClass('active');
      $(self.navigatorBox).find('.tab').hide();
      var target = $(this).data('target');
      $(self.navigatorBox).find(target).show();
    });
    $(self.navigatorBox).find('.close').click(function() {
      $(self.navigatorBox).hide();
    });
    $(self.navigatorBox).find('.shop-order').change(function() {
      var opt = $(this).find(':selected');
      var orderName = $(opt).data('ordername'),
        order = $(opt).data('order');
      self._request['orders'] = [ { method : order, target: orderName } ];
      self.refreshShops();
    });
    $(self.navigatorBox).find('.navigate-coffee-house').click(function() {
      me.loader.onload = function() {
        me.state.change(me.state.PLAY, "coffee-house");
      };
      me.loader.preload({});
      me.state.change(me.state.LOADING);
    });
    $(self.navigatorBox).find('.navigate-reception').click(function() {
      me.loader.onload = function() {
        me.state.change(me.state.PLAY, "reception");
      };
      me.loader.preload({});
      me.state.change(me.state.LOADING);
    });
    $(self.navigatorBox).find('.clear-filter').click(function(e) {
      e.preventDefault();
      self._request.category_id = [ ];
      $(self.navigatorBox).find('.shop-categories .filter').removeClass('active');
      self.refreshShops();
    });
    $(self.navigatorBox).find('.displayMyShops').change(function() {
      var isChecked = $(this).is(':checked');
      if (isChecked) {
        var currentUser = game.Stores.UserStore.getCurrentUser();
        self._request['subject'] = [ currentUser.sub ];
      } else {
        self._request['subject'] = [ ];
      }

      self.refreshShops();
    });
  },
  toggle: function() { // Toggle the box.
    $(this.navigatorBox).toggle();
  },
  destroy: function() {
    if (this.navigatorBox) $(this.navigatorBox).remove();
  }
});
