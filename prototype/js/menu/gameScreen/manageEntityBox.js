game.Menu = game.Menu || {};
game.Menu.ManageEntityBox = me.Object.extend({
  init: function() {
      var self = this;
      this.mgfurniture = $("<div class='furniture-box'>"+
        "<div class='top'>"+
          "Gérer les coordonnées <div class='close'></div>"+
        "</div>"+
        "<div class='body'>"+
          "<div><label>Abscisse (x)</label><input type='range' class='abs' min='-100' max='100'></div>"+
          "<div><label>Ordonnée (y)</label><input type='range' class='ord' min='-100' max='100'></div>"+
        "</div>"+
        "<div class='bottom'>"+
        "</div>"+
      "</div>");
      $(document.body).append(this.mgfurniture);
      $(this.mgfurniture).hide();
      $(this.mgfurniture).draggable({ "handle": ".top" });
  },
  addListeners: function() {
    $(this.mgfurniture).find('.abs').on('input', function(e) {
      var selectedEntity = game.Stores.GameStore.getSelectedEntity();
      if (!selectedEntity) {
        return;
      }

      var val = $(this).val();
      selectedEntity.translateX(parseInt(val));
      me.game.repaint();
    });
    $(this.mgfurniture).find('.ord').on('input', function(e) {
      var selectedEntity = game.Stores.GameStore.getSelectedEntity();
      if (!selectedEntity) {
        return;
      }

      var val = $(this).val();
      selectedEntity.translateY(parseInt(val));
      me.game.repaint();
    });
    $(this.mgfurniture).find('.close').click(function() {
      $(self.mgfurniture).hide();
    });
  },
  destroy: function() {
    if (this.mgfurniture) $(this.mgfurniture).remove();
  }
});
