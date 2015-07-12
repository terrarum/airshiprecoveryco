var Entity = require("./entity");
var playerModel = require("../models/airship");

var cursors,
    velocity,
    gravity;

var update = function() {
    velocity = this.body.velocity;
    gravity = this.body.gravity;
    
    // Movement.
    if (cursors.up.isDown) {
        velocity.y -= this.model.moveRate;
    }
    if (cursors.down.isDown) {
        velocity.y += this.model.moveRate;
    }
    if (cursors.left.isDown) {
        velocity.x -= this.model.moveRate;
    }
    if (cursors.right.isDown) {
        velocity.x += this.model.moveRate;
    }

    // Set maximum velocity.
    if (velocity.x > this.model.maxVelocity + gravity.x) {
        velocity.x = this.model.maxVelocity + gravity.x;
    }
    if (velocity.x < -this.model.maxVelocity + gravity.x) {
        velocity.x = -this.model.maxVelocity + gravity.x;
    }
    if (velocity.y > this.model.maxVelocity + gravity.y) {
        velocity.y = this.model.maxVelocity + gravity.y;
    }
    if (velocity.y < -this.model.maxVelocity + gravity.y) {
        velocity.y = -this.model.maxVelocity + gravity.y;
    }
};

var hitTime;
var completeTime;
var collectUpdate = function() {

};
// Handle collection of the crate.
var collectCrate = function(player, crate) {
    if (player.model.isFirstCollide) {
        hitTime = Date.now();
        completeTime = hitTime + player.model.collectTime;
        player.model.isFirstCollide = false;
    }

    collectUpdate();

    if (Date.now() >= completeTime) {
        console.log("crate get");
        player.model.carryingCrate = true;
        crate.kill();
    }
};

// If the Airship drifts off a crate or the airfield, reset everything.
var didMiss = function() {

    this.model.isFirstCollide = true;
};

// Set up some properties of the Player entity.
var setup = function() {
    this.game.physics.arcade.enable(this);
    this.model = playerModel;
    this.body.collideWorldBounds = true;
    this.collectCrate = collectCrate;
    this.didMiss = didMiss;

    cursors = this.game.input.keyboard.createCursorKeys();
};

module.exports = function(position) {
    var Player = new Entity(position, "airship", {
        update: update
    });

    setup.call(Player);
    return Player;
};