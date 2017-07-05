'use strict';
var AddProductCharacteristicTab = function() { };
AddProductCharacteristicTab.prototype = {
  render: function() {
    var self = this,
      previous = $.i18n('previous'),
      addProduct = $.i18n('addProduct'),
      add = $.i18n('add'),
      addProductFiltersHelp = $.i18n('addProductFiltersHelp'),
      chooseCharacteristic = $.i18n('chooseCharacteristic');
    self.shop = ShopMapStateStore.getShop();
    self.tab = $("<div class='add-product-characteristic-tab'>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<p>"+addProductFiltersHelp+"</p>"+
          "<div>"+
            "<div class='col-4'>"+
              "<label>"+chooseCharacteristic+"</label>"+
            "</div>"+
            "<div class='col-8'>"+
              "<div class='col-9'>"+
                "<select class='input-control characteristic-selector'></select>"+
              "</div>"+
              "<div class='col-3'>"+
                "<button class='action-btn add-characteristic floatRight'>"+add+"</button>"+
              "</div>"+
            "</div>"+
          "</div>"+
          "<div class='product-characteristics-container'></div>"+
        "</div>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn add'>"+addProduct+"</button>"+
      "</div>"+
    "</div>");
    if (self.shop.filters) {
      self.shop.filters.forEach(function(filter) {
        $(self.tab).find('.characteristic-selector').append("<option value='"+filter.id+"'>"+filter.name+"</option>");
      });
    }
    $(self.tab).find('.add-characteristic').click(function() {
      var selectedOption = $(self.tab).find('.characteristic-selector option:selected');
      var characteristicId = $(selectedOption).attr('value');
      var characteristicName = $(selectedOption).html();
      if (!characteristicName || !characteristicId) {
        return;
      }

      var characteristicNames = $.map($(self.tab).find('.product-characteristics-container .filter-name'), function(c) {
        return $(c).html();
      });
      var filteredCharacteristics = characteristicNames.filter(function(c) { return c ===  characteristicName });
      if (!filteredCharacteristics || filteredCharacteristics.length === 0) {
        var rec = $("<div class='product-characteristic' data-id='"+characteristicId+"'><div class='col-3 filter-name'>"+characteristicName+"</div><div class='col-6'><input type='text' name='tags' class='characteristic-values' /></div><div class='col-3'><button class='action-btn remove'>"+$.i18n('remove')+"</button></div></div>");
        $(self.tab).find('.product-characteristics-container').append(rec);
        selectedOption.remove();
        $(rec).find('.characteristic-values').selectize({
          create: false,
          labelField: 'content',
          searchField: 'content',
          valueField: 'id',
          render: {
            option: function(item, escape) {
              return "<div><span class='title'>"+item.content+"</span></div>";
            }
          },
          load: function(query, callback) {
            var id = $(this.$input).closest('.product-characteristic').data('id');
            var filter = self.shop.filters.filter(function(f) { return f.id === id })[0];
            var filterValues = filter.values.filter(function(f) { return f.content.toLowerCase().indexOf(query.toLowerCase()) !== -1 });
            if (filterValues && filterValues.length > 0) {
              callback(filterValues);
              return;
            }

            callback();
          }
        });
        $(rec).find('.remove').click(function() {
          var productCharacteristic = $(this).closest('.product-characteristic');
          $(self.tab).find('.characteristic-selector').append("<option value='"+$(productCharacteristic).data('id')+"'>"+$(productCharacteristic).find('.filter-name').html()+"</option>");
          productCharacteristic.remove();
        });
      }
    });
    $(self.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(self.tab).find('.add').click(function() {
      var filters = [];
      $(self.tab).find('.characteristic-values').each(function() {
        if (!this.selectize) {
          return;
        }

        var items = this.selectize.items;
        var filterId = $(this).closest('.product-characteristic').data('id');
        items.forEach(function(item) {
          filters.push({
            value_id: item,
            filter_id: filterId
          });
        });
      });

      $(self).trigger('confirm', [ { data: filters }]);
    });
    return self.tab;
  },
  reset: function() {
    var self = this;
    $(self.tab).find('.characteristics-container').empty();
  }
};
