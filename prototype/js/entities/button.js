// create a basic GUI Object
var Button = me.GUI_Object.extend(
{
   init:function (x, y, label, callback)
   {
     this.callback = callback;
      // super constructor
      this._super(me.GUI_Object, "init", [x, y, {
        region: "green_button04",
        image: game.texture
      }]);
      this.unclicked_region = game.texture.getRegion("green_button04");
      this.clicked_region = game.texture.getRegion("green_button05");
      this.anchorPoint.set(0, 0);
      this.setOpacity(0.5);
      this.pos.z = 4;
      this.font = new me.Font("kenpixel", 12, "black");
      this.font.textAlign = "center";
      this.font.textBaseline = "middle";
      this.label = label;
   },

   onClick:function (event)
   {
     if (this.callback) {
       this.callback();
     }

     return true;
   },

  onRelease : function (/* event */) {
      this.setRegion(this.unclicked_region);
      this.pos.y -= this.unclicked_region.height - this.height;
      this.height = this.unclicked_region.height;
      return false;
  },

    draw: function(renderer) {
        this._super(me.GUI_Object, "draw", [ renderer ]);
        this.font.draw(renderer,
            this.label,
            this.pos.x + this.width / 2,
            this.pos.y + this.height / 2
        );
    },
});
