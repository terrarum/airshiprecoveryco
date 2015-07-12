var Entity = require("./entity");

module.exports = function(position) {
    var Player = new Entity(position, "airship");
    return Player;
};