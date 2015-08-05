var utils = require("../utils");
var Entity = require("./Entity");

// Generates X and Y coordinates for the crate. Will later need to account
// for Airfield position to ensure there are no overlaps.
var generateCratePosition = function() {
    var game = arc.game;
    var x = utils.getRandRange(50, game.world.width - 50);
    var y = utils.getRandRange(100, game.world.height - 50);

    return new Phaser.Point(x, y);
};

var setup = function() {
    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

var update = function() {
    this.angle += 1;
};

module.exports = function(crateData) {
    var Crate = new Entity(generateCratePosition(), "crate", {
        update: update
    });
    Crate.data = crateData;

    setup.call(Crate);
    return Crate;
};