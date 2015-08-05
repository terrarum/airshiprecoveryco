var Player = require("../entities/player");
var Airfield = require("../entities/airfield");
var Crate = require("../entities/crate");

var utils = require("../utils");

var windChangeRate = 0.1;
var lifeSpan = 5000;
var newX = 0;
var newY = 0;
var wind = function(levelData) {
    var maxWindSpeed = parseInt(levelData.windMaxStrength);

    // Update lifespan of wind.
    lifeSpan -= arc.game.time.physicsElapsedMS;

    if (arc.player.body.gravity.x > newX) {
        arc.player.body.gravity.x -= windChangeRate;
    }
    if (arc.player.body.gravity.x < newX) {
        arc.player.body.gravity.x += windChangeRate;
    }

    if (arc.player.body.gravity.y > newY) {
        arc.player.body.gravity.y -= windChangeRate;
    }
    if (arc.player.body.gravity.y < newY) {
        arc.player.body.gravity.y += windChangeRate;
    }

    // Generate new wind.
    if (lifeSpan <= 0) {
        lifeSpan = utils.getRandRange(1000, 10000);

        newX = utils.getRandRange(-maxWindSpeed, maxWindSpeed);
        newY = utils.getRandRange(-maxWindSpeed, maxWindSpeed);
    }
};

var crates;
var state = function(game) {};
state.prototype = {
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.levelData = arc.levels[arc.level - 1];

        // Create airfield.
        arc.airfield = new Airfield();

        // Create crates.
        arc.crates = [];
        crates = this.game.add.group();
        utils.iterate(this.levelData.crates, function(crateData) {
            var crate = new Crate(crateData);
            crates.add(crate);
            arc.crates.push(crate);
        });

        var textStyle = {font:"normal 20px arial",fill: "#ffffff"};
        moneyText = this.game.add.text(0, 0, "", textStyle);
        carryingText = this.game.add.text(250, 0, "", textStyle);

        // Create player.
        arc.player = new Player(arc.airfield.position);
    },
    update: function() {
        var player = arc.player;
        // Adjust the wind affecting the player.
        wind(this.levelData);

        moneyText.setText("Money: $" + arc.playerData.money);
        if (arc.player.model.carryingCrate) {
            carryingText.setText("Return Crate to Airfield.");
        }
        else {
            carryingText.setText("Pick up a Crate.");
        }

        // Handle crate and airfield collisions.

        // If ready to collide with the airfield.
        if (player.model.carryingCrate) {
            var didHit = this.game.physics.arcade.overlap(player, arc.airfield, arc.player.depositCrate, null, this);
            if (!didHit && !player.model.isFirstCollide) {
                player.didMiss();
            }
        }
        // If ready to collide with a crate.
        else {
            var didHit = this.game.physics.arcade.overlap(player, crates, arc.player.collectCrate, null, this);
            if (!didHit && !player.model.isFirstCollide) {
                player.didMiss();
            }
        }

    },
    render: function() {

    }
};

module.exports = state;