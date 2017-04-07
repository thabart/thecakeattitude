var Splash = function () {};
Splash.prototype = {
	init: function() {
		this.loadingBar = this.game.make.text(this.game.world.centerX, 380, 'Loading...', {fill: 'white'});
	},
	preload: function() {		
		var self = this;
		// LOAD ALL THE ASSETS.
		// this.game.load.crossOrigin = "anonymous";
		this.game.load.tilemap('firstMap', 'http://localhost:5000/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('secondMap', 'http://localhost:5000/maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tallgrass', 'http://localhost:5000/maps/tilesets/tallgrass.png');
		this.game.load.image('farming_fishing', 'http://localhost:5000/maps/tilesets/farming_fishing.png');
		this.game.load.image('plowed_soil', 'http://localhost:5000/maps/tilesets/plowed_soil.png');
		this.game.load.image('tiles', 'http://localhost:5000/maps/tilesets/tiles.png');
		this.game.load.image('floor', 'http://localhost:5000/shops/tilesets/floor.png');
		this.game.load.image('stuff', 'http://localhost:5000/shops/tilesets/stuff.png');
		this.game.load.image('player', 'http://localhost:5000/characters/phaser-dude.png');		
		this.game.load.image('addPlayer', 'http://localhost:5000/images/add-player.png');
		this.game.load.image('house', 'http://localhost:5000/maps/tilesets/house.png');
		this.game.load.image('freePlace', 'http://localhost:5000/maps/tilesets/freePlace.png');
		this.game.load.image('panel-info', 'http://localhost:5000/maps/tilesets/panel-info.png');
		this.game.load.image('bubble-tail', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVAgMAAADUeU0FAAAADFBMVEUAAAAAAAD////MzMyoZCTaAAAAAXRSTlMAQObYZgAAAC1JREFUCNdjCA3NWrXUAY36/xULxYyN+hu1amUAAyYVwoBBhYYyYFDh/w9gUADQUTeozcOYAwAAAABJRU5ErkJggg==');
		this.game.load.image('spacebar', 'http://localhost:5000/images/space-bar.png');
		this.game.load.image('start', 'http://localhost:5000/images/playbutton.png');
		this.game.load.image('background', 'http://localhost:5000/images/background.jpg');
		this.game.load.image('seller', 'http://localhost:5000/images/seller.png');
		this.game.load.image('shopper', 'http://localhost:5000/images/shopper.png');
		this.game.load.image('back', 'http://localhost:5000/images/back.gif');
		this.game.load.spritesheet('bubble-border', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbAgMAAADwuhzGAAAADFBMVEUAAAD///8AAADMzMyl8w72AAAAAXRSTlMAQObYZgAAADlJREFUCNdjYGDQWrWqgQGT5poaGpqFSTMtDQWCFRj0PyrR/3+B7cGgmf+/AroLk2bg////AwMGDQCR0FKxG5KiwAAAAABJRU5ErkJggg==', 9, 9);
		// this.game.load.spritesheet('villager', 'http://localhost:5000/characters/villager.png',  24, 24, 2);
		this.game.load.atlas('wraper', 'http://localhost:5000/characters/villager.png', 'public/sprites/wraper.json');
		this.game.load.atlas('stock_manager', 'http://localhost:5000/characters/villagegirl.png', 'public/sprites/stockManager.json');
		this.game.load.bitmapFont('8bitoperator', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAABF9JREFUSMftlEur00AUx6cI0UXqxd0UpXXh0sWEgShYLCgIih9iSmC6SW/FC1Kx1kdFXRTrzoZC1W8gBLrxlVBINxOzkwbxUQJ1c9WWQL0XveqZpFyrH0E8q5nfnMd/zpkEEebeua2eOHGC5Hp6pUVQvRyJIL++vo61nm56GIlYr1g2Sk11EMp05arIi8V6HIvcM3TZmlYe9jmY38u0c10kHM8cU37pN2AJaKYgBEASsC7BRAK/65nvKefNpv8tc6eTgNq4tEx6HWqKmQxZgtZu0iKAy73YWysm0t/b6G9TxVDrM7hoG+W6jKsKFgalrD6PBNK6jqGo0ivf8OG+y5CmmH+8zmUs8nvkS9hnfo/muZhHbQnMnC0BBSXaKtjD/a52fQkaAArct+ZtdLlHapbNrkJIIwnRpMdLlgUAcRCi7eYosMY8dgDoAJp10JFKIvMoCGiydBiH66emrClMMMcAUC+H4RvdyLWZAB84E/HGxobOctcJmn8YdY4jP4lSx5RA0WQMmWgyiURoY4FTEFNKdVOC7XjtvRwDAGIGVAVtKsbIt6TLpiOBrsrJfUtCPKqI7cXeThFdbklQEQWlkWrMWbE2iT7I5Z4pnXGkzhJeuPPowFDXywtYs2H5JyUiig19wBgSjnubEkqFZxi6PZzCsCGYXBv43mQ0GCgcnmH0aoNQPRhFLd32OLoQ65yepPqrEY/1AefQQgAzmYMblCfg2JSSa08OBZ4RGZAUPBSoUnhwd88TBJaGlGiilJj4MNKsKKjDDWy+0wJAUH0GlT9uhjbPtugXSza0uB1rbQliaFwbNW/ypLt9noMZvlHQwoNXcKMdtouatTDfqWjxmfldFzxwuQseGC1+bG3PypADuxASPkGXXjMXcgQUu1a0GT5CupcAj+KdpHcAuGtN7iSPI6/sbAH47nZB241o1KH7HQwAjijXWnKceQBgnxUAUmZL3yJo61umBSDT07PuPa4SJD+sNfDoVYLhHq6yBOT6vNzT1z3aFBLszcBX6UIOAQNferQbPlQZ55V6CtZKzG8Zo4dSXVpFZfVE6SHnDHIOgg7YxATaSBwBAO50srnTI6BUm3dl94MOZS6At3ZjiFF9PoUj5rZI9aFNPAxV9AQ8ndUO2mSYgjFtbPdI1bKJKx+uXutCDuBplfpWZXO8BH1y4QwS2JM5nJiKUCqFEMUMXzQdud7byfPkH9SBTSngxwRMGKYvD4tlXh0MTBcAGDXrpwwFQC0A8PF5Z8O8ZSmlT+CRA1B+4tHsxccqzwII7SIATrPnHmNetXml08cJyFy0SMm3OUNgElTPnTKQtH3VQQLMW8XT6pAb+w8twVHoqFIeDg/qR+7LKlfOI+wZx+adN8bZw+jrcxCuYuFJD5Ta2nsV5doyh9yJ+ZSFL5uqszyVLSxbbaSwXdCiQ6ziXQck4sxtjFbBQSpwCRYrOWpj1PgNGlAFFdAfpnjOym4nHpjmKlAVCFm17Az9t3/TfgG1wI+/NyjOhQAAAABJRU5ErkJggg==', null, '<?xml version="1.0"?><font><info face="8bitoperator" size="11" bold="0" italic="0" charset="" unicode="1" stretchH="100" smooth="0" aa="0" padding="0,0,0,0" spacing="1,1" outline="0"/><common lineHeight="16" base="13" scaleW="128" scaleH="128" pages="1" packed="0" alphaChnl="0" redChnl="4" greenChnl="4" blueChnl="4"/><pages><page id="0" file="8bitoperator.png" /></pages><chars count="179"><char id="32" x="124" y="23" width="1" height="1" xoffset="0" yoffset="0" xadvance="6" page="0" chnl="15" /><char id="33" x="124" y="13" width="2" height="9" xoffset="1" yoffset="4" xadvance="4" page="0" chnl="15" /><char id="34" x="113" y="84" width="5" height="4" xoffset="1" yoffset="4" xadvance="7" page="0" chnl="15" /><char id="35" x="49" y="38" width="8" height="9" xoffset="1" yoffset="4" xadvance="10" page="0" chnl="15" /><char id="36" x="7" y="0" width="6" height="13" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="37" x="57" y="78" width="7" height="8" xoffset="1" yoffset="5" xadvance="9" page="0" chnl="15" /><char id="38" x="85" y="37" width="7" height="9" xoffset="1" yoffset="4" xadvance="9" page="0" chnl="15" /><char id="39" x="122" y="84" width="2" height="4" xoffset="1" yoffset="4" xadvance="4" page="0" chnl="15" /><char id="40" x="123" y="66" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="41" x="15" y="80" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="42" x="77" y="85" width="7" height="5" xoffset="1" yoffset="6" xadvance="9" page="0" chnl="15" /><char id="43" x="92" y="85" width="6" height="5" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="44" x="119" y="84" width="2" height="4" xoffset="1" yoffset="11" xadvance="4" page="0" chnl="15" /><char id="45" x="49" y="95" width="5" height="1" xoffset="1" yoffset="8" xadvance="7" page="0" chnl="15" /><char id="46" x="125" y="84" width="2" height="2" xoffset="1" yoffset="11" xadvance="4" page="0" chnl="15" /><char id="47" x="101" y="25" width="6" height="10" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="48" x="84" y="57" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="49" x="25" y="79" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="50" x="91" y="57" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="51" x="98" y="56" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="52" x="105" y="56" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="53" x="112" y="56" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="54" x="77" y="57" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="55" x="119" y="56" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="56" x="0" y="70" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="57" x="7" y="70" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="58" x="56" y="87" width="2" height="7" xoffset="1" yoffset="6" xadvance="4" page="0" chnl="15" /><char id="59" x="33" y="79" width="2" height="9" xoffset="1" yoffset="6" xadvance="4" page="0" chnl="15" /><char id="60" x="117" y="66" width="5" height="9" xoffset="1" yoffset="4" xadvance="7" page="0" chnl="15" /><char id="61" x="7" y="98" width="5" height="3" xoffset="1" yoffset="7" xadvance="7" page="0" chnl="15" /><char id="62" x="122" y="46" width="5" height="9" xoffset="1" yoffset="4" xadvance="7" page="0" chnl="15" /><char id="63" x="14" y="70" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="64" x="58" y="37" width="8" height="9" xoffset="1" yoffset="4" xadvance="10" page="0" chnl="15" /><char id="65" x="21" y="69" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="66" x="28" y="69" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="67" x="35" y="69" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="68" x="42" y="68" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="69" x="49" y="68" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="70" x="56" y="68" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="71" x="63" y="67" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="72" x="70" y="67" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="73" x="20" y="80" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="74" x="77" y="67" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="75" x="84" y="67" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="76" x="14" y="60" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="77" x="8" y="50" width="7" height="9" xoffset="1" yoffset="4" xadvance="9" page="0" chnl="15" /><char id="78" x="91" y="67" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="79" x="98" y="66" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="80" x="24" y="49" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="81" x="0" y="27" width="6" height="11" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="82" x="31" y="49" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="83" x="38" y="48" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="84" x="45" y="48" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="85" x="52" y="48" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="86" x="59" y="47" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="87" x="101" y="36" width="7" height="9" xoffset="1" yoffset="4" xadvance="9" page="0" chnl="15" /><char id="88" x="66" y="47" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="89" x="73" y="47" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="90" x="80" y="47" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="91" x="10" y="80" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="92" x="73" y="26" width="6" height="10" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="93" x="5" y="80" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="94" x="105" y="84" width="7" height="4" xoffset="1" yoffset="3" xadvance="9" page="0" chnl="15" /><char id="95" x="43" y="96" width="5" height="1" xoffset="0" yoffset="14" xadvance="5" page="0" chnl="15" /><char id="96" x="32" y="97" width="3" height="2" xoffset="1" yoffset="3" xadvance="5" page="0" chnl="15" /><char id="97" x="107" y="76" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="98" x="87" y="47" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="99" x="14" y="90" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="100" x="101" y="46" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="101" x="100" y="76" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="102" x="105" y="66" width="5" height="9" xoffset="1" yoffset="4" xadvance="7" page="0" chnl="15" /><char id="103" x="109" y="36" width="7" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="104" x="108" y="46" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="105" x="122" y="25" width="4" height="10" xoffset="1" yoffset="3" xadvance="6" page="0" chnl="15" /><char id="106" x="21" y="14" width="6" height="12" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="107" x="115" y="46" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="108" x="0" y="80" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="109" x="76" y="77" width="8" height="7" xoffset="1" yoffset="6" xadvance="10" page="0" chnl="15" /><char id="110" x="93" y="77" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="111" x="114" y="76" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="112" x="0" y="60" width="6" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="113" x="7" y="60" width="6" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="114" x="35" y="89" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="115" x="7" y="90" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="116" x="111" y="66" width="5" height="9" xoffset="1" yoffset="4" xadvance="7" page="0" chnl="15" /><char id="117" x="0" y="90" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="118" x="121" y="76" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="119" x="85" y="77" width="7" height="7" xoffset="1" yoffset="6" xadvance="9" page="0" chnl="15" /><char id="120" x="21" y="90" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="121" x="94" y="46" width="6" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="122" x="28" y="89" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="123" x="21" y="59" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="124" x="30" y="79" width="2" height="9" xoffset="1" yoffset="4" xadvance="4" page="0" chnl="15" /><char id="125" x="28" y="59" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="126" x="13" y="98" width="7" height="2" xoffset="1" yoffset="7" xadvance="9" page="0" chnl="15" /><char id="160" x="126" y="56" width="1" height="1" xoffset="0" yoffset="0" xadvance="6" page="0" chnl="15" /><char id="161" x="125" y="36" width="2" height="9" xoffset="1" yoffset="6" xadvance="4" page="0" chnl="15" /><char id="162" x="35" y="59" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="163" x="16" y="49" width="7" height="9" xoffset="1" yoffset="4" xadvance="9" page="0" chnl="15" /><char id="165" x="42" y="58" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="166" x="36" y="79" width="2" height="9" xoffset="1" yoffset="4" xadvance="4" page="0" chnl="15" /><char id="168" x="21" y="98" width="6" height="2" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="169" x="48" y="78" width="8" height="8" xoffset="1" yoffset="5" xadvance="10" page="0" chnl="15" /><char id="171" x="59" y="87" width="8" height="5" xoffset="1" yoffset="6" xadvance="10" page="0" chnl="15" /><char id="172" x="0" y="98" width="6" height="3" xoffset="1" yoffset="8" xadvance="8" page="0" chnl="15" /><char id="174" x="39" y="79" width="8" height="8" xoffset="1" yoffset="5" xadvance="10" page="0" chnl="15" /><char id="176" x="99" y="85" width="5" height="5" xoffset="1" yoffset="3" xadvance="7" page="0" chnl="15" /><char id="177" x="42" y="88" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="180" x="28" y="97" width="3" height="2" xoffset="1" yoffset="3" xadvance="5" page="0" chnl="15" /><char id="181" x="49" y="58" width="6" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="182" x="0" y="50" width="7" height="9" xoffset="1" yoffset="4" xadvance="9" page="0" chnl="15" /><char id="183" x="40" y="97" width="2" height="2" xoffset="1" yoffset="7" xadvance="4" page="0" chnl="15" /><char id="184" x="36" y="97" width="3" height="2" xoffset="1" yoffset="13" xadvance="5" page="0" chnl="15" /><char id="187" x="68" y="85" width="8" height="5" xoffset="1" yoffset="6" xadvance="10" page="0" chnl="15" /><char id="191" x="56" y="58" width="6" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="192" x="73" y="0" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="193" x="42" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="194" x="42" y="0" width="6" height="13" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15" /><char id="195" x="65" y="0" width="7" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="196" x="87" y="0" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="197" x="28" y="0" width="6" height="13" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15" /><char id="198" x="38" y="38" width="10" height="9" xoffset="1" yoffset="4" xadvance="12" page="0" chnl="15" /><char id="199" x="108" y="0" width="6" height="12" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="200" x="28" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="201" x="49" y="13" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="202" x="35" y="0" width="6" height="13" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15" /><char id="203" x="94" y="0" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="204" x="122" y="0" width="4" height="12" xoffset="1" yoffset="1" xadvance="6" page="0" chnl="15" /><char id="205" x="77" y="13" width="4" height="12" xoffset="1" yoffset="1" xadvance="6" page="0" chnl="15" /><char id="206" x="14" y="0" width="6" height="13" xoffset="0" yoffset="0" xadvance="6" page="0" chnl="15" /><char id="207" x="101" y="0" width="6" height="12" xoffset="0" yoffset="1" xadvance="6" page="0" chnl="15" /><char id="208" x="93" y="36" width="7" height="9" xoffset="0" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="209" x="57" y="0" width="7" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="210" x="63" y="13" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="211" x="80" y="0" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="212" x="0" y="0" width="6" height="13" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15" /><char id="213" x="49" y="0" width="7" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="214" x="70" y="13" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="215" x="85" y="85" width="6" height="5" xoffset="1" yoffset="7" xadvance="8" page="0" chnl="15" /><char id="216" x="67" y="37" width="8" height="9" xoffset="0" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="217" x="35" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="218" x="14" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="219" x="21" y="0" width="6" height="13" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15" /><char id="220" x="7" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="221" x="0" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="222" x="63" y="57" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="223" x="70" y="57" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="224" x="87" y="25" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="225" x="94" y="25" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="226" x="110" y="13" width="6" height="11" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="227" x="14" y="27" width="7" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="228" x="45" y="27" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="229" x="82" y="13" width="6" height="11" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="230" x="65" y="77" width="10" height="7" xoffset="1" yoffset="6" xadvance="12" page="0" chnl="15" /><char id="231" x="59" y="26" width="6" height="10" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="232" x="108" y="25" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="233" x="21" y="38" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="234" x="7" y="27" width="6" height="11" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="235" x="115" y="25" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="236" x="33" y="38" width="4" height="10" xoffset="1" yoffset="3" xadvance="6" page="0" chnl="15" /><char id="237" x="28" y="38" width="4" height="10" xoffset="1" yoffset="3" xadvance="6" page="0" chnl="15" /><char id="238" x="117" y="13" width="6" height="11" xoffset="0" yoffset="2" xadvance="6" page="0" chnl="15" /><char id="239" x="0" y="39" width="6" height="10" xoffset="0" yoffset="3" xadvance="6" page="0" chnl="15" /><char id="240" x="117" y="36" width="7" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="241" x="22" y="27" width="7" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="242" x="7" y="39" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="243" x="14" y="38" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="244" x="103" y="13" width="6" height="11" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="245" x="30" y="27" width="7" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="246" x="38" y="27" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="247" x="49" y="87" width="6" height="7" xoffset="1" yoffset="5" xadvance="8" page="0" chnl="15" /><char id="248" x="76" y="37" width="8" height="9" xoffset="0" yoffset="5" xadvance="8" page="0" chnl="15" /><char id="249" x="52" y="26" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="250" x="66" y="26" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="251" x="96" y="13" width="6" height="11" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="252" x="80" y="26" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="253" x="115" y="0" width="6" height="12" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="254" x="89" y="13" width="6" height="11" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="255" x="56" y="13" width="6" height="12" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /></chars></font>');
		this.game.load.script('Map', 'public/game/Map.js');
		this.game.load.script('Player', 'public/game/Player.js');
		this.game.load.script('SpeechBubble', 'public/game/SpeechBubble.js');
		this.game.load.script('Game', 'public/states/Game.js');
		this.game.load.script('Menu', 'public/states/Menu.js');
		this.game.load.script('CharacterChooser', 'public/states/CharacterChooser.js');
		this.game.load.script('Connect', 'public/states/Connect.js');
		this.game.load.script('Warper', 'public/characters/warper.js');
		this.game.load.script('Shop', 'public/characters/shop.js');
		this.game.load.script('StockManager', 'public/characters/stockManager.js');
		this.game.load.script('InfoPanel', 'public/characters/panelInfo.js');
		this.game.add.existing(this.loadingBar);
	},
	create: function() {
		var self = this;
		this.game.state.add('Connect', Connect);
		this.game.state.add('Menu', Menu);
		this.game.state.add('CharacterChooser', CharacterChooser);
		this.game.state.add('Game', Game);
		 setTimeout(function () {
		  self.game.state.start("Connect");
		}, 1000);
	}
};