var game = {
    onload: function() {
        if (!me.video.init(1200, 600, { wrapper : "screen", scale : me.device.getPixelRatio()})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        if (me.game.HASH.debug === true) {
          window.onReady(function () {
            me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
          });
        }

        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(g_ressources);
        me.state.change(me.state.LOADING);
    },

    loaded: function () {
        game.texture = new me.video.renderer.Texture(
            me.loader.getJSON("UI_Assets"),
            me.loader.getImage("UI_Assets")
        );

        me.game.world.autoSort = true;
        me.game.world.sortOn = 'y';
        me.state.set(me.state.PLAY, new game.Screens.GameScreen());
        me.state.set(me.state.MENU, new game.MenuScreen());
        me.state.transition("fade","#FFFFFF", 250);
        var accessToken = sessionStorage.getItem(Constants.sessionName);
        game.Services.UserService.getClaims(accessToken).then(function(player) {
            game.Stores.UserStore.setCurrentUser(player);            
            me.loader.load({ name: player.name, src: 'resources/players/'+player.figure+'/sprite.png', type: 'image' }, function() {
                me.state.change(me.state.PLAY, "reception");
            });
        }).catch(function() {
            sessionStorage.removeItem(Constants.sessionName);
            me.state.change(me.state.MENU);
        });
    }
};


window.onReady(function() {
    // document.oncontextmenu = document.body.oncontextmenu = function() { return false; }
    var i18n = $.i18n(); // Initialize translations.
    i18n.locale = 'en';
    i18n.load('/js/i18n/'+ i18n.locale +'.json', i18n.locale).done(function() {
      game.onload();
    });
    $.i18n.debug = true;
});
