var utils = require("../utils");
var Entity = require("./Entity");

var setup = function() {
    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

module.exports = function(game) {
    var game = arc.game;
    var x = utils.getRandRange(50, game.world.width - 50);
    var y = utils.getRandRange(100, game.world.height - 50);

    var Airfield = new Entity(new Phaser.Point(x, y), "airfield");

    setup.call(Airfield);
    return Airfield;
};