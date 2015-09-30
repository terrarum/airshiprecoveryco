var utils = require("../utils");
var Entity = require("./Entity");

var angle, magnitude, xEnd, yEnd, g;

calculateWindDirection = function() {
    // Get angle of wind.
    angle = Math.atan2(arc.wind.y, arc.wind.x);

    // Get magnitude.
    if (arc.upgrades.weathervane.upgrades.strength.purchased) {
        // Calculate magnitude.

        // Get percentage of distance to max wind.

        // Convert into percentage of distance of wather vane radius.
        magnitude = 10;
    }
    else {
        // Default magnitude.
        if (arc.wind.y === 0 && arc.wind.x === 0) {
            magnitude = 0;
        }
        else {
            magnitude = this.width / 4;
        }
    };

    var xEnd = this.x + magnitude * Math.cos(angle);
    var yEnd = this.y + magnitude * Math.sin(angle);

    var line = new Phaser.Line(this.x, this.y, xEnd, yEnd);
    arc.game.debug.lineInfo(line, 10, 60);
    arc.game.debug.geom(line);
};

module.exports = function() {
    g = arc.game.add.graphics(0, 0);

    var update = function() {

        if (!arc.upgrades.weathervane.purchased) {
            this.visible = false;
            return;
        }
        else {
            this.visible = true;

            calculateWindDirection.call(this);
        }
    };

    var WeatherVane = new Entity(new Phaser.Point(arc.game.width - 60, 60), "weathervane", {
        update: update
    });

    return WeatherVane;
};