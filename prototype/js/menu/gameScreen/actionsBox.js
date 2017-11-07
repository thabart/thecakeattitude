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
      // this.launcher = new game.InteractionLauncher();
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
      var flipped = selectedEntity.flipped;
      var selector = selectedEntity.selector;
      game.Stores.GameStore.setActiveEntity(name, selector, flipped);
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
    });
    $(this.actions).find('.translate').click(function() {
      self.mgfurniture.toggle();
    });
    $(this.actions).find('.use').click(function() {
      /*
      var selectedEntity = game.Stores.GameStore.getSelectedEntity();
      var interaction = selectedEntity.metadata.interaction;
      self.launcher.launch(interaction);
      */
    });
  },
  display: function(e, metadata) {
    var user = game.Stores.UserStore.getCurrentUser();
    var shop = game.Stores.GameStore.getShopInformation();
    console.log(user.sub+" "+shop.subject);
    if (user.sub !== shop.subject) { return; }
    if (metadata.interaction && metadata.interaction !== '') {
      $(this.actions).find('.use').show();
    } else {
      $(this.actions).find('.use').hide();
    }

    $(this.actions).show();
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
