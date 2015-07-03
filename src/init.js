var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

var score = 0;
var scoreText;

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
    var startY = getRandRange(50, game.world.height - 50);

    // Crates.
    crate = game.add.sprite(200, 200, 'crate');
    game.physics.arcade.enable(crate);
    crate.body.immovable = true;

    // Airpad.
    airpad = game.add.sprite(0, 0, 'airpad');
    airpad.x = startX - airpad.width / 2;
    airpad.y = startY - airpad.height / 2;
    game.physics.arcade.enable(airpad);
    airpad.body.immovable = true;

    // Player.
    player = game.add.sprite(0, 0, 'airship');
    player.x = startX - player.width / 2;
    player.y = startY - player.height / 2;

    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;

    // Need to set this randomly.
    player.body.gravity.y = 0;
    player.body.gravity.x = 0;

    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#fff'});
}

var carryingCrate = false;
var hitTime = 0;
var isFirst = true;
function hitCrate(player, crate) {
    // If this is the first hit, store the time.
    if (isFirst) {
        hitTime = Date.now();
        isFirst = false;
    }

    if (Date.now() - hitTime >= 2000) {
        crate.x = -100;
        crate.y = -100;
        carryingCrate = true;
    }
}
function missCrate(player, crate) {
    isFirst = true;
}

// Drop crate at airpad.
var isFirstAirpad = true;
var landTime = 0;
function dropCrate() {
    // If this is the first hit, store the time.
    if (isFirstAirpad) {
        landTime = Date.now();
        isFirstAirpad = false;
    }

    if (Date.now() - landTime >= 2000) {
        crate.x = getRandRange(50, game.world.width - 50);;
        crate.y = getRandRange(50, game.world.height - 50);;
        carryingCrate = false;
    }
}
function missPad(player, crate) {
    isFirstAirpad = true;
}


function update() {

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
}