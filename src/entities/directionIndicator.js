var utils = require("../utils");
var Entity = require("./Entity");

module.exports = function(player, crate) {

    var update = function() {

        // Hide indicator if crate is gone.
        if (!crate.visible) {
            this.kill();
            return;
        }

        // Position indicator on player.
        this.x = player.x;
        this.y = player.y;

        // Point indicator at crate.
        var distY = this.y - crate.y;
        var distX = this.x - crate.x;

        this.angle = Phaser.Math.radToDeg(Math.atan2(distY, distX));
    };

    playerRef = player;
    crateRef = crate;
    var Indicator = new Entity(new Phaser.Point(player.x, player.y), "directionindicator", {
        update: update
    });

    return Indicator;
};