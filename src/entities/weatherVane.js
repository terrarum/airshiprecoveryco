var utils = require("../utils");
var Entity = require("./Entity");

var angle, magnitude, magHypo, xEnd, yEnd, g, windX, windY,
    lengthMax = Math.sqrt(Math.pow(1, 2) + Math.pow(1, 2));

calculateWindDirection = function() {
    // Get angle of wind.
    angle = Math.atan2(arc.wind.y, arc.wind.x);

    // Get magnitude.
    if (arc.upgrades.weathervane.upgrades.strength.purchased) {

        windX = Math.abs(arc.wind.x) / arc.wind.max;
        windY = Math.abs(arc.wind.y) / arc.wind.max;

        magHypo = Math.sqrt(Math.pow(windY, 2) + Math.pow(windX, 2));

        magnitude = (magHypo / lengthMax) * (this.width / 2);
    }
    else {
        magnitude = this.width / 4;
    }

    xEnd = this.x + magnitude * Math.cos(angle);
    yEnd = this.y + magnitude * Math.sin(angle);

    g.clear();
    g.lineStyle(2, 0xffffff, 1);
    g.moveTo(this.x, this.y);
    g.lineTo(xEnd, yEnd);

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