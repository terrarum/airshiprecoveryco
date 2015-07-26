var Player = require("../entities/player");
var Airfield = require("../entities/airfield");
var Crate = require("../entities/crate");

var utils = require("../utils");

var lifeSpan = 5000;
var wind = function() {
    // Update lifespan of wind.
    lifeSpan -= window.arc.game.time.physicsElapsedMS;

    // Generate new wind.
    if (lifeSpan <= 0) {
        lifeSpan = utils.getRandRange(1000, 10000)
        window.arc.player.body.gravity.x = utils.getRandRange(-80, 80);
        window.arc.player.body.gravity.y = utils.getRandRange(-80, 80);
    }
};

var crates;
var state = function(game) {};
state.prototype = {
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var levelData = window.arc.levels[window.arc.level - 1];

        // Create airfield.
        window.arc.airfield = new Airfield();

        // Create crates.
        window.arc.crates = [];
        crates = this.game.add.group();
        utils.iterate(levelData.crates, function(crateData) {
            var crate = new Crate(crateData);
            crates.add(crate);
            window.arc.crates.push(crate);
        });

        // Create player.
        window.arc.player = new Player(window.arc.airfield.position);
    },
    update: function() {
        var player = window.arc.player;
        // Adjust the wind affecting the player.
        //wind();

        // Handle crate and airfield collisions.

        // If ready to collide with the airfield.
        if (player.model.carryingCrate) {
            var didHit = this.game.physics.arcade.overlap(player, window.arc.airfield, window.arc.player.depositCrate, null, this);
            if (!didHit && !player.model.isFirstCollide) {
                player.didMiss();
            }
        }
        // If ready to collide with a crate.
        else {
            var didHit = this.game.physics.arcade.overlap(player, crates, window.arc.player.collectCrate, null, this);
            if (!didHit && !player.model.isFirstCollide) {
                player.didMiss();
            }
        }

    },
    render: function() {

    }
};

module.exports = state;