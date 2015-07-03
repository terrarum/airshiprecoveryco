var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

var score = 0;
var scoreText;

function getRandRange(min, max) {
    return Math.random() * (max - min) + min;
}

function preload() {
    game.load.image('airship', 'assets/images/airship.png');
    game.load.image('airpad', 'assets/images/airpad.png');
    game.load.image('crate', 'assets/images/airpad.png');
}

function create() {
    // World.
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Get starting point.
    var startX = getRandRange(50, game.world.width - 50);
    var startY = getRandRange(50, game.world.height - 50);

    // Airpad.
    airpad = game.add.sprite(0, 0, 'airpad');
    airpad.x = startX - airpad.width / 2;
    airpad.y = startY - airpad.height / 2;

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

function collectStar(player, star) {

    // Removes the star from the screen
    star.kill();

    score += 10;
    scoreText.text = 'Score: ' + score;
}

function update() {
    // Collide the player with the platforms.

    var velocity = player.body.velocity;

    cursors = game.input.keyboard.createCursorKeys();

    //  Reset the players velocity (movement)

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