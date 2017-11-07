/**
 * ressources
 */

var g_ressources = [
    { name: "UI_Assets",    type: "image",  src: "resources/UI_Assets.png" }, // UI texture pack.
    { name: "UI_Assets",    type: "json",  src: "resources/UI_Assets.json" },
    { name: "reception_map",     type: "tmx",    src: "resources/reception-map.tmx" }, // Load the reception map.
    { name: "shop_map",     type: "tmx",    src: "resources/shop-map.tmx" }, // Load the shop map.
    { name: "wall_right", type: "image", src: "resources/wall_right.png" },
    { name: "wall_left", type: "image", src: "resources/wall_left.png" },
    { name: "gallery_n10", type: "image", src: "resources/gallery_n10.gif" },
    { name: "floor", type: "image", src: "resources/floor.png" },
    { name: "coffee_shop_map", type: "tmx", src: "resources/coffee-house/habbo-coffee-house.tmx" }, // Load the COFFEE SHOP MAP.
    { name: "wood-floor", type: "image", src: "resources/coffee-house/wood-floor.png" },
    { name: "brick", type: "image", src: "resources/coffee-house/brick.png" },
    { name: "window", type: "image", src: "resources/coffee-house/window.png" },
    { name: "coffee-wall-right", type: "image", src: "resources/coffee-house/coffee-wall-right.png" },
    { name: "coffee-table", type: "image", src: "resources/coffee-house/coffee-table.png" },
    { name: "entry", type: "image", src: "resources/entry.png" }, // Load the entry
    { name: "executive_table", type: "image", src: "resources/entities/furnitures/executive/table.gif" }, // Load the furnitures.
    { name: "executive_desk", type: "image", src: "resources/entities/furnitures/executive/desk.gif" },
    { name: "glass_table", type: "image", src: "resources/entities/furnitures/glass/table.gif" },
    { name: "glass_shelves", type: "image", src: "resources/entities/furnitures/glass/shelves.gif" },
    { name: "grunge_table", type: "image", src: "resources/entities/furnitures/grunge/table.gif" },
    { name: "mode_table", type: "image", src: "resources/entities/furnitures/mode/table.gif" },
    { name: "executive_sofa", type: "image", src: "resources/entities/furnitures/executive/sofa.gif" },
    { name: "executive_chair", type: "image", src: "resources/entities/furnitures/executive/chair.gif" },
    { name: "coffee-bar", type: "image", src: "resources/entities/furnitures/coffee/bar.png"},
    { name: "coffee-bar-corner", type: "image", src: "resources/entities/furnitures/coffee/bar-corner.png"},
    { name: "coffee-sofa", type: "image", src: "resources/entities/furnitures/coffee/sofa.png"},
    { name: "coffee-library", type: "image", src: "resources/entities/furnitures/coffee/library.png"},
    { name: "coffee-low-table", type: "image", src: "resources/entities/furnitures/coffee/low-table.png"},
    { name: "gallery_1", type: "image", src: "resources/entities/walls/posters/gallery_1.gif" }, // Load the posters.
    { name: "gallery_2", type: "image", src: "resources/entities/walls/posters/gallery_2.gif" },
    { name: "gallery_n1", type: "image", src: "resources/entities/walls/posters/gallery_n1.gif" },
    { name: "gallery_n2", type: "image", src: "resources/entities/walls/posters/gallery_n2.gif" },
    { name: "gallery_n3", type: "image", src: "resources/entities/walls/posters/gallery_n3.gif" },
    { name: "gallery_n4", type: "image", src: "resources/entities/walls/posters/gallery_n4.gif" },
    { name: "gallery_n5", type: "image", src: "resources/entities/walls/posters/gallery_n5.gif" },
    { name: "gallery_n6", type: "image", src: "resources/entities/walls/posters/gallery_n6.gif" },
    { name: "gallery_n7", type: "image", src: "resources/entities/walls/posters/gallery_n7.gif" },
    { name: "gallery_n8", type: "image", src: "resources/entities/walls/posters/gallery_n8.gif" },
    { name: "gallery_n9", type: "image", src: "resources/entities/walls/posters/gallery_n9.gif" },
    { name: "gallery_n10", type: "image", src: "resources/entities/walls/posters/gallery_n10.gif" },
    { name: "gallery_n11", type: "image", src: "resources/entities/walls/posters/gallery_n11.gif" },
    { name: "gallery_n12", type: "image", src: "resources/entities/walls/posters/gallery_n12.gif" },
    { name: "gallery_n13", type: "image", src: "resources/entities/walls/posters/gallery_n13.gif" },
    { name: "gallery_n14", type: "image", src: "resources/entities/walls/posters/gallery_n14.gif" },
    { name: "gallery_n21", type: "image", src: "resources/entities/walls/posters/gallery_n21.png" },
    { name: "gallery_n22", type: "image", src: "resources/entities/walls/posters/gallery_n22.png" },
    { name: "gallery_n23", type: "image", src: "resources/entities/walls/posters/gallery_n23.png" },
    { name: "gallery_n24", type: "image", src: "resources/entities/walls/posters/gallery_n24.png" },
    { name: "plant_1", type: "image", src: "resources/entities/decorations/plants/plant_1.gif" }, // Load the plants.
    { name: "plant_2", type: "image", src: "resources/entities/decorations/plants/plant_2.gif" },
    { name: "plant_3", type: "image", src: "resources/entities/decorations/plants/plant_3.gif" },
    { name: "plant_4", type: "image", src: "resources/entities/decorations/plants/plant_4.gif" },
    { name: "plant_5", type: "image", src: "resources/entities/decorations/plants/plant_5.gif" },
    { name: "plant_6", type: "image", src: "resources/entities/decorations/plants/plant_6.gif" },
    { name: "plant_7", type: "image", src: "resources/entities/decorations/plants/plant_7.gif" },
    { name: "plant_8", type: "image", src: "resources/entities/decorations/plants/plant_8.gif" },
    { name: "plant_9", type: "image", src: "resources/entities/decorations/plants/plant_9.gif" },
    { name: "plant_10", type: "image", src: "resources/entities/decorations/plants/plant_10.gif" },
    { name: "plant_11", type: "image", src: "resources/entities/decorations/plants/plant_11.png" },
    { name: "plant_12", type: "image", src: "resources/entities/decorations/plants/plant_12.gif" },
    { name: "plant_13", type: "image", src: "resources/entities/decorations/plants/plant_13.png" },
    { name: "flag_1", type: "image", src: "resources/entities/walls/flags/flag_1.gif" }, // Load the flags.
    { name: "flag_2", type: "image", src: "resources/entities/walls/flags/flag_2.gif" },
    { name: "flag_3", type: "image", src: "resources/entities/walls/flags/flag_3.gif" },
    { name: "flag_4", type: "image", src: "resources/entities/walls/flags/flag_4.gif" },
    { name: "flag_5", type: "image", src: "resources/entities/walls/flags/flag_5.gif" },
    { name: "exe_floor", type: "image", src: "resources/entities/grounds/floors/executive/exe_floor.gif" }, // Load the floors.
    { name: "hw_tile_1", type: "image", src: "resources/entities/grounds/floors/star/hw_tile_1.gif" },
    { name: "hw_tile_2", type: "image", src: "resources/entities/grounds/floors/star/hw_tile_2.gif" },
    { name: "hw_tile_3", type: "image", src: "resources/entities/grounds/floors/star/hw_tile_3.gif" },
    { name: "jp_tatami_large", type: "image", src: "resources/entities/grounds/rugs/japanese/jp_tatami_large.gif" },
    { name: "jp_tatami_small", type: "image", src: "resources/entities/grounds/rugs/japanese/jp_tatami_small.gif" },
    { name: "bear_rug_blue", type: "image", src: "resources/entities/grounds/rugs/others/bear_rug_blue.gif" },
    { name: "bear_rug_mint", type: "image", src: "resources/entities/grounds/rugs/others/bear_rug_mint.gif" },
    { name: "coffee-carpet", type: "image", src: "resources/entities/grounds/rugs/coffee/coffee-rug.png" },
    { name: "tile_hover", type: "image", src: "resources/tile_hover.png" }, // Load the selector.
    { name: "furnitures_collision", type: "json", src: "resources/collisions/furnitures.json" }, // Load the collisions.
    { name: "posters_collision", type: "json", src: "resources/collisions/posters.json" },
    { name: "player_collision", type: "json", src: "resources/collisions/player.json" },
    { name: "walls_collision", type: "json", src: "resources/collisions/walls.json" },
    { name: "grounds_collision", type: "json", src: "resources/collisions/grounds.json" },
    { name: "furnitures_shapes", type: "json", src: "resources/shapes/furnitures.json" }, // Load the shapes.
    { name: "walls_shapes", type: "json", src: "resources/shapes/walls.json" },
    { name: "player_shape", type: "json", src: "resources/shapes/player.json" },
    { name: "grounds_shapes", type: "json", src: "resources/shapes/grounds.json" }
];
