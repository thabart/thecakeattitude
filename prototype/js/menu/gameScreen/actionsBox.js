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
      this.launcher = new game.InteractionLauncher();
      this.addListeners();
      $(this.actions).hide();
      game.Stores.GameStore.listenDisplayActionsArrived(this.display.bind(this)); // Display entity actions.
      game.Stores.GameStore.hideDisplayActionsArrived(this.hide.bind(this));
  },
  addListeners: function() {
    var self = this;
    $(this.actions).find('.move').click(function() {
      var selectedEntity = game.Stores.GameStore.getSelectedEntity();
      var name = selectedEntity.getName();
      var flipped = selectedEntity.flipped;
      var selector = selectedEntity.selector;
      game.Stores.GameStore.setActiveEntity(name, selector, flipped);
      game.Stores.GameStore.removeEntity(selectedEntity);
      $(self.actions).hide();
      game.Stores.GameStore.hideInformation();
    });
    $(this.actions).find('.remove').click(function() {
      var selectedEntity = game.Stores.GameStore.getSelectedEntity();
      game.Stores.GameStore.removeEntity(selectedEntity);
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
      if ($(self.mgfurniture).is(':visible')) { return; }
      $(self.mgfurniture).show();
    });
    $(this.actions).find('.use').click(function() {
      var selectedEntity = game.Stores.GameStore.getSelectedEntity();
      var interaction = selectedEntity.metadata.interaction;
      self.launcher.launch(interaction);
    });
  },
  display: function(e, metadata) {
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
    if (this.display) game.Stores.GameStore.unsubscribeDisplayActionsArrived(this.display.bind(this));
    if (this.hide) game.Stores.GameStore.unsubscribeHideDisplayActionsArrived(this.hide.bind(this));
  }
});
