game.Menu = game.Menu || {};
game.Menu.ActionsBox = me.Object.extend({
  init: function() {
      this.actions = $("<div class='actions-box'>"+
        "<button class='button button-gray move' data-i18n='move'></button>"+
        "<button class='button button-gray remove' data-i18n='remove'></button>"+
        "<button class='button button-gray turn' data-i18n='turn'></button>"+
        "<button class='button button-gray translate' data-i18n='translate'></button>"+
        "<button class='button button-gray use' data-i18n='use'></button>"+
      "</div>");
      $("#bottom-right-container").append(this.actions);
      this.launcher = new game.Interactions.Launcher ();
      this.mgfurniture = new game.Menu.ManageEntityBox();
      this.addListeners();
      $(this.actions).hide();
      this.displayB = this.display.bind(this);
      this.hideB = this.hide.bind(this);
      game.Stores.GameStore.listenDisplayActionsArrived(this.displayB); // Display entity actions.
      game.Stores.GameStore.hideDisplayActionsArrived(this.hideB);
      $(this.actions).i18n();
  },
  addListeners: function() {
    var self = this;
    $(this.actions).find('.move').click(function() {
      var selectedEntity = game.Stores.GameStore.getSelectedEntity();
      var name = selectedEntity.getName();
      game.Stores.GameStore.setActiveEntity(name, selectedEntity.selector, selectedEntity.metadata.type, selectedEntity.flipped, selectedEntity.metadata.product_category);
      game.Stores.GameStore.removeEntity(selectedEntity, true);
      $(self.actions).hide();
      game.Stores.GameStore.hideInformation();
    });
    $(this.actions).find('.remove').click(function() {
      var selectedEntity = game.Stores.GameStore.getSelectedEntity();
      game.Stores.GameStore.removeEntity(selectedEntity, true);
      $(self.actions).hide();
      game.Stores.GameStore.hideInformation();
    });
    $(this.actions).find('.turn').click(function() {
      var selectedEntity = game.Stores.GameStore.getSelectedEntity();
      selectedEntity.flip();
      game.Stores.GameStore.updateColls();
      me.game.repaint();
      game.Stores.GameStore.updateEntity(selectedEntity, true);
    });
    $(this.actions).find('.translate').click(function() {
      self.mgfurniture.toggle();
    });
    $(this.actions).find('.use').click(function() {
      var selectedEntity = game.Stores.GameStore.getSelectedEntity();
      var type = selectedEntity.metadata.type;
      if (!type) {
        return;
      }

      self.launcher.launch(type, selectedEntity.metadata);
    });
  },
  display: function(e, metadata) {
    var user = game.Stores.UserStore.getCurrentUser();
    var shop = game.Stores.GameStore.getShopInformation();
    if (!metadata.type && (!shop || user.sub !== shop.subject)) {
      return;
    }

    $(this.actions).show();
    $(this.actions).find('button').hide();
    $(this.actions).find('button').prop('disabled', true);
    if (metadata.type) {
      $(this.actions).find('.use').show();
      $(this.actions).find('.use').prop('disabled', false);
    }

    if (shop && user.sub === shop.subject) {
      $(this.actions).find('.move, .remove, .turn, .translate').show();
      $(this.actions).find('.move, .remove, .turn, .translate').prop('disabled', false);
    }
  },
  hide: function() {
    $(this.actions).hide();
  },
  destroy: function() {
    if (this.actions) $(this.actions).remove();
    if (this.displayB) game.Stores.GameStore.unsubscribeDisplayActionsArrived(this.displayB);
    if (this.hideB) game.Stores.GameStore.unsubscribeHideDisplayActionsArrived(this.hideB);
  }
});
