var utils = require("../utils");
var Entity = require("./entity");

module.exports = function(game) {
    var x = utils.getRandRange(50, game.world.width - 50);
    var y = utils.getRandRange(100, game.world.height - 50);

    var update = function() {
        this.angle += 1;
    };

    var Airfield = new Entity(game, x, y, "airfield", update);

    return Airfield;
};