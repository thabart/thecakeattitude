game.ShopScreen = me.ScreenObject.extend({
    onResetEvent: function() {
      me.levelDirector.loadLevel("map");
      this.refLayer = me.game.world.getChildByName("Ground")[0];
      var movableContainer = new game.MovableContainer();
      this._buildingLayer = me.game.world.getChildByName('Building', {
        "container": movableContainer
      });
      me.game.world.addChild(movableContainer);
      me.game.world.addChild(new FurnitureSelector());
      this.addFloatingMenu();
      me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
        me.event.publish("pointermove", [ event ]);
      }, false);
      me.input.registerPointerEvent("pointerdown", me.game.viewport, function (event) {
        me.event.publish("pointerdown", [ event ]);
      }, false);
      me.game.repaint();
    },

    onDestroyEvent: function() {
        me.event.unsubscribe(this.handlePointerMove);      
    },

    addFloatingMenu: function() {
      var self = this;
      var menu = $("<ul class='list'><li>Table</li></ul>");
      $(".floating-menu").append(menu);
      $(menu).find('li').click(function(e) {
          if ($(this).hasClass('active')) {
            return;
          }
          
          $(this).addClass('active');
          ShopStore.setSelectedFurniture('table');
      });
    }
});
