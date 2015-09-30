var Entity = require("./Entity");

var setup = function() {
    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

module.exports = function(game) {
    var game = arc.game;

    var Airfield = new Entity(new Phaser.Point(0, 0), "airfield");

    Airfield.x = game.world.width / 2;
    Airfield.y = game.world.height - Airfield.height * 1;

    setup.call(Airfield);
    return Airfield;
};