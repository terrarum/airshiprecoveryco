var Player = require("../entities/player");
var Airfield = require("../entities/airfield");
var Crate = require("../entities/crate");
var DirectionIndicator = require("../entities/directionIndicator");
var WeatherVane = require("../entities/weatherVane");
var Upgrades = require("../modules/upgrades");

var utils = require("../utils");

var windChangeRate = 0.1;
var lifeSpan = 5000;

var newWind = new Phaser.Point(0, 0);
var wind = function(levelData) {
    arc.wind.max = parseInt(levelData.windMaxStrength);

    // Update lifespan of wind.
    lifeSpan -= arc.game.time.physicsElapsedMS;

    if (arc.wind.x > newWind.x) {
        arc.wind.x -= windChangeRate;
    }
    if (arc.wind.x < newWind.x) {
        arc.wind.x += windChangeRate;
    }
    if (arc.wind.y > newWind.y) {
        arc.wind.y -= windChangeRate;
    }
    if (arc.wind.y < newWind.y) {
        arc.wind.y += windChangeRate;
    }

    arc.player.body.gravity.x = arc.wind.x;
    arc.player.body.gravity.y = arc.wind.y;

    // Generate new wind.wind
    if (lifeSpan <= 0) {
        lifeSpan = utils.getRandRange(1000, 10000);

        newWind.x = utils.getRandRange(-arc.wind.max, arc.wind.max);
        newWind.y = utils.getRandRange(-arc.wind.max, arc.wind.max);
    }
};

var crates;
var state = function(game) {};
state.prototype = {
    create: function() {

        arc.upgrades = Upgrades();

        var worldGroup = this.game.add.group();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.levelData = arc.levels[arc.level - 1];

        // Create airfield.
        arc.airfield = new Airfield();

        // Create player.
        arc.player = new Player(arc.airfield.position);

        // Create crates.
        arc.crates = [];
        arc.indicators = [];
        crates = this.game.add.group();
        utils.iterate(this.levelData.crates, function(crateData) {
            var crate = new Crate(crateData);
            crates.add(crate);
            arc.crates.push(crate);
            arc.indicators.push(new DirectionIndicator(arc.player, crate));
        });

        var textStyle = {font:"normal 20px arial",fill: "#ffffff"};
        moneyText = this.game.add.text(0, 0, "", textStyle);
        carryingText = this.game.add.text(250, 0, "", textStyle);

        var weatherVane = new WeatherVane();

        worldGroup.add(crates);
        worldGroup.add(arc.airfield);
        worldGroup.add(arc.player);
        worldGroup.add(weatherVane);
    },
    update: function() {
        var player = arc.player;
        // Adjust the wind affecting the player.
        wind(this.levelData);

        moneyText.setText("Money: ¢" + arc.playerData.money);
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