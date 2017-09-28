var ZoomContainer = me.Container.extend({
    init: function (name) {
        this._super(me.Container, "init");
        this.name = name;
        this.zoom = 1;
        this.zoomX = this.zoomY = 0;
    },
    draw: function (renderer, rect) {
        renderer.save();
        renderer.translate(this.zoomX, this.zoomY);
        renderer.scale(this.zoom, this.zoom);
        renderer.translate(-this.zoomX, -this.zoomY);
        this._super(me.Container, "draw", [ renderer, rect ]);
        renderer.restore();
    }
});
