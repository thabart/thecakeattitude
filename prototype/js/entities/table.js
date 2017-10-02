var Table = me.Sprite.extend(
{
   init:function (x, y)
   {
     this._super(me.Sprite, "init", [ x, y, {
       image: "table"
     }]);
   }
});
