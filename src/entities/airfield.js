var utils = require("../utils");
var Entity = require("./entity");

module.exports = function(game) {
    var game = window.arc.game;
    var x = utils.getRandRange(50, game.world.width - 50);
    var y = utils.getRandRange(100, game.world.height - 50);

    var Airfield = new Entity(new Phaser.Point(x, y), "airfield");

    return Airfield;
};