(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var COLLECT_TIME = 4000;
var DROP_TIME = 2000;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

var cratesCollected = 0;
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
    var startY = getRandRange(100, game.world.height - 50);

    // Crates.
    crate = game.add.sprite(200, 200, 'crate');
    game.physics.arcade.enable(crate);
    crate.body.immovable = true;

    // Airpad.
    airpad = game.add.sprite(0, 0, 'airpad');
    airpad.x = startX;
    airpad.y = startY;
    airpad.anchor.setTo(0.5, 0.5);;
    game.physics.arcade.enable(airpad);
    airpad.body.immovable = true;

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

    // Wind.
    // Need to set this randomly.
    player.body.gravity.y = 0;
    player.body.gravity.x = 0;

    scoreText = game.add.text(16, 16, 'Crates Collected: 0', {fontSize: '20px', fill: '#fff'});
}

var carryingCrate = false;
var hitTime = 0;
var isFirst = true;
var isFirstAirpad = true;
var landTime = 0;

var progressStartTime;
var completeTime;
var maxWidth;
function playerBarShow(startTime, count) {
    playerBar.exists = true;
    maxWidth = playerBar.width;
    progressStartTime = startTime;
    completeTime = startTime + count;
    console.log(startTime, completeTime, count)
}
function playerBarUpdate(count) {
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
    // TODO keep velocity low to pick up.
    if (Date.now() - hitTime >= COLLECT_TIME) {
        crate.x = -100;
        crate.y = -100;
        carryingCrate = true;
        playerBarHide();
    }
}
function missCrate(player, crate) {
    isFirst = true;
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
    // TODO keep velocity low to deliver.
    if (Date.now() - landTime >= DROP_TIME) {
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
}

function update() {

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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQ09MTEVDVF9USU1FID0gNDAwMDtcbnZhciBEUk9QX1RJTUUgPSAyMDAwO1xuXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg4MDAsIDYwMCwgUGhhc2VyLkFVVE8sICdnYW1lJywge3ByZWxvYWQ6IHByZWxvYWQsIGNyZWF0ZTogY3JlYXRlLCB1cGRhdGU6IHVwZGF0ZX0pO1xuXG52YXIgY3JhdGVzQ29sbGVjdGVkID0gMDtcbnZhciBzY29yZVRleHQ7XG5cbmZ1bmN0aW9uIGdldFJhbmRSYW5nZShtaW4sIG1heCkge1xuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG59XG5cbmZ1bmN0aW9uIHByZWxvYWQoKSB7XG4gICAgZ2FtZS5sb2FkLmltYWdlKCdhaXJzaGlwJywgJ2Fzc2V0cy9pbWFnZXMvYWlyc2hpcC5wbmcnKTtcbiAgICBnYW1lLmxvYWQuaW1hZ2UoJ2FpcnBhZCcsICdhc3NldHMvaW1hZ2VzL2FpcnBhZC5wbmcnKTtcbiAgICBnYW1lLmxvYWQuaW1hZ2UoJ2NyYXRlJywgJ2Fzc2V0cy9pbWFnZXMvY3JhdGUucG5nJyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSgpIHtcblxuICAgIC8vIFdvcmxkLlxuICAgIGdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuXG4gICAgLy8gR2V0IHN0YXJ0aW5nIHBvaW50LlxuICAgIHZhciBzdGFydFggPSBnZXRSYW5kUmFuZ2UoNTAsIGdhbWUud29ybGQud2lkdGggLSA1MCk7XG4gICAgdmFyIHN0YXJ0WSA9IGdldFJhbmRSYW5nZSgxMDAsIGdhbWUud29ybGQuaGVpZ2h0IC0gNTApO1xuXG4gICAgLy8gQ3JhdGVzLlxuICAgIGNyYXRlID0gZ2FtZS5hZGQuc3ByaXRlKDIwMCwgMjAwLCAnY3JhdGUnKTtcbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShjcmF0ZSk7XG4gICAgY3JhdGUuYm9keS5pbW1vdmFibGUgPSB0cnVlO1xuXG4gICAgLy8gQWlycGFkLlxuICAgIGFpcnBhZCA9IGdhbWUuYWRkLnNwcml0ZSgwLCAwLCAnYWlycGFkJyk7XG4gICAgYWlycGFkLnggPSBzdGFydFg7XG4gICAgYWlycGFkLnkgPSBzdGFydFk7XG4gICAgYWlycGFkLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7O1xuICAgIGdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKGFpcnBhZCk7XG4gICAgYWlycGFkLmJvZHkuaW1tb3ZhYmxlID0gdHJ1ZTtcblxuICAgIC8vIFBsYXllci5cbiAgICBwbGF5ZXIgPSBnYW1lLmFkZC5zcHJpdGUoMCwgMCwgJ2FpcnNoaXAnKTtcbiAgICBwbGF5ZXIueCA9IHN0YXJ0WDtcbiAgICBwbGF5ZXIueSA9IHN0YXJ0WTtcbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShwbGF5ZXIpO1xuICAgIHBsYXllci5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XG4gICAgcGxheWVyLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XG4gICAgLy8gUGxheWVyIGJhci5cbiAgICBibWQgPSBnYW1lLmFkZC5iaXRtYXBEYXRhKDEwMCwgNSk7XG4gICAgYm1kLmN0eC5maWxsU3R5bGUgPSAnI2ZmZmZmZic7XG4gICAgYm1kLmN0eC5maWxsUmVjdCgwLCAwLCAxMDAsIDUpXG4gICAgcGxheWVyQmFyID0gZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIGJtZCk7XG4gICAgcGxheWVyQmFyLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XG4gICAgcGxheWVyQmFyLmV4aXN0cyA9IGZhbHNlO1xuXG4gICAgLy8gV2luZC5cbiAgICAvLyBOZWVkIHRvIHNldCB0aGlzIHJhbmRvbWx5LlxuICAgIHBsYXllci5ib2R5LmdyYXZpdHkueSA9IDA7XG4gICAgcGxheWVyLmJvZHkuZ3Jhdml0eS54ID0gMDtcblxuICAgIHNjb3JlVGV4dCA9IGdhbWUuYWRkLnRleHQoMTYsIDE2LCAnQ3JhdGVzIENvbGxlY3RlZDogMCcsIHtmb250U2l6ZTogJzIwcHgnLCBmaWxsOiAnI2ZmZid9KTtcbn1cblxudmFyIGNhcnJ5aW5nQ3JhdGUgPSBmYWxzZTtcbnZhciBoaXRUaW1lID0gMDtcbnZhciBpc0ZpcnN0ID0gdHJ1ZTtcbnZhciBpc0ZpcnN0QWlycGFkID0gdHJ1ZTtcbnZhciBsYW5kVGltZSA9IDA7XG5cbnZhciBwcm9ncmVzc1N0YXJ0VGltZTtcbnZhciBjb21wbGV0ZVRpbWU7XG52YXIgbWF4V2lkdGg7XG5mdW5jdGlvbiBwbGF5ZXJCYXJTaG93KHN0YXJ0VGltZSwgY291bnQpIHtcbiAgICBwbGF5ZXJCYXIuZXhpc3RzID0gdHJ1ZTtcbiAgICBtYXhXaWR0aCA9IHBsYXllckJhci53aWR0aDtcbiAgICBwcm9ncmVzc1N0YXJ0VGltZSA9IHN0YXJ0VGltZTtcbiAgICBjb21wbGV0ZVRpbWUgPSBzdGFydFRpbWUgKyBjb3VudDtcbiAgICBjb25zb2xlLmxvZyhzdGFydFRpbWUsIGNvbXBsZXRlVGltZSwgY291bnQpXG59XG5mdW5jdGlvbiBwbGF5ZXJCYXJVcGRhdGUoY291bnQpIHtcbiAgICB2YXIgd2lkdGggPSBwbGF5ZXJCYXIud2lkdGg7XG4gICAgdmFyIHJlbWFpbmluZyA9IGNvbXBsZXRlVGltZSAtIERhdGUubm93KCk7XG4gICAgdmFyIHBlcmNlbnQgPSByZW1haW5pbmcgLyBjb3VudDtcbiAgICBpZiAocGVyY2VudCA8IDApIHBlcmNlbnQgPSAwO1xuICAgIHBsYXllckJhci53aWR0aCA9IG1heFdpZHRoICogcGVyY2VudDtcbn1cbmZ1bmN0aW9uIHBsYXllckJhckhpZGUoKSB7XG4gICAgcGxheWVyQmFyLmV4aXN0cyA9IGZhbHNlO1xuICAgIHBsYXllckJhci53aWR0aCA9IG1heFdpZHRoO1xufVxuXG5mdW5jdGlvbiBoaXRDcmF0ZShwbGF5ZXIsIGNyYXRlKSB7XG4gICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgaGl0LCBzdG9yZSB0aGUgdGltZS5cbiAgICBpZiAoaXNGaXJzdCkge1xuICAgICAgICBoaXRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgaXNGaXJzdCA9IGZhbHNlO1xuICAgICAgICBwbGF5ZXJCYXJTaG93KGhpdFRpbWUsIENPTExFQ1RfVElNRSk7XG4gICAgfVxuXG4gICAgcGxheWVyQmFyVXBkYXRlKENPTExFQ1RfVElNRSk7XG5cbiAgICAvLyBDcmF0ZSBDb2xsZWN0ZWQuXG4gICAgLy8gVE9ETyBrZWVwIHZlbG9jaXR5IGxvdyB0byBwaWNrIHVwLlxuICAgIGlmIChEYXRlLm5vdygpIC0gaGl0VGltZSA+PSBDT0xMRUNUX1RJTUUpIHtcbiAgICAgICAgY3JhdGUueCA9IC0xMDA7XG4gICAgICAgIGNyYXRlLnkgPSAtMTAwO1xuICAgICAgICBjYXJyeWluZ0NyYXRlID0gdHJ1ZTtcbiAgICAgICAgcGxheWVyQmFySGlkZSgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1pc3NDcmF0ZShwbGF5ZXIsIGNyYXRlKSB7XG4gICAgaXNGaXJzdCA9IHRydWU7XG59XG5cbi8vIERyb3AgY3JhdGUgYXQgYWlycGFkLlxuZnVuY3Rpb24gZHJvcENyYXRlKCkge1xuICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGhpdCwgc3RvcmUgdGhlIHRpbWUuXG4gICAgaWYgKGlzRmlyc3RBaXJwYWQpIHtcbiAgICAgICAgbGFuZFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICBpc0ZpcnN0QWlycGFkID0gZmFsc2U7XG4gICAgICAgIHBsYXllckJhclNob3cobGFuZFRpbWUsIERST1BfVElNRSk7XG4gICAgfVxuXG4gICAgcGxheWVyQmFyVXBkYXRlKERST1BfVElNRSk7XG5cbiAgICAvLyBDcmF0ZSBEZWxpdmVyZWQuXG4gICAgLy8gVE9ETyBrZWVwIHZlbG9jaXR5IGxvdyB0byBkZWxpdmVyLlxuICAgIGlmIChEYXRlLm5vdygpIC0gbGFuZFRpbWUgPj0gRFJPUF9USU1FKSB7XG4gICAgICAgIC8vIFRPRE8gZW5zdXJlIGNyYXRlIGlzIG5vdCB1bmRlciBsYW5kaW5nIHBhZC5cbiAgICAgICAgY3JhdGUueCA9IGdldFJhbmRSYW5nZSg1MCwgZ2FtZS53b3JsZC53aWR0aCAtIDUwKTtcbiAgICAgICAgY3JhdGUueSA9IGdldFJhbmRSYW5nZSgxMDAsIGdhbWUud29ybGQuaGVpZ2h0IC0gNTApO1xuICAgICAgICBjYXJyeWluZ0NyYXRlID0gZmFsc2U7XG4gICAgICAgIGNyYXRlc0NvbGxlY3RlZCsrO1xuICAgICAgICBzY29yZVRleHQudGV4dCA9ICdDcmF0ZXMgQ29sbGVjdGVkOiAnICsgY3JhdGVzQ29sbGVjdGVkO1xuICAgICAgICBwbGF5ZXJCYXJIaWRlKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gbWlzc1BhZChwbGF5ZXIsIGNyYXRlKSB7XG4gICAgaXNGaXJzdEFpcnBhZCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcblxuICAgIHBsYXllckJhci54ID0gcGxheWVyLng7XG4gICAgcGxheWVyQmFyLnkgPSBwbGF5ZXIueSArIDUwO1xuXG4gICAgLy8gU2VlIGlmIGFpcnNoaXAgaXMgb3ZlciBjcmF0ZS5cbiAgICB2YXIgZGlkSGl0Q3JhdGUgPSBnYW1lLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAocGxheWVyLCBjcmF0ZSwgbnVsbCwgbnVsbCwgdGhpcyk7XG4gICAgaWYgKGRpZEhpdENyYXRlKSB7XG4gICAgICAgIGhpdENyYXRlKHBsYXllciwgY3JhdGUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbWlzc0NyYXRlKHBsYXllciwgY3JhdGUpO1xuICAgIH1cblxuICAgIC8vIElmIGFpcnNoaXAgaXMgb3ZlciBsYW5kaW5nIHBhZCBhbmQgY2FycnlpbmcgYSBjcmF0ZS5cbiAgICB2YXIgaGl0TGFuZGluZ1BhZCA9IGdhbWUucGh5c2ljcy5hcmNhZGUub3ZlcmxhcChwbGF5ZXIsIGFpcnBhZCwgbnVsbCwgbnVsbCwgdGhpcyk7XG4gICAgaWYgKGhpdExhbmRpbmdQYWQgJiYgY2FycnlpbmdDcmF0ZSkge1xuICAgICAgICBkcm9wQ3JhdGUoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWhpdExhbmRpbmdQYWQgJiYgY2FycnlpbmdDcmF0ZSkge1xuICAgICAgICBtaXNzUGFkKCk7XG4gICAgfVxuXG4gICAgdmFyIHZlbG9jaXR5ID0gcGxheWVyLmJvZHkudmVsb2NpdHk7XG5cbiAgICBjdXJzb3JzID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cbiAgICB2YXIgbW92ZVJhdGUgPSAyO1xuXG4gICAgLy8gU2xvdyBhaXJzaGlwIGRvd24uXG4gICAgaWYgKHZlbG9jaXR5LnggPiAwKSB7XG4gICAgICAgIHZlbG9jaXR5LnggLT0gbW92ZVJhdGUgLyA0O1xuICAgIH1cbiAgICBpZiAodmVsb2NpdHkueCA8IDApIHtcbiAgICAgICAgdmVsb2NpdHkueCArPSBtb3ZlUmF0ZSAvIDQ7XG4gICAgfVxuICAgIGlmICh2ZWxvY2l0eS55ID4gMCkge1xuICAgICAgICB2ZWxvY2l0eS55IC09IG1vdmVSYXRlIC8gNDtcbiAgICB9XG4gICAgaWYgKHZlbG9jaXR5LnkgPCAwKSB7XG4gICAgICAgIHZlbG9jaXR5LnkgKz0gbW92ZVJhdGUgLyA0O1xuICAgIH1cblxuICAgIC8vIE1vdmUgYWlyc2hpcCB3aXRoIGFycm93IGtleXMuXG4gICAgaWYgKGN1cnNvcnMudXAuaXNEb3duKSB7XG4gICAgICAgIHZlbG9jaXR5LnkgLT0gbW92ZVJhdGU7XG4gICAgfVxuICAgIGlmIChjdXJzb3JzLmRvd24uaXNEb3duKSB7XG4gICAgICAgIHZlbG9jaXR5LnkgKz0gbW92ZVJhdGU7XG4gICAgfVxuICAgIGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKSB7XG4gICAgICAgIHZlbG9jaXR5LnggLT0gbW92ZVJhdGU7XG4gICAgfVxuICAgIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bikge1xuICAgICAgICB2ZWxvY2l0eS54ICs9IG1vdmVSYXRlO1xuICAgIH1cbn0iXX0=
