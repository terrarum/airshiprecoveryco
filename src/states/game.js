var Player = require("../entities/player");
var Airfield = require("../entities/airfield");
var Crate = require("../entities/crate");

var state = function(game) {};
state.prototype = {
    create: function() {
        window.arc.airfield = new Airfield();
        window.arc.player = new Player(window.arc.airfield.position);
        window.arc.crates = new Crate();
    },
    update: function() {
        
    },
    render: function() {

    }
};

module.exports = state;