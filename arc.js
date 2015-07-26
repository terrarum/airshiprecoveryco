(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require("../utils");
var Entity = require("./entity");

var setup = function() {
    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

module.exports = function(game) {
    var game = window.arc.game;
    var x = utils.getRandRange(50, game.world.width - 50);
    var y = utils.getRandRange(100, game.world.height - 50);

    var Airfield = new Entity(new Phaser.Point(x, y), "airfield");

    setup.call(Airfield);
    return Airfield;
};
},{"../utils":13,"./entity":3}],2:[function(require,module,exports){
var utils = require("../utils");
var Entity = require("./entity");

// Generates X and Y coordinates for the crate. Will later need to account
// for Airfield position to ensure there are no overlaps.
var generateCratePosition = function() {
    var game = window.arc.game;
    var x = utils.getRandRange(50, game.world.width - 50);
    var y = utils.getRandRange(100, game.world.height - 50);

    return new Phaser.Point(x, y);
};

var setup = function() {
    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

var update = function() {
    this.angle += 1;
};

module.exports = function(crateData) {
    var Crate = new Entity(generateCratePosition(), "crate", {
        update: update
    });
    Crate.data = crateData;

    setup.call(Crate);
    return Crate;
};
},{"../utils":13,"./entity":3}],3:[function(require,module,exports){
/**
 * Generic Entity class. Extends Phaser.Sprite.
 */

var Entity = function(position, spriteName, functions){
    var game = window.arc.game;

    // If Phaser functions are passed in, apply them to entity.
    if (functions !== undefined) {
        if ('create' in functions) {
            this.create = functions.create;
        }
        if ('update' in functions) {
            this.update = functions.update;
        }
    }

    Phaser.Sprite.call(this, game, position.x, position.y, spriteName);
    this.anchor.setTo(0.5, 0.5);

    game.add.existing(this);
};
Entity.prototype = Object.create(Phaser.Sprite.prototype);
Entity.prototype.constructor = Entity;

module.exports = Entity;
},{}],4:[function(require,module,exports){
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

// Drop crate off at airfield.
var depositCrate = function(player, airfield) {
    if (player.model.isFirstCollide) {
        hitTime = Date.now();
        completeTime = hitTime + player.model.dropTime;
        player.model.isFirstCollide = false;
    }

    collectUpdate();

    if (Date.now() >= completeTime) {
        console.log("crate drop");
        player.model.carryingCrate = false;
    }
}

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
    this.depositCrate = depositCrate;
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
},{"../models/airship":7,"./entity":3}],5:[function(require,module,exports){
window.arc = {
    game: new Phaser.Game(800, 600, Phaser.AUTO, 'game')
};

var load = require("./states/load");
var mainMenu = require("./states/mainmenu");
var howToPlay = require("./states/howtoplay");
var gameState = require("./states/game");
var shop = require("./states/shop");

var game = window.arc.game;

game.state.add("Load", load);
game.state.add("MainMenu", mainMenu);
game.state.add("HowToPlay", howToPlay);
game.state.add("Game", gameState);
game.state.add("Shop", shop);
game.state.start("Load");
},{"./states/game":8,"./states/howtoplay":9,"./states/load":10,"./states/mainmenu":11,"./states/shop":12}],6:[function(require,module,exports){
module.exports = [
    // Level 1.
    {
        crates: [
            {
                contents: "bits and bobs",
                value: 50
            },
            {
                contents: "whirligigs",
                value: 50
            }
        ]
    },
    // Level 2.
    {
        crates: [
            {
                name: "an elephant",
                value: 200
            },
            {
                name: "cogs",
                value: 100
            }
        ]
    }
];

// an apple
// wifi
},{}],7:[function(require,module,exports){
var airship = {
    maxVelocity: 100,
    moveRate: 2,
    velocityTolerance: 20,
    collectTime: 4000,
    dropTime: 2000,
    carryingCrate: false,
    hitTime: 0,
    isFirstCollide: true
};

module.exports = airship;
},{}],8:[function(require,module,exports){
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
},{"../entities/airfield":1,"../entities/crate":2,"../entities/player":4,"../utils":13}],9:[function(require,module,exports){
var game = window.arc.game;

var TEXT_TITLE = "Airship Recovery Co.";
var TEXT_START_BUTTON = "Start Game";
var TEXT_HELP = "* Collect Crates left on the ground.\n" +
    "* Return them to the Airpad to earn money.\n" +
    "* Maintain stability over Crates to pick them up.";

var howToPlay = function(game) {

};

howToPlay.prototype = {
    create: function() {
        // Menu label
        var menuLabel = game.add.text(game.world.width / 2, 100, TEXT_TITLE, { font: '30px Arial', fill: '#fff' });
        menuLabel.anchor.setTo(0.5, 0.5);

        var helpText = game.add.text(200, 300, TEXT_HELP, { font: '20px Arial', fill: '#fff' });
        helpText.anchor.setTo(0, 0.5);

        var startButton = new LabelButton(
            game, game.world.width / 2, game.world.height - 100,
            "button-start",
            TEXT_START_BUTTON,
            {
                "font": "18px Arial",
                "fill": "black"
            },
            this.startGame, this, 1, 2, 3);
        startButton.anchor.set(0.5, 0.5);
        startButton.input.useHandCursor = true;
    },
    startGame: function() {
        this.state.start("Game");
    }
};

module.exports = howToPlay;
},{}],10:[function(require,module,exports){
var game = window.arc.game;

var load = function(game) {

};

load.prototype = {
    preload: function() {
        this.load.image("airship", "assets/images/airship.png");
        this.load.image("airfield", "assets/images/airfield.png");
        this.load.image("crate", "assets/images/crate.png");

        // Button bitmap data.
        var buttonWidth = 600;
        var buttonBmd = game.add.bitmapData(buttonWidth, 40);
        buttonBmd.ctx.fillStyle = '#ffffff';
        buttonBmd.ctx.fillRect(0, 0, buttonWidth / 4, 40);
        buttonBmd.ctx.fillStyle = '#ff0099';
        buttonBmd.ctx.fillRect(150, 0, buttonWidth / 4, 40);
        buttonBmd.ctx.fillStyle = '#00ff99';
        buttonBmd.ctx.fillRect(300, 0, buttonWidth / 4, 40);
        buttonBmd.ctx.fillStyle = '#999999';
        buttonBmd.ctx.fillRect(450, 0, buttonWidth / 4, 40);
        this.load.spritesheet("button-start", buttonBmd.canvas.toDataURL(), buttonWidth / 4, 40);
    },
    create: function() {

        // Set the starting level.
        window.arc.level = 1;
        window.arc.levels = require("../levels");

        createLabelButton();

        this.state.start("MainMenu");
    }
};

var createLabelButton = function() {
    window.LabelButton = function(game, x, y, key, label, labelStyle, callback,
                           callbackContext, overFrame, outFrame, downFrame, upFrame) {
        Phaser.Button.call(this, game, x, y, key, callback,
            callbackContext, overFrame, outFrame, downFrame, upFrame);

        this.anchor.setTo( 0.5, 0.5 );
        this.label = new Phaser.Text(game, 0, 0, label, labelStyle);

        //puts the label in the center of the button
        this.label.anchor.setTo( 0.5, 0.5 );

        this.addChild(this.label);
        this.setLabel(label);

        //adds button to game
        game.add.existing( this );
    };

    LabelButton.prototype = Object.create(Phaser.Button.prototype);
    LabelButton.prototype.constructor = LabelButton;

    LabelButton.prototype.setLabel = function( label ) {

        this.label.setText(label);

    };
}

module.exports = load;
},{"../levels":6}],11:[function(require,module,exports){
var game = window.arc.game;

var TEXT_TITLE = "Airship Recovery Co.";
var TEXT_START_BUTTON = "Start Game";
var TEXT_HOW_TO_PLAY = "How To Play";

var state = function() {

};

state.prototype = {
    create: function() {
        // Menu label
        var menuLabel = game.add.text(game.world.width / 2, 100, TEXT_TITLE, { font: '30px Arial', fill: '#fff' });
        menuLabel.anchor.setTo(0.5, 0.5);

        var startButton = new LabelButton(
            game, game.world.width / 2, game.world.height /2,
            "button-start",
            TEXT_START_BUTTON,
            {
                "font": "18px Arial",
                "fill": "black"
            },
            this.startGame, this, 1, 2, 3);
        startButton.anchor.set(0.5, 0.5);
        startButton.input.useHandCursor = true;

        var howToPlayButton = new LabelButton(
            game, game.world.width / 2, game.world.height /2 + 75,
            "button-start",
            TEXT_HOW_TO_PLAY,
            {
                "font": "18px Arial",
                "fill": "black"
            },
            this.showHelp, this, 1, 2, 3);
        howToPlayButton.anchor.set(0.5, 0.5);
        howToPlayButton.input.useHandCursor = true;
    },
    startGame: function() {
        this.state.start("Game");
    },
    showHelp: function() {
        this.state.start("HowToPlay");
    }
};

module.exports = state;
},{}],12:[function(require,module,exports){
var shop = function(game) {

};

module.exports = shop;
},{}],13:[function(require,module,exports){
module.exports = {
    getRandRange: function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    },
    iterate: function(arr, callback) {
        for (var i = 0, len = arr.length; i < len; i++) {
            callback(arr[i]);
        }
    }
};
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9lbnRpdGllcy9haXJmaWVsZC5qcyIsInNyYy9lbnRpdGllcy9jcmF0ZS5qcyIsInNyYy9lbnRpdGllcy9lbnRpdHkuanMiLCJzcmMvZW50aXRpZXMvcGxheWVyLmpzIiwic3JjL2luaXQuanMiLCJzcmMvbGV2ZWxzLmpzIiwic3JjL21vZGVscy9haXJzaGlwLmpzIiwic3JjL3N0YXRlcy9nYW1lLmpzIiwic3JjL3N0YXRlcy9ob3d0b3BsYXkuanMiLCJzcmMvc3RhdGVzL2xvYWQuanMiLCJzcmMvc3RhdGVzL21haW5tZW51LmpzIiwic3JjL3N0YXRlcy9zaG9wLmpzIiwic3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbnZhciBFbnRpdHkgPSByZXF1aXJlKFwiLi9lbnRpdHlcIik7XG5cbnZhciBzZXR1cCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5lbmFibGUodGhpcyk7XG4gICAgdGhpcy5ib2R5LmltbW92YWJsZSA9IHRydWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGdhbWUpIHtcbiAgICB2YXIgZ2FtZSA9IHdpbmRvdy5hcmMuZ2FtZTtcbiAgICB2YXIgeCA9IHV0aWxzLmdldFJhbmRSYW5nZSg1MCwgZ2FtZS53b3JsZC53aWR0aCAtIDUwKTtcbiAgICB2YXIgeSA9IHV0aWxzLmdldFJhbmRSYW5nZSgxMDAsIGdhbWUud29ybGQuaGVpZ2h0IC0gNTApO1xuXG4gICAgdmFyIEFpcmZpZWxkID0gbmV3IEVudGl0eShuZXcgUGhhc2VyLlBvaW50KHgsIHkpLCBcImFpcmZpZWxkXCIpO1xuXG4gICAgc2V0dXAuY2FsbChBaXJmaWVsZCk7XG4gICAgcmV0dXJuIEFpcmZpZWxkO1xufTsiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG52YXIgRW50aXR5ID0gcmVxdWlyZShcIi4vZW50aXR5XCIpO1xuXG4vLyBHZW5lcmF0ZXMgWCBhbmQgWSBjb29yZGluYXRlcyBmb3IgdGhlIGNyYXRlLiBXaWxsIGxhdGVyIG5lZWQgdG8gYWNjb3VudFxuLy8gZm9yIEFpcmZpZWxkIHBvc2l0aW9uIHRvIGVuc3VyZSB0aGVyZSBhcmUgbm8gb3ZlcmxhcHMuXG52YXIgZ2VuZXJhdGVDcmF0ZVBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdhbWUgPSB3aW5kb3cuYXJjLmdhbWU7XG4gICAgdmFyIHggPSB1dGlscy5nZXRSYW5kUmFuZ2UoNTAsIGdhbWUud29ybGQud2lkdGggLSA1MCk7XG4gICAgdmFyIHkgPSB1dGlscy5nZXRSYW5kUmFuZ2UoMTAwLCBnYW1lLndvcmxkLmhlaWdodCAtIDUwKTtcblxuICAgIHJldHVybiBuZXcgUGhhc2VyLlBvaW50KHgsIHkpO1xufTtcblxudmFyIHNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzKTtcbiAgICB0aGlzLmJvZHkuaW1tb3ZhYmxlID0gdHJ1ZTtcbn07XG5cbnZhciB1cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFuZ2xlICs9IDE7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNyYXRlRGF0YSkge1xuICAgIHZhciBDcmF0ZSA9IG5ldyBFbnRpdHkoZ2VuZXJhdGVDcmF0ZVBvc2l0aW9uKCksIFwiY3JhdGVcIiwge1xuICAgICAgICB1cGRhdGU6IHVwZGF0ZVxuICAgIH0pO1xuICAgIENyYXRlLmRhdGEgPSBjcmF0ZURhdGE7XG5cbiAgICBzZXR1cC5jYWxsKENyYXRlKTtcbiAgICByZXR1cm4gQ3JhdGU7XG59OyIsIi8qKlxuICogR2VuZXJpYyBFbnRpdHkgY2xhc3MuIEV4dGVuZHMgUGhhc2VyLlNwcml0ZS5cbiAqL1xuXG52YXIgRW50aXR5ID0gZnVuY3Rpb24ocG9zaXRpb24sIHNwcml0ZU5hbWUsIGZ1bmN0aW9ucyl7XG4gICAgdmFyIGdhbWUgPSB3aW5kb3cuYXJjLmdhbWU7XG5cbiAgICAvLyBJZiBQaGFzZXIgZnVuY3Rpb25zIGFyZSBwYXNzZWQgaW4sIGFwcGx5IHRoZW0gdG8gZW50aXR5LlxuICAgIGlmIChmdW5jdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoJ2NyZWF0ZScgaW4gZnVuY3Rpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9ucy5jcmVhdGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCd1cGRhdGUnIGluIGZ1bmN0aW9ucykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbnMudXBkYXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUGhhc2VyLlNwcml0ZS5jYWxsKHRoaXMsIGdhbWUsIHBvc2l0aW9uLngsIHBvc2l0aW9uLnksIHNwcml0ZU5hbWUpO1xuICAgIHRoaXMuYW5jaG9yLnNldFRvKDAuNSwgMC41KTtcblxuICAgIGdhbWUuYWRkLmV4aXN0aW5nKHRoaXMpO1xufTtcbkVudGl0eS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TcHJpdGUucHJvdG90eXBlKTtcbkVudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBFbnRpdHk7XG5cbm1vZHVsZS5leHBvcnRzID0gRW50aXR5OyIsInZhciBFbnRpdHkgPSByZXF1aXJlKFwiLi9lbnRpdHlcIik7XG52YXIgcGxheWVyTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWxzL2FpcnNoaXBcIik7XG5cbnZhciBjdXJzb3JzLFxuICAgIHZlbG9jaXR5LFxuICAgIGdyYXZpdHk7XG5cbnZhciB1cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2ZWxvY2l0eSA9IHRoaXMuYm9keS52ZWxvY2l0eTtcbiAgICBncmF2aXR5ID0gdGhpcy5ib2R5LmdyYXZpdHk7XG4gICAgXG4gICAgLy8gTW92ZW1lbnQuXG4gICAgaWYgKGN1cnNvcnMudXAuaXNEb3duKSB7XG4gICAgICAgIHZlbG9jaXR5LnkgLT0gdGhpcy5tb2RlbC5tb3ZlUmF0ZTtcbiAgICB9XG4gICAgaWYgKGN1cnNvcnMuZG93bi5pc0Rvd24pIHtcbiAgICAgICAgdmVsb2NpdHkueSArPSB0aGlzLm1vZGVsLm1vdmVSYXRlO1xuICAgIH1cbiAgICBpZiAoY3Vyc29ycy5sZWZ0LmlzRG93bikge1xuICAgICAgICB2ZWxvY2l0eS54IC09IHRoaXMubW9kZWwubW92ZVJhdGU7XG4gICAgfVxuICAgIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bikge1xuICAgICAgICB2ZWxvY2l0eS54ICs9IHRoaXMubW9kZWwubW92ZVJhdGU7XG4gICAgfVxuXG4gICAgLy8gU2V0IG1heGltdW0gdmVsb2NpdHkuXG4gICAgaWYgKHZlbG9jaXR5LnggPiB0aGlzLm1vZGVsLm1heFZlbG9jaXR5ICsgZ3Jhdml0eS54KSB7XG4gICAgICAgIHZlbG9jaXR5LnggPSB0aGlzLm1vZGVsLm1heFZlbG9jaXR5ICsgZ3Jhdml0eS54O1xuICAgIH1cbiAgICBpZiAodmVsb2NpdHkueCA8IC10aGlzLm1vZGVsLm1heFZlbG9jaXR5ICsgZ3Jhdml0eS54KSB7XG4gICAgICAgIHZlbG9jaXR5LnggPSAtdGhpcy5tb2RlbC5tYXhWZWxvY2l0eSArIGdyYXZpdHkueDtcbiAgICB9XG4gICAgaWYgKHZlbG9jaXR5LnkgPiB0aGlzLm1vZGVsLm1heFZlbG9jaXR5ICsgZ3Jhdml0eS55KSB7XG4gICAgICAgIHZlbG9jaXR5LnkgPSB0aGlzLm1vZGVsLm1heFZlbG9jaXR5ICsgZ3Jhdml0eS55O1xuICAgIH1cbiAgICBpZiAodmVsb2NpdHkueSA8IC10aGlzLm1vZGVsLm1heFZlbG9jaXR5ICsgZ3Jhdml0eS55KSB7XG4gICAgICAgIHZlbG9jaXR5LnkgPSAtdGhpcy5tb2RlbC5tYXhWZWxvY2l0eSArIGdyYXZpdHkueTtcbiAgICB9XG59O1xuXG52YXIgaGl0VGltZTtcbnZhciBjb21wbGV0ZVRpbWU7XG52YXIgY29sbGVjdFVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXG59O1xuXG4vLyBIYW5kbGUgY29sbGVjdGlvbiBvZiB0aGUgY3JhdGUuXG52YXIgY29sbGVjdENyYXRlID0gZnVuY3Rpb24ocGxheWVyLCBjcmF0ZSkge1xuICAgIGlmIChwbGF5ZXIubW9kZWwuaXNGaXJzdENvbGxpZGUpIHtcbiAgICAgICAgaGl0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbXBsZXRlVGltZSA9IGhpdFRpbWUgKyBwbGF5ZXIubW9kZWwuY29sbGVjdFRpbWU7XG4gICAgICAgIHBsYXllci5tb2RlbC5pc0ZpcnN0Q29sbGlkZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbGxlY3RVcGRhdGUoKTtcblxuICAgIGlmIChEYXRlLm5vdygpID49IGNvbXBsZXRlVGltZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImNyYXRlIGdldFwiKTtcbiAgICAgICAgcGxheWVyLm1vZGVsLmNhcnJ5aW5nQ3JhdGUgPSB0cnVlO1xuICAgICAgICBjcmF0ZS5raWxsKCk7XG4gICAgfVxufTtcblxuLy8gRHJvcCBjcmF0ZSBvZmYgYXQgYWlyZmllbGQuXG52YXIgZGVwb3NpdENyYXRlID0gZnVuY3Rpb24ocGxheWVyLCBhaXJmaWVsZCkge1xuICAgIGlmIChwbGF5ZXIubW9kZWwuaXNGaXJzdENvbGxpZGUpIHtcbiAgICAgICAgaGl0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbXBsZXRlVGltZSA9IGhpdFRpbWUgKyBwbGF5ZXIubW9kZWwuZHJvcFRpbWU7XG4gICAgICAgIHBsYXllci5tb2RlbC5pc0ZpcnN0Q29sbGlkZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbGxlY3RVcGRhdGUoKTtcblxuICAgIGlmIChEYXRlLm5vdygpID49IGNvbXBsZXRlVGltZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImNyYXRlIGRyb3BcIik7XG4gICAgICAgIHBsYXllci5tb2RlbC5jYXJyeWluZ0NyYXRlID0gZmFsc2U7XG4gICAgfVxufVxuXG4vLyBJZiB0aGUgQWlyc2hpcCBkcmlmdHMgb2ZmIGEgY3JhdGUgb3IgdGhlIGFpcmZpZWxkLCByZXNldCBldmVyeXRoaW5nLlxudmFyIGRpZE1pc3MgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm1vZGVsLmlzRmlyc3RDb2xsaWRlID0gdHJ1ZTtcbn07XG5cbi8vIFNldCB1cCBzb21lIHByb3BlcnRpZXMgb2YgdGhlIFBsYXllciBlbnRpdHkuXG52YXIgc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMpO1xuICAgIHRoaXMubW9kZWwgPSBwbGF5ZXJNb2RlbDtcbiAgICB0aGlzLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcbiAgICB0aGlzLmNvbGxlY3RDcmF0ZSA9IGNvbGxlY3RDcmF0ZTtcbiAgICB0aGlzLmRlcG9zaXRDcmF0ZSA9IGRlcG9zaXRDcmF0ZTtcbiAgICB0aGlzLmRpZE1pc3MgPSBkaWRNaXNzO1xuXG4gICAgY3Vyc29ycyA9IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4gICAgdmFyIFBsYXllciA9IG5ldyBFbnRpdHkocG9zaXRpb24sIFwiYWlyc2hpcFwiLCB7XG4gICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgfSk7XG5cbiAgICBzZXR1cC5jYWxsKFBsYXllcik7XG4gICAgcmV0dXJuIFBsYXllcjtcbn07Iiwid2luZG93LmFyYyA9IHtcbiAgICBnYW1lOiBuZXcgUGhhc2VyLkdhbWUoODAwLCA2MDAsIFBoYXNlci5BVVRPLCAnZ2FtZScpXG59O1xuXG52YXIgbG9hZCA9IHJlcXVpcmUoXCIuL3N0YXRlcy9sb2FkXCIpO1xudmFyIG1haW5NZW51ID0gcmVxdWlyZShcIi4vc3RhdGVzL21haW5tZW51XCIpO1xudmFyIGhvd1RvUGxheSA9IHJlcXVpcmUoXCIuL3N0YXRlcy9ob3d0b3BsYXlcIik7XG52YXIgZ2FtZVN0YXRlID0gcmVxdWlyZShcIi4vc3RhdGVzL2dhbWVcIik7XG52YXIgc2hvcCA9IHJlcXVpcmUoXCIuL3N0YXRlcy9zaG9wXCIpO1xuXG52YXIgZ2FtZSA9IHdpbmRvdy5hcmMuZ2FtZTtcblxuZ2FtZS5zdGF0ZS5hZGQoXCJMb2FkXCIsIGxvYWQpO1xuZ2FtZS5zdGF0ZS5hZGQoXCJNYWluTWVudVwiLCBtYWluTWVudSk7XG5nYW1lLnN0YXRlLmFkZChcIkhvd1RvUGxheVwiLCBob3dUb1BsYXkpO1xuZ2FtZS5zdGF0ZS5hZGQoXCJHYW1lXCIsIGdhbWVTdGF0ZSk7XG5nYW1lLnN0YXRlLmFkZChcIlNob3BcIiwgc2hvcCk7XG5nYW1lLnN0YXRlLnN0YXJ0KFwiTG9hZFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICAvLyBMZXZlbCAxLlxuICAgIHtcbiAgICAgICAgY3JhdGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29udGVudHM6IFwiYml0cyBhbmQgYm9ic1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb250ZW50czogXCJ3aGlybGlnaWdzXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDUwXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuICAgIC8vIExldmVsIDIuXG4gICAge1xuICAgICAgICBjcmF0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcImFuIGVsZXBoYW50XCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDIwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcImNvZ3NcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogMTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9XG5dO1xuXG4vLyBhbiBhcHBsZVxuLy8gd2lmaSIsInZhciBhaXJzaGlwID0ge1xuICAgIG1heFZlbG9jaXR5OiAxMDAsXG4gICAgbW92ZVJhdGU6IDIsXG4gICAgdmVsb2NpdHlUb2xlcmFuY2U6IDIwLFxuICAgIGNvbGxlY3RUaW1lOiA0MDAwLFxuICAgIGRyb3BUaW1lOiAyMDAwLFxuICAgIGNhcnJ5aW5nQ3JhdGU6IGZhbHNlLFxuICAgIGhpdFRpbWU6IDAsXG4gICAgaXNGaXJzdENvbGxpZGU6IHRydWVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYWlyc2hpcDsiLCJ2YXIgUGxheWVyID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL3BsYXllclwiKTtcbnZhciBBaXJmaWVsZCA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9haXJmaWVsZFwiKTtcbnZhciBDcmF0ZSA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9jcmF0ZVwiKTtcblxudmFyIHV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuXG52YXIgbGlmZVNwYW4gPSA1MDAwO1xudmFyIHdpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBVcGRhdGUgbGlmZXNwYW4gb2Ygd2luZC5cbiAgICBsaWZlU3BhbiAtPSB3aW5kb3cuYXJjLmdhbWUudGltZS5waHlzaWNzRWxhcHNlZE1TO1xuXG4gICAgLy8gR2VuZXJhdGUgbmV3IHdpbmQuXG4gICAgaWYgKGxpZmVTcGFuIDw9IDApIHtcbiAgICAgICAgbGlmZVNwYW4gPSB1dGlscy5nZXRSYW5kUmFuZ2UoMTAwMCwgMTAwMDApXG4gICAgICAgIHdpbmRvdy5hcmMucGxheWVyLmJvZHkuZ3Jhdml0eS54ID0gdXRpbHMuZ2V0UmFuZFJhbmdlKC04MCwgODApO1xuICAgICAgICB3aW5kb3cuYXJjLnBsYXllci5ib2R5LmdyYXZpdHkueSA9IHV0aWxzLmdldFJhbmRSYW5nZSgtODAsIDgwKTtcbiAgICB9XG59O1xuXG52YXIgY3JhdGVzO1xudmFyIHN0YXRlID0gZnVuY3Rpb24oZ2FtZSkge307XG5zdGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcblxuICAgICAgICB2YXIgbGV2ZWxEYXRhID0gd2luZG93LmFyYy5sZXZlbHNbd2luZG93LmFyYy5sZXZlbCAtIDFdO1xuXG4gICAgICAgIC8vIENyZWF0ZSBhaXJmaWVsZC5cbiAgICAgICAgd2luZG93LmFyYy5haXJmaWVsZCA9IG5ldyBBaXJmaWVsZCgpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBjcmF0ZXMuXG4gICAgICAgIHdpbmRvdy5hcmMuY3JhdGVzID0gW107XG4gICAgICAgIGNyYXRlcyA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdXRpbHMuaXRlcmF0ZShsZXZlbERhdGEuY3JhdGVzLCBmdW5jdGlvbihjcmF0ZURhdGEpIHtcbiAgICAgICAgICAgIHZhciBjcmF0ZSA9IG5ldyBDcmF0ZShjcmF0ZURhdGEpO1xuICAgICAgICAgICAgY3JhdGVzLmFkZChjcmF0ZSk7XG4gICAgICAgICAgICB3aW5kb3cuYXJjLmNyYXRlcy5wdXNoKGNyYXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHBsYXllci5cbiAgICAgICAgd2luZG93LmFyYy5wbGF5ZXIgPSBuZXcgUGxheWVyKHdpbmRvdy5hcmMuYWlyZmllbGQucG9zaXRpb24pO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBsYXllciA9IHdpbmRvdy5hcmMucGxheWVyO1xuICAgICAgICAvLyBBZGp1c3QgdGhlIHdpbmQgYWZmZWN0aW5nIHRoZSBwbGF5ZXIuXG4gICAgICAgIC8vd2luZCgpO1xuXG4gICAgICAgIC8vIEhhbmRsZSBjcmF0ZSBhbmQgYWlyZmllbGQgY29sbGlzaW9ucy5cblxuICAgICAgICAvLyBJZiByZWFkeSB0byBjb2xsaWRlIHdpdGggdGhlIGFpcmZpZWxkLlxuICAgICAgICBpZiAocGxheWVyLm1vZGVsLmNhcnJ5aW5nQ3JhdGUpIHtcbiAgICAgICAgICAgIHZhciBkaWRIaXQgPSB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUub3ZlcmxhcChwbGF5ZXIsIHdpbmRvdy5hcmMuYWlyZmllbGQsIHdpbmRvdy5hcmMucGxheWVyLmRlcG9zaXRDcmF0ZSwgbnVsbCwgdGhpcyk7XG4gICAgICAgICAgICBpZiAoIWRpZEhpdCAmJiAhcGxheWVyLm1vZGVsLmlzRmlyc3RDb2xsaWRlKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmRpZE1pc3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiByZWFkeSB0byBjb2xsaWRlIHdpdGggYSBjcmF0ZS5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZGlkSGl0ID0gdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAocGxheWVyLCBjcmF0ZXMsIHdpbmRvdy5hcmMucGxheWVyLmNvbGxlY3RDcmF0ZSwgbnVsbCwgdGhpcyk7XG4gICAgICAgICAgICBpZiAoIWRpZEhpdCAmJiAhcGxheWVyLm1vZGVsLmlzRmlyc3RDb2xsaWRlKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmRpZE1pc3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdGF0ZTsiLCJ2YXIgZ2FtZSA9IHdpbmRvdy5hcmMuZ2FtZTtcblxudmFyIFRFWFRfVElUTEUgPSBcIkFpcnNoaXAgUmVjb3ZlcnkgQ28uXCI7XG52YXIgVEVYVF9TVEFSVF9CVVRUT04gPSBcIlN0YXJ0IEdhbWVcIjtcbnZhciBURVhUX0hFTFAgPSBcIiogQ29sbGVjdCBDcmF0ZXMgbGVmdCBvbiB0aGUgZ3JvdW5kLlxcblwiICtcbiAgICBcIiogUmV0dXJuIHRoZW0gdG8gdGhlIEFpcnBhZCB0byBlYXJuIG1vbmV5LlxcblwiICtcbiAgICBcIiogTWFpbnRhaW4gc3RhYmlsaXR5IG92ZXIgQ3JhdGVzIHRvIHBpY2sgdGhlbSB1cC5cIjtcblxudmFyIGhvd1RvUGxheSA9IGZ1bmN0aW9uKGdhbWUpIHtcblxufTtcblxuaG93VG9QbGF5LnByb3RvdHlwZSA9IHtcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBNZW51IGxhYmVsXG4gICAgICAgIHZhciBtZW51TGFiZWwgPSBnYW1lLmFkZC50ZXh0KGdhbWUud29ybGQud2lkdGggLyAyLCAxMDAsIFRFWFRfVElUTEUsIHsgZm9udDogJzMwcHggQXJpYWwnLCBmaWxsOiAnI2ZmZicgfSk7XG4gICAgICAgIG1lbnVMYWJlbC5hbmNob3Iuc2V0VG8oMC41LCAwLjUpO1xuXG4gICAgICAgIHZhciBoZWxwVGV4dCA9IGdhbWUuYWRkLnRleHQoMjAwLCAzMDAsIFRFWFRfSEVMUCwgeyBmb250OiAnMjBweCBBcmlhbCcsIGZpbGw6ICcjZmZmJyB9KTtcbiAgICAgICAgaGVscFRleHQuYW5jaG9yLnNldFRvKDAsIDAuNSk7XG5cbiAgICAgICAgdmFyIHN0YXJ0QnV0dG9uID0gbmV3IExhYmVsQnV0dG9uKFxuICAgICAgICAgICAgZ2FtZSwgZ2FtZS53b3JsZC53aWR0aCAvIDIsIGdhbWUud29ybGQuaGVpZ2h0IC0gMTAwLFxuICAgICAgICAgICAgXCJidXR0b24tc3RhcnRcIixcbiAgICAgICAgICAgIFRFWFRfU1RBUlRfQlVUVE9OLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiZm9udFwiOiBcIjE4cHggQXJpYWxcIixcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJibGFja1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpcy5zdGFydEdhbWUsIHRoaXMsIDEsIDIsIDMpO1xuICAgICAgICBzdGFydEJ1dHRvbi5hbmNob3Iuc2V0KDAuNSwgMC41KTtcbiAgICAgICAgc3RhcnRCdXR0b24uaW5wdXQudXNlSGFuZEN1cnNvciA9IHRydWU7XG4gICAgfSxcbiAgICBzdGFydEdhbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KFwiR2FtZVwiKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGhvd1RvUGxheTsiLCJ2YXIgZ2FtZSA9IHdpbmRvdy5hcmMuZ2FtZTtcblxudmFyIGxvYWQgPSBmdW5jdGlvbihnYW1lKSB7XG5cbn07XG5cbmxvYWQucHJvdG90eXBlID0ge1xuICAgIHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoXCJhaXJzaGlwXCIsIFwiYXNzZXRzL2ltYWdlcy9haXJzaGlwLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKFwiYWlyZmllbGRcIiwgXCJhc3NldHMvaW1hZ2VzL2FpcmZpZWxkLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKFwiY3JhdGVcIiwgXCJhc3NldHMvaW1hZ2VzL2NyYXRlLnBuZ1wiKTtcblxuICAgICAgICAvLyBCdXR0b24gYml0bWFwIGRhdGEuXG4gICAgICAgIHZhciBidXR0b25XaWR0aCA9IDYwMDtcbiAgICAgICAgdmFyIGJ1dHRvbkJtZCA9IGdhbWUuYWRkLmJpdG1hcERhdGEoYnV0dG9uV2lkdGgsIDQwKTtcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsU3R5bGUgPSAnI2ZmZmZmZic7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFJlY3QoMCwgMCwgYnV0dG9uV2lkdGggLyA0LCA0MCk7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFN0eWxlID0gJyNmZjAwOTknO1xuICAgICAgICBidXR0b25CbWQuY3R4LmZpbGxSZWN0KDE1MCwgMCwgYnV0dG9uV2lkdGggLyA0LCA0MCk7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFN0eWxlID0gJyMwMGZmOTknO1xuICAgICAgICBidXR0b25CbWQuY3R4LmZpbGxSZWN0KDMwMCwgMCwgYnV0dG9uV2lkdGggLyA0LCA0MCk7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFN0eWxlID0gJyM5OTk5OTknO1xuICAgICAgICBidXR0b25CbWQuY3R4LmZpbGxSZWN0KDQ1MCwgMCwgYnV0dG9uV2lkdGggLyA0LCA0MCk7XG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldChcImJ1dHRvbi1zdGFydFwiLCBidXR0b25CbWQuY2FudmFzLnRvRGF0YVVSTCgpLCBidXR0b25XaWR0aCAvIDQsIDQwKTtcbiAgICB9LFxuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBzdGFydGluZyBsZXZlbC5cbiAgICAgICAgd2luZG93LmFyYy5sZXZlbCA9IDE7XG4gICAgICAgIHdpbmRvdy5hcmMubGV2ZWxzID0gcmVxdWlyZShcIi4uL2xldmVsc1wiKTtcblxuICAgICAgICBjcmVhdGVMYWJlbEJ1dHRvbigpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJNYWluTWVudVwiKTtcbiAgICB9XG59O1xuXG52YXIgY3JlYXRlTGFiZWxCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cuTGFiZWxCdXR0b24gPSBmdW5jdGlvbihnYW1lLCB4LCB5LCBrZXksIGxhYmVsLCBsYWJlbFN0eWxlLCBjYWxsYmFjayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrQ29udGV4dCwgb3ZlckZyYW1lLCBvdXRGcmFtZSwgZG93bkZyYW1lLCB1cEZyYW1lKSB7XG4gICAgICAgIFBoYXNlci5CdXR0b24uY2FsbCh0aGlzLCBnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLFxuICAgICAgICAgICAgY2FsbGJhY2tDb250ZXh0LCBvdmVyRnJhbWUsIG91dEZyYW1lLCBkb3duRnJhbWUsIHVwRnJhbWUpO1xuXG4gICAgICAgIHRoaXMuYW5jaG9yLnNldFRvKCAwLjUsIDAuNSApO1xuICAgICAgICB0aGlzLmxhYmVsID0gbmV3IFBoYXNlci5UZXh0KGdhbWUsIDAsIDAsIGxhYmVsLCBsYWJlbFN0eWxlKTtcblxuICAgICAgICAvL3B1dHMgdGhlIGxhYmVsIGluIHRoZSBjZW50ZXIgb2YgdGhlIGJ1dHRvblxuICAgICAgICB0aGlzLmxhYmVsLmFuY2hvci5zZXRUbyggMC41LCAwLjUgKTtcblxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubGFiZWwpO1xuICAgICAgICB0aGlzLnNldExhYmVsKGxhYmVsKTtcblxuICAgICAgICAvL2FkZHMgYnV0dG9uIHRvIGdhbWVcbiAgICAgICAgZ2FtZS5hZGQuZXhpc3RpbmcoIHRoaXMgKTtcbiAgICB9O1xuXG4gICAgTGFiZWxCdXR0b24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuQnV0dG9uLnByb3RvdHlwZSk7XG4gICAgTGFiZWxCdXR0b24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGFiZWxCdXR0b247XG5cbiAgICBMYWJlbEJ1dHRvbi5wcm90b3R5cGUuc2V0TGFiZWwgPSBmdW5jdGlvbiggbGFiZWwgKSB7XG5cbiAgICAgICAgdGhpcy5sYWJlbC5zZXRUZXh0KGxhYmVsKTtcblxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbG9hZDsiLCJ2YXIgZ2FtZSA9IHdpbmRvdy5hcmMuZ2FtZTtcblxudmFyIFRFWFRfVElUTEUgPSBcIkFpcnNoaXAgUmVjb3ZlcnkgQ28uXCI7XG52YXIgVEVYVF9TVEFSVF9CVVRUT04gPSBcIlN0YXJ0IEdhbWVcIjtcbnZhciBURVhUX0hPV19UT19QTEFZID0gXCJIb3cgVG8gUGxheVwiO1xuXG52YXIgc3RhdGUgPSBmdW5jdGlvbigpIHtcblxufTtcblxuc3RhdGUucHJvdG90eXBlID0ge1xuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIE1lbnUgbGFiZWxcbiAgICAgICAgdmFyIG1lbnVMYWJlbCA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC53aWR0aCAvIDIsIDEwMCwgVEVYVF9USVRMRSwgeyBmb250OiAnMzBweCBBcmlhbCcsIGZpbGw6ICcjZmZmJyB9KTtcbiAgICAgICAgbWVudUxhYmVsLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XG5cbiAgICAgICAgdmFyIHN0YXJ0QnV0dG9uID0gbmV3IExhYmVsQnV0dG9uKFxuICAgICAgICAgICAgZ2FtZSwgZ2FtZS53b3JsZC53aWR0aCAvIDIsIGdhbWUud29ybGQuaGVpZ2h0IC8yLFxuICAgICAgICAgICAgXCJidXR0b24tc3RhcnRcIixcbiAgICAgICAgICAgIFRFWFRfU1RBUlRfQlVUVE9OLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiZm9udFwiOiBcIjE4cHggQXJpYWxcIixcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJibGFja1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpcy5zdGFydEdhbWUsIHRoaXMsIDEsIDIsIDMpO1xuICAgICAgICBzdGFydEJ1dHRvbi5hbmNob3Iuc2V0KDAuNSwgMC41KTtcbiAgICAgICAgc3RhcnRCdXR0b24uaW5wdXQudXNlSGFuZEN1cnNvciA9IHRydWU7XG5cbiAgICAgICAgdmFyIGhvd1RvUGxheUJ1dHRvbiA9IG5ldyBMYWJlbEJ1dHRvbihcbiAgICAgICAgICAgIGdhbWUsIGdhbWUud29ybGQud2lkdGggLyAyLCBnYW1lLndvcmxkLmhlaWdodCAvMiArIDc1LFxuICAgICAgICAgICAgXCJidXR0b24tc3RhcnRcIixcbiAgICAgICAgICAgIFRFWFRfSE9XX1RPX1BMQVksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJmb250XCI6IFwiMThweCBBcmlhbFwiLFxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcImJsYWNrXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzLnNob3dIZWxwLCB0aGlzLCAxLCAyLCAzKTtcbiAgICAgICAgaG93VG9QbGF5QnV0dG9uLmFuY2hvci5zZXQoMC41LCAwLjUpO1xuICAgICAgICBob3dUb1BsYXlCdXR0b24uaW5wdXQudXNlSGFuZEN1cnNvciA9IHRydWU7XG4gICAgfSxcbiAgICBzdGFydEdhbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KFwiR2FtZVwiKTtcbiAgICB9LFxuICAgIHNob3dIZWxwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydChcIkhvd1RvUGxheVwiKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXRlOyIsInZhciBzaG9wID0gZnVuY3Rpb24oZ2FtZSkge1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3A7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0UmFuZFJhbmdlOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcbiAgICB9LFxuICAgIGl0ZXJhdGU6IGZ1bmN0aW9uKGFyciwgY2FsbGJhY2spIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY2FsbGJhY2soYXJyW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbn07Il19
