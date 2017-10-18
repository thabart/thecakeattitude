game.ActionsBox = me.Object.extend({
  init: function() {
      this.actions = $("<div class='actions-box'>"+
        "<button class='button button-blue move'>Déplacer</button>"+
        "<button class='button button-blue remove'>Supprimer</button>"+
        "<button class='button button-blue turn'>Tourner</button>"+
        "<button class='button button-blue translate'>Bouger</button>"+
      "</div>");
      $("#bottom-right-container").append(this.actions);
      this.addListeners();
      $(this.actions).hide();
      ShopStore.listenDisplayActionsArrived(this.display.bind(this)); // Display entity actions.
      ShopStore.hideDisplayActionsArrived(this.hide.bind(this));
  },
  addListeners: function() {
    var self = this;
    $(this.actions).find('.move').click(function() {
      var selectedEntity = ShopStore.getSelectedEntity();
      var name = selectedEntity.getName();
      var flipped = selectedEntity.flipped;
      var selector = selectedEntity.selector;
      ShopStore.setActiveEntity(name, selector, flipped);
      ShopStore.removeEntity(selectedEntity);
      $(self.actions).hide();
      ShopStore.hideInformation();
    });
    $(this.actions).find('.remove').click(function() {
      var selectedEntity = ShopStore.getSelectedEntity();
      ShopStore.removeEntity(selectedEntity);
      $(self.actions).hide();
      ShopStore.hideInformation();
    });
    $(this.actions).find('.turn').click(function() {
      var selectedEntity = ShopStore.getSelectedEntity();
      selectedEntity.flip();
      ShopStore.updateColls();
      me.game.repaint();
    });
    $(this.actions).find('.translate').click(function() {
      if ($(self.mgfurniture).is(':visible')) { return; }
      $(self.mgfurniture).show();
    });
  },
  display: function() {
    $(this.actions).show();
  },
  hide: function() {
    $(this.actions).hide();
  }
});
