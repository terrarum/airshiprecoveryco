var utils = require("../utils");
var Entity = require("./entity");

// Generates X and Y coordinates for the crate. Will later need to account
// for Airfield position to ensure there are no overlaps.
var generateCratePosition = function() {
    var game = window.arc.game;
    var x = utils.getRandRange(50, game.world.width - 50);
    var y = utils.getRandRange(100, game.world.height - 50);

    return new Phaser.Point(x, y);
}

module.exports = function() {
    var update = function() {
        this.angle += 1;
    };

    var Crate = new Entity(generateCratePosition(), "crate", update);

    return Crate;
};