var Entity = require("./entity");

module.exports = function(game, position) {

    var update = function() {
        this.angle -= 1;
    };
    var Player = new Entity(game, position.x, position.y, "airship", update);
    return Player;
};