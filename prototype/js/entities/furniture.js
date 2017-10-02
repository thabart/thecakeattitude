var Furniture = me.Sprite.extend(
{
   init:function (x, y, regionName)
   {
     this._super(me.Sprite, "init", [ x, y, {
        region: regionName,
        image: game.furnitures
     }]);
   }
});
