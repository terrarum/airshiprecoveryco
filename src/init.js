var COLLECT_TIME = 4000;
var DROP_TIME = 2000;
var VELOCITY_TOLERANCE = 20;

var MAX_VELOCITY = 100

var $ = require("../bower_components/jquery/dist/jquery");
window.$ = $;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

var cratesCollected = 0;
var scoreText;
var absVelC = 0;

function getRandRange(min, max) {
    return Math.random() * (max - min) + min;
}

function preload() {
    game.load.image('airship', 'assets/images/airship.png');
    game.load.image('airpad', 'assets/images/airpad.png');
    game.load.image('crate', 'assets/images/crate.png');
}

function create() {
    // World.
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Get starting point.
    var startX = getRandRange(50, game.world.width - 50);
    var startY = getRandRange(100, game.world.height - 50);

    // Airpad.
    airpad = game.add.sprite(0, 0, 'airpad');
    airpad.x = startX;
    airpad.y = startY;
    airpad.anchor.setTo(0.5, 0.5);;
    game.physics.arcade.enable(airpad);
    airpad.body.immovable = true;

    // Crate.
    crate = game.add.sprite(200, 200, 'crate');
    game.physics.arcade.enable(crate);
    crate.body.immovable = true;

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
    playerBar = game.add.sprite(0, 0, bmd);
    playerBar.anchor.setTo(0.5, 0.5);
    playerBar.exists = false;

    scoreText = game.add.text(16, 16, 'Crates Collected: 0', {fontSize: '20px', fill: '#fff'});

    graphics = game.add.graphics(0, 0);
}

var carryingCrate = false;
var hitTime = 0;
var isFirst = true;
var isFirstAirpad = true;
var landTime = 0;

var progressStartTime;
var completeTime;
var maxWidth = 100;
function playerBarShow(startTime, count) {
    playerBar.exists = true;
    maxWidth = playerBar.width;
    progressStartTime = startTime;
    completeTime = startTime + count;
}
function playerBarUpdate(count) {
    if (absVelC >= VELOCITY_TOLERANCE) {

        count += game.time.physicsElapsedMS;
        // Holds the progress bar.
        completeTime += game.time.physicsElapsedMS;
        return;
    }
    var width = playerBar.width;
    var remaining = completeTime - Date.now();
    var percent = remaining / count;
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

// Calculates the wind strength and direction.
lifespan = 5000

function wind() {
    // Update lifespan of wind.
    lifespan -= game.time.physicsElapsedMS;

    // Generate new wind.
    if (lifespan <= 0) {
        lifespan = getRandRange(1000, 10000)
        player.body.gravity.x = getRandRange(-80, 80);
        player.body.gravity.y = getRandRange(-80, 80);
    }

    // Draw wind indicator.
    graphics.clear();
    graphics.lineStyle(5, 0xffd900, 1);
    graphics.beginFill(0xFFFF0B, 0.5);
    graphics.drawCircle(750, 50, 84);
    graphics.endFill();
    graphics.beginFill(0xFF3300);
    graphics.moveTo(750, 50);
    graphics.lineTo(750 + player.body.gravity.x / 2, 50 + player.body.gravity.y / 2);
    graphics.endFill();
}

function update() {

    wind();

    playerBar.x = player.x;
    playerBar.y = player.y + 50;

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

    var velocity = player.body.velocity;

    cursors = game.input.keyboard.createCursorKeys();

    var moveRate = 2;

    // Slow airship down.
    if (velocity.x > 0) {
        velocity.x -= moveRate / 4;
    }
    if (velocity.x < 0) {
        velocity.x += moveRate / 4;
    }
    if (velocity.y > 0) {
        velocity.y -= moveRate / 4;
    }
    if (velocity.y < 0) {
        velocity.y += moveRate / 4;
    }

    // Set maximum velocity.
    if (velocity.x > MAX_VELOCITY + player.body.gravity.x) {
        velocity.x = MAX_VELOCITY + player.body.gravity.x;
    }
    if (velocity.x < -MAX_VELOCITY + player.body.gravity.x) {
        velocity.x = -MAX_VELOCITY + player.body.gravity.x;
    }
    if (velocity.y > MAX_VELOCITY + player.body.gravity.y) {
        velocity.y = MAX_VELOCITY + player.body.gravity.y;
    }
    if (velocity.y < -MAX_VELOCITY + player.body.gravity.y) {
        velocity.y = -MAX_VELOCITY + player.body.gravity.y;
    }

    // Move airship with arrow keys.
    if (cursors.up.isDown) {
        velocity.y -= moveRate;
    }
    if (cursors.down.isDown) {
        velocity.y += moveRate;
    }
    if (cursors.left.isDown) {
        velocity.x -= moveRate;
    }
    if (cursors.right.isDown) {
        velocity.x += moveRate;
    }

    var absVelX = Math.abs(velocity.x);
    var absVelY = Math.abs(velocity.y);
    absVelC = absVelX + absVelY;

    // Print stats to screen.
    $(".js-lifespan").html((lifespan / 1000).toFixed(1));
    $(".js-velocity-c").html(absVelC.toFixed(2));

    if (absVelC >= VELOCITY_TOLERANCE && !$(".js-velocity-c").hasClass("over")) {
        $(".js-velocity-c").addClass("over");
    }
    else if (absVelC < VELOCITY_TOLERANCE && $(".js-velocity-c").hasClass("over")) {
        $(".js-velocity-c").removeClass("over");
    }

}