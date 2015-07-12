var Player = require("../entities/player");
var Airfield = require("../entities/airfield");
var Crate = require("../entities/crate");

var state = function(game) {};
state.prototype = {
    create: function() {
        window.arc.airfield = new Airfield(this.game);
        window.arc.player = new Player(this.game, window.arc.airfield.position);
        //window.arc.crate = new Crate(this.game);
    },
    update: function() {

    },
    render: function() {

    }
};

module.exports = state;