'use strict';
var AddProductCharacteristicTab = function() { };
AddProductCharacteristicTab.prototype = {
  render: function() {
    var self = this,
      previous = $.i18n('previous'),
      addProduct = $.i18n('addProduct'),
      add = $.i18n('add'),
      addProductFiltersHelp = $.i18n('addProductFiltersHelp'),
      characteristicName = $.i18n('characteristicName');
    self.tab = $("<div>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<p>"+addProductFiltersHelp+"</p>"+
          "<form class='add-characteristic-form'>"+
            "<div class='col-4'>"+
              "<label>"+characteristicName+"</label>"+
            "</div>"+
            "<div class='col-8'>"+
              "<div class='col-8'>"+
                "<input type='text' class='input-control characteristic-name' />"+
              "</div>"+
              "<div class='col-4'>"+
                "<button class='action-btn add-characteristic'>"+add+"</button>"+
              "</div>"+
            "</div>"+
          "</form>"+
          "<div class='characteristics-container'></div>"+
        "</div>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn add'>"+addProduct+"</button>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.add-characteristic-form').submit(function(e) {
      e.preventDefault();
      var characteristicName = $(self.tab).find('.characteristic-name').val();
      var characteristicNames = $.map($(self.tab).find('.characteristics-container .filter-name'), function(c) {
        return $(c).html();
      });
      var filteredCharacteristics = characteristicNames.filter(function(c) { return c ===  characteristicName });
      if (!filteredCharacteristics || filteredCharacteristics.length === 0) {
        var rec = $("<div class='product-characteristic'><div class='col-3 filter-name'>"+characteristicName+"</div><div class='col-6'><input type='text' name='tags' class='characteristic-values' /></div><div class='col-3'><button class='action-btn remove'>"+$.i18n('remove')+"</button></div></div>");
        $(self.tab).find('.characteristics-container').append(rec);
        $(rec).find('.characteristic-values').selectize({
          create: function(input) {
            return {
              value: input,
              text: input
            };
          }
        });
        $(rec).find('.remove').click(function() {
          $(this).parent('.product-characteristic').remove();
        });
      }
    });
    $(self.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(self.tab).find('.add').click(function() {
      $(self).trigger('confirm');
    });
    return self.tab;
  },
  reset: function() {
    var self = this;
    $(self.tab).find('.characteristics-container').empty();
  }
};
