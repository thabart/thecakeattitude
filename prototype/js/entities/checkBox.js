var CheckBox = me.GUI_Object.extend({
    init: function(x, y, on_label, off_label, callback) {
        this._super(me.GUI_Object, "init", [ x, y, {
            image: game.texture,
            region : "green_boxCheckmark" // default
        } ]);
        this.callback = callback;
        this.on_icon_region = game.texture.getRegion("green_boxCheckmark");
        this.off_icon_region = game.texture.getRegion("grey_boxCheckmark");
        this.anchorPoint.set(0, 0);
        this.setOpacity(0.5);
        this.isSelected = true;
        this.label_on = on_label;
        this.label_off = off_label;
        this.font = new me.Font("kenpixel", 12, "black");
        this.font.textAlign = "left";
        this.font.textBaseline = "middle";
    },

    onOver : function () {
        this.setOpacity(1.0);
    },

    onOut : function () {
        this.setOpacity(0.5);
    },

    setSelected : function (selected) {
        if (selected) {
            this.setRegion(this.on_icon_region);
            this.isSelected = true;
        } else {
            this.setRegion(this.off_icon_region);
            this.isSelected = false;
        }
    },

    onClick : function (/* event */) {
        this.setSelected(!this.isSelected);
        if (this.callback) {
          this.callback(this.isSelected);
        }

        return false;
    },

    draw: function(renderer) {
        this._super(me.GUI_Object, "draw", [ renderer ]);
        var alpha = renderer.globalAlpha();
        renderer.setGlobalAlpha(alpha * this.getOpacity());
        this.font.draw(renderer,
            " " + (this.isSelected ? this.label_on : this.label_off),
            this.pos.x + this.width,
            this.pos.y + this.height / 2
        );
        renderer.setGlobalAlpha(alpha);
    }
});
