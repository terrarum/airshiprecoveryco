var Entity = require("./Entity");
var playerModel = require("../models/airship");
var progressbar = require("../modules/progressbar")

var cursors,
    velocity,
    gravity,
    absVelC;

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

    var absVelX = Math.abs(velocity.x);
    var absVelY = Math.abs(velocity.y);
    absVelC = absVelX + absVelY;

    // Move progressbar with player.
    this.progressBar.x = this.x;
    this.progressBar.y = this.y + 50;
};

var hitTime;
var completeTime;
var lastHitTime;
var collectUpdate = function() {
    // If the Airship is moving too quickly, pause the loading/unloading process.
    if (absVelC > this.model.velocityTolerance) {
        completeTime += this.game.time.physicsElapsedMS;
        lastHitTime += this.game.time.physicsElapsedMS;
    }

    this.progressBar.progressUpdate(lastHitTime, completeTime);
};

// Handle collection of the crate.
var collectCrate = function(sprite1, sprite2) {
    var player, crate;

    if (sprite1.key === "airship") {
        player = sprite1;
        crate = sprite2;
    }
    else {
        player = sprite2;
        crate = sprite1;
    }

    if (player.model.currentCrateId !== null &&
        player.model.currentCrateId !== crate.id) {
        console.log("Not the same crate");
        return
    };

    // Begin crate collection.
    if (player.model.isFirstCollide) {
        hitTime = Date.now();
        completeTime = hitTime + player.model.collectTime;
        lastHitTime = hitTime;
        player.model.isFirstCollide = false;
        player.model.currentCrateId = crate.id;

        player.progressBar.show(hitTime, completeTime);
    }

    collectUpdate.call(player);

    // Crate is collected.
    if (Date.now() >= completeTime) {
        player.model.carryingCrate = true;

        player.crateValue = crate.data.value;
        player.model.currentCrateId = null;

        crate.kill();

        player.progressBar.hide();
    }
};

// Drop crate off at airfield.
var depositCrate = function(player, airfield) {
    // Being crate dropoff.
    if (player.model.isFirstCollide) {
        hitTime = Date.now();
        completeTime = hitTime + player.model.dropTime;
        lastHitTime = hitTime;
        player.model.isFirstCollide = false;

        player.progressBar.show(hitTime, completeTime);
    }

    collectUpdate.call(player);

    // Crate is dropped off.
    if (Date.now() >= completeTime) {
        console.log("crate drop");
        player.model.carryingCrate = false;

        arc.playerData.money = parseInt(arc.playerData.money) + parseInt(player.crateValue);
        player.crateValue = 0;

        player.progressBar.hide();
    }
}

// If the Airship drifts off a crate or the airfield, reset everything.
var didMiss = function() {
    this.model.isFirstCollide = true;
    this.progressBar.hide();
    this.model.currentCrateId = null;
};

// Set up some properties of the Player entity.
var setup = function() {
    this.game.physics.arcade.enable(this);
    this.model = playerModel;
    this.body.collideWorldBounds = true;
    this.collectCrate = collectCrate;
    this.depositCrate = depositCrate;
    this.didMiss = didMiss;

    this.progressBar = progressbar();

    cursors = this.game.input.keyboard.createCursorKeys();
};

module.exports = function(position) {
    var Player = new Entity(position, "airship", {
        update: update
    });

    setup.call(Player);
    return Player;
};