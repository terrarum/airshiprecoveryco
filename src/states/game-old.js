var game = window.arc.game;
var COLLECT_TIME = 4000;
var DROP_TIME = 2000;
var VELOCITY_TOLERANCE = 20;

var MAX_VELOCITY = 100

var cratesCollected = 0;
var scoreText;
var absVelC = 0;

var carryingCrate = false;
var hitTime = 0;
var isFirst = true;
var isFirstAirpad = true;
var landTime = 0;

var progressStartTime;
var completeTime;
var maxWidth = 100;

function playerBarShow(startTime, endTime) {
    playerBar.exists = true;
    maxWidth = playerBar.width;
    progressStartTime = startTime;
    completeTime = startTime + endTime;
}

function playerBarUpdate(endTime) {
    if (absVelC >= VELOCITY_TOLERANCE) {

        endTime += game.time.physicsElapsedMS;
        // Holds the progress bar.
        completeTime += game.time.physicsElapsedMS;
        return;
    }

    var remaining = completeTime - Date.now();
    var percent = remaining / endTime;
    if (percent < 0) percent = 0;
    playerBar.width = maxWidth * percent;
}

function playerBarHide() {
    playerBar.exists = false;
    playerBar.width = maxWidth;
}

function hitCrate(player, crate) {
    // If this is the first hit, store the time.
    if (isFirst) {
        hitTime = Date.now();
        isFirst = false;
        playerBarShow(hitTime, COLLECT_TIME);
    }

    playerBarUpdate(COLLECT_TIME);

    // Crate Collected.
    if (Date.now() >= completeTime) {
        crate.x = -100;
        crate.y = -100;
        carryingCrate = true;
        playerBarHide();
    }
}
function missCrate(player, crate) {
    isFirst = true;
    if (!carryingCrate) {
        playerBarHide();
    }
}

// Drop crate at airpad.
function dropCrate() {
    // If this is the first hit, store the time.
    if (isFirstAirpad) {
        landTime = Date.now();
        isFirstAirpad = false;
        playerBarShow(landTime, DROP_TIME);
    }

    playerBarUpdate(DROP_TIME);

    // Crate Delivered.
    if (Date.now() >= completeTime) {
        // TODO ensure crate is not under landing pad.
        crate.x = getRandRange(50, game.world.width - 50);
        crate.y = getRandRange(100, game.world.height - 50);
        carryingCrate = false;
        cratesCollected++;
        scoreText.text = 'Crates Collected: ' + cratesCollected;
        playerBarHide();
    }
}
function missPad(player, crate) {
    isFirstAirpad = true;
    if (carryingCrate) {
        playerBarHide();
    }
}

var arc = function(game) {

};

arc.prototype = {
    create: function() {
        // World.
        game.physics.startSystem(Phaser.Physics.ARCADE);


        // Player.
        player = game.add.sprite(0, 0, 'airship');
        player.x = startX;
        player.y = startY;
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.anchor.setTo(0.5, 0.5);
        // Player bar.
        bmd = game.add.bitmapData(100, 5);
        bmd.ctx.fillStyle = '#ffffff';
        bmd.ctx.fillRect(0, 0, 100, 5)
        //playerBar = game.add.sprite(0, 0, bmd);
        //playerBar.anchor.setTo(0.5, 0.5);
        //playerBar.exists = false;

        scoreText = game.add.text(16, 16, 'Crates Collected: 0', {fontSize: '20px', fill: '#fff'});

        graphics = game.add.graphics(0, 0);
    },
    update: function() {
        wind();

        //playerBar.x = player.x;
        //playerBar.y = player.y + 50;

        // See if airship is over crate.
        var didHitCrate = game.physics.arcade.overlap(player, crate, null, null, this);
        if (didHitCrate) {
            hitCrate(player, crate);
        }
        else {
            missCrate(player, crate);
        }

        // If airship is over landing pad and carrying a crate.
        var hitLandingPad = game.physics.arcade.overlap(player, airpad, null, null, this);
        if (hitLandingPad && carryingCrate) {
            dropCrate();
        }
        else if (!hitLandingPad && carryingCrate) {
            missPad();
        }

        var absVelX = Math.abs(velocity.x);
        var absVelY = Math.abs(velocity.y);
        absVelC = absVelX + absVelY;
    }
}

module.exports = arc;