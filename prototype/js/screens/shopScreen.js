game.ShopScreen = me.ScreenObject.extend({
    onResetEvent: function() {
      me.levelDirector.loadLevel("map");
      this.refLayer = me.game.world.getChildByName("Ground")[0];
      var movableContainer = new game.MovableContainer();
      var tileSelector = new game.TileSelector(2);
      var furnitureSelector = new game.FurnitureSelector(5);
      this._buildingLayer = me.game.world.getChildByName('Building', {
        "container": movableContainer
      });
      me.game.world.addChild(movableContainer);
      this.addFloatingMenu();
      me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
        me.event.publish("pointermove", [ event ]);
      }, false);
      me.input.registerPointerEvent("pointerdown", me.game.viewport, function (event) {
        me.event.publish("pointerdown", [ event ]);
      }, false);
    },

    onDestroyEvent: function() {
        me.event.unsubscribe(this.handlePointerMove);
    },

    addFloatingMenu: function() {
      var self = this;
      var menu = $("<div><ul class='list'>"+
          "<li data-furniture='table'>Table</li>"+
          "<li data-furniture='sofatable'>Sofa table</li>"+
          "<li data-furniture='chair'>Chair</li>"+
          "</ul><input type='checkbox' id='rotate' /> Rotate</div>");
      $(".floating-menu").append(menu);
      $(menu).find('li').click(function(e) {
          if ($(this).hasClass('active')) {
            return;
          }

          $(menu).find('li').removeClass('active');
          $(this).addClass('active');
          ShopStore.setSelectedFurniture($(this).data('furniture'));
      });
      $(menu).find('#rotate').click(function(e) {
        if ($(this).is(':checked')) {
          ShopStore.setOrientation('column');
        } else {
          ShopStore.setOrientation('row');
        }
      });
    }
});
