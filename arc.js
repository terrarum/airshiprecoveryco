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
        wind();

        // Handle crate and airfield collisions.

        // If ready to collide with the airfiel.
        if (player.model.carryingCrate) {

        }
        // If ready to collide with a create
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9lbnRpdGllcy9haXJmaWVsZC5qcyIsInNyYy9lbnRpdGllcy9jcmF0ZS5qcyIsInNyYy9lbnRpdGllcy9lbnRpdHkuanMiLCJzcmMvZW50aXRpZXMvcGxheWVyLmpzIiwic3JjL2luaXQuanMiLCJzcmMvbGV2ZWxzLmpzIiwic3JjL21vZGVscy9haXJzaGlwLmpzIiwic3JjL3N0YXRlcy9nYW1lLmpzIiwic3JjL3N0YXRlcy9ob3d0b3BsYXkuanMiLCJzcmMvc3RhdGVzL2xvYWQuanMiLCJzcmMvc3RhdGVzL21haW5tZW51LmpzIiwic3JjL3N0YXRlcy9zaG9wLmpzIiwic3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xudmFyIEVudGl0eSA9IHJlcXVpcmUoXCIuL2VudGl0eVwiKTtcblxudmFyIHNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzKTtcbiAgICB0aGlzLmJvZHkuaW1tb3ZhYmxlID0gdHJ1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZ2FtZSkge1xuICAgIHZhciBnYW1lID0gd2luZG93LmFyYy5nYW1lO1xuICAgIHZhciB4ID0gdXRpbHMuZ2V0UmFuZFJhbmdlKDUwLCBnYW1lLndvcmxkLndpZHRoIC0gNTApO1xuICAgIHZhciB5ID0gdXRpbHMuZ2V0UmFuZFJhbmdlKDEwMCwgZ2FtZS53b3JsZC5oZWlnaHQgLSA1MCk7XG5cbiAgICB2YXIgQWlyZmllbGQgPSBuZXcgRW50aXR5KG5ldyBQaGFzZXIuUG9pbnQoeCwgeSksIFwiYWlyZmllbGRcIik7XG5cbiAgICBzZXR1cC5jYWxsKEFpcmZpZWxkKTtcbiAgICByZXR1cm4gQWlyZmllbGQ7XG59OyIsInZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbnZhciBFbnRpdHkgPSByZXF1aXJlKFwiLi9lbnRpdHlcIik7XG5cbi8vIEdlbmVyYXRlcyBYIGFuZCBZIGNvb3JkaW5hdGVzIGZvciB0aGUgY3JhdGUuIFdpbGwgbGF0ZXIgbmVlZCB0byBhY2NvdW50XG4vLyBmb3IgQWlyZmllbGQgcG9zaXRpb24gdG8gZW5zdXJlIHRoZXJlIGFyZSBubyBvdmVybGFwcy5cbnZhciBnZW5lcmF0ZUNyYXRlUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZ2FtZSA9IHdpbmRvdy5hcmMuZ2FtZTtcbiAgICB2YXIgeCA9IHV0aWxzLmdldFJhbmRSYW5nZSg1MCwgZ2FtZS53b3JsZC53aWR0aCAtIDUwKTtcbiAgICB2YXIgeSA9IHV0aWxzLmdldFJhbmRSYW5nZSgxMDAsIGdhbWUud29ybGQuaGVpZ2h0IC0gNTApO1xuXG4gICAgcmV0dXJuIG5ldyBQaGFzZXIuUG9pbnQoeCwgeSk7XG59O1xuXG52YXIgc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMpO1xuICAgIHRoaXMuYm9keS5pbW1vdmFibGUgPSB0cnVlO1xufTtcblxudmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYW5nbGUgKz0gMTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3JhdGVEYXRhKSB7XG4gICAgdmFyIENyYXRlID0gbmV3IEVudGl0eShnZW5lcmF0ZUNyYXRlUG9zaXRpb24oKSwgXCJjcmF0ZVwiLCB7XG4gICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgfSk7XG4gICAgQ3JhdGUuZGF0YSA9IGNyYXRlRGF0YTtcblxuICAgIHNldHVwLmNhbGwoQ3JhdGUpO1xuICAgIHJldHVybiBDcmF0ZTtcbn07IiwiLyoqXG4gKiBHZW5lcmljIEVudGl0eSBjbGFzcy4gRXh0ZW5kcyBQaGFzZXIuU3ByaXRlLlxuICovXG5cbnZhciBFbnRpdHkgPSBmdW5jdGlvbihwb3NpdGlvbiwgc3ByaXRlTmFtZSwgZnVuY3Rpb25zKXtcbiAgICB2YXIgZ2FtZSA9IHdpbmRvdy5hcmMuZ2FtZTtcblxuICAgIC8vIElmIFBoYXNlciBmdW5jdGlvbnMgYXJlIHBhc3NlZCBpbiwgYXBwbHkgdGhlbSB0byBlbnRpdHkuXG4gICAgaWYgKGZ1bmN0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICgnY3JlYXRlJyBpbiBmdW5jdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb25zLmNyZWF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ3VwZGF0ZScgaW4gZnVuY3Rpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9ucy51cGRhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQaGFzZXIuU3ByaXRlLmNhbGwodGhpcywgZ2FtZSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSwgc3ByaXRlTmFtZSk7XG4gICAgdGhpcy5hbmNob3Iuc2V0VG8oMC41LCAwLjUpO1xuXG4gICAgZ2FtZS5hZGQuZXhpc3RpbmcodGhpcyk7XG59O1xuRW50aXR5LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUGhhc2VyLlNwcml0ZS5wcm90b3R5cGUpO1xuRW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEVudGl0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7IiwidmFyIEVudGl0eSA9IHJlcXVpcmUoXCIuL2VudGl0eVwiKTtcbnZhciBwbGF5ZXJNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbHMvYWlyc2hpcFwiKTtcblxudmFyIGN1cnNvcnMsXG4gICAgdmVsb2NpdHksXG4gICAgZ3Jhdml0eTtcblxudmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZlbG9jaXR5ID0gdGhpcy5ib2R5LnZlbG9jaXR5O1xuICAgIGdyYXZpdHkgPSB0aGlzLmJvZHkuZ3Jhdml0eTtcbiAgICBcbiAgICAvLyBNb3ZlbWVudC5cbiAgICBpZiAoY3Vyc29ycy51cC5pc0Rvd24pIHtcbiAgICAgICAgdmVsb2NpdHkueSAtPSB0aGlzLm1vZGVsLm1vdmVSYXRlO1xuICAgIH1cbiAgICBpZiAoY3Vyc29ycy5kb3duLmlzRG93bikge1xuICAgICAgICB2ZWxvY2l0eS55ICs9IHRoaXMubW9kZWwubW92ZVJhdGU7XG4gICAgfVxuICAgIGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKSB7XG4gICAgICAgIHZlbG9jaXR5LnggLT0gdGhpcy5tb2RlbC5tb3ZlUmF0ZTtcbiAgICB9XG4gICAgaWYgKGN1cnNvcnMucmlnaHQuaXNEb3duKSB7XG4gICAgICAgIHZlbG9jaXR5LnggKz0gdGhpcy5tb2RlbC5tb3ZlUmF0ZTtcbiAgICB9XG5cbiAgICAvLyBTZXQgbWF4aW11bSB2ZWxvY2l0eS5cbiAgICBpZiAodmVsb2NpdHkueCA+IHRoaXMubW9kZWwubWF4VmVsb2NpdHkgKyBncmF2aXR5LngpIHtcbiAgICAgICAgdmVsb2NpdHkueCA9IHRoaXMubW9kZWwubWF4VmVsb2NpdHkgKyBncmF2aXR5Lng7XG4gICAgfVxuICAgIGlmICh2ZWxvY2l0eS54IDwgLXRoaXMubW9kZWwubWF4VmVsb2NpdHkgKyBncmF2aXR5LngpIHtcbiAgICAgICAgdmVsb2NpdHkueCA9IC10aGlzLm1vZGVsLm1heFZlbG9jaXR5ICsgZ3Jhdml0eS54O1xuICAgIH1cbiAgICBpZiAodmVsb2NpdHkueSA+IHRoaXMubW9kZWwubWF4VmVsb2NpdHkgKyBncmF2aXR5LnkpIHtcbiAgICAgICAgdmVsb2NpdHkueSA9IHRoaXMubW9kZWwubWF4VmVsb2NpdHkgKyBncmF2aXR5Lnk7XG4gICAgfVxuICAgIGlmICh2ZWxvY2l0eS55IDwgLXRoaXMubW9kZWwubWF4VmVsb2NpdHkgKyBncmF2aXR5LnkpIHtcbiAgICAgICAgdmVsb2NpdHkueSA9IC10aGlzLm1vZGVsLm1heFZlbG9jaXR5ICsgZ3Jhdml0eS55O1xuICAgIH1cbn07XG5cbnZhciBoaXRUaW1lO1xudmFyIGNvbXBsZXRlVGltZTtcbnZhciBjb2xsZWN0VXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cbn07XG4vLyBIYW5kbGUgY29sbGVjdGlvbiBvZiB0aGUgY3JhdGUuXG52YXIgY29sbGVjdENyYXRlID0gZnVuY3Rpb24ocGxheWVyLCBjcmF0ZSkge1xuICAgIGlmIChwbGF5ZXIubW9kZWwuaXNGaXJzdENvbGxpZGUpIHtcbiAgICAgICAgaGl0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbXBsZXRlVGltZSA9IGhpdFRpbWUgKyBwbGF5ZXIubW9kZWwuY29sbGVjdFRpbWU7XG4gICAgICAgIHBsYXllci5tb2RlbC5pc0ZpcnN0Q29sbGlkZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbGxlY3RVcGRhdGUoKTtcblxuICAgIGlmIChEYXRlLm5vdygpID49IGNvbXBsZXRlVGltZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImNyYXRlIGdldFwiKTtcbiAgICAgICAgcGxheWVyLm1vZGVsLmNhcnJ5aW5nQ3JhdGUgPSB0cnVlO1xuICAgICAgICBjcmF0ZS5raWxsKCk7XG4gICAgfVxufTtcblxuLy8gSWYgdGhlIEFpcnNoaXAgZHJpZnRzIG9mZiBhIGNyYXRlIG9yIHRoZSBhaXJmaWVsZCwgcmVzZXQgZXZlcnl0aGluZy5cbnZhciBkaWRNaXNzID0gZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLm1vZGVsLmlzRmlyc3RDb2xsaWRlID0gdHJ1ZTtcbn07XG5cbi8vIFNldCB1cCBzb21lIHByb3BlcnRpZXMgb2YgdGhlIFBsYXllciBlbnRpdHkuXG52YXIgc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMpO1xuICAgIHRoaXMubW9kZWwgPSBwbGF5ZXJNb2RlbDtcbiAgICB0aGlzLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcbiAgICB0aGlzLmNvbGxlY3RDcmF0ZSA9IGNvbGxlY3RDcmF0ZTtcbiAgICB0aGlzLmRpZE1pc3MgPSBkaWRNaXNzO1xuXG4gICAgY3Vyc29ycyA9IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4gICAgdmFyIFBsYXllciA9IG5ldyBFbnRpdHkocG9zaXRpb24sIFwiYWlyc2hpcFwiLCB7XG4gICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgfSk7XG5cbiAgICBzZXR1cC5jYWxsKFBsYXllcik7XG4gICAgcmV0dXJuIFBsYXllcjtcbn07Iiwid2luZG93LmFyYyA9IHtcbiAgICBnYW1lOiBuZXcgUGhhc2VyLkdhbWUoODAwLCA2MDAsIFBoYXNlci5BVVRPLCAnZ2FtZScpXG59O1xuXG52YXIgbG9hZCA9IHJlcXVpcmUoXCIuL3N0YXRlcy9sb2FkXCIpO1xudmFyIG1haW5NZW51ID0gcmVxdWlyZShcIi4vc3RhdGVzL21haW5tZW51XCIpO1xudmFyIGhvd1RvUGxheSA9IHJlcXVpcmUoXCIuL3N0YXRlcy9ob3d0b3BsYXlcIik7XG52YXIgZ2FtZVN0YXRlID0gcmVxdWlyZShcIi4vc3RhdGVzL2dhbWVcIik7XG52YXIgc2hvcCA9IHJlcXVpcmUoXCIuL3N0YXRlcy9zaG9wXCIpO1xuXG52YXIgZ2FtZSA9IHdpbmRvdy5hcmMuZ2FtZTtcblxuZ2FtZS5zdGF0ZS5hZGQoXCJMb2FkXCIsIGxvYWQpO1xuZ2FtZS5zdGF0ZS5hZGQoXCJNYWluTWVudVwiLCBtYWluTWVudSk7XG5nYW1lLnN0YXRlLmFkZChcIkhvd1RvUGxheVwiLCBob3dUb1BsYXkpO1xuZ2FtZS5zdGF0ZS5hZGQoXCJHYW1lXCIsIGdhbWVTdGF0ZSk7XG5nYW1lLnN0YXRlLmFkZChcIlNob3BcIiwgc2hvcCk7XG5nYW1lLnN0YXRlLnN0YXJ0KFwiTG9hZFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICAvLyBMZXZlbCAxLlxuICAgIHtcbiAgICAgICAgY3JhdGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29udGVudHM6IFwiYml0cyBhbmQgYm9ic1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb250ZW50czogXCJ3aGlybGlnaWdzXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDUwXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuICAgIC8vIExldmVsIDIuXG4gICAge1xuICAgICAgICBjcmF0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcImFuIGVsZXBoYW50XCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDIwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcImNvZ3NcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogMTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9XG5dO1xuXG4vLyBhbiBhcHBsZVxuLy8gd2lmaSIsInZhciBhaXJzaGlwID0ge1xuICAgIG1heFZlbG9jaXR5OiAxMDAsXG4gICAgbW92ZVJhdGU6IDIsXG4gICAgdmVsb2NpdHlUb2xlcmFuY2U6IDIwLFxuICAgIGNvbGxlY3RUaW1lOiA0MDAwLFxuICAgIGRyb3BUaW1lOiAyMDAwLFxuICAgIGNhcnJ5aW5nQ3JhdGU6IGZhbHNlLFxuICAgIGhpdFRpbWU6IDAsXG4gICAgaXNGaXJzdENvbGxpZGU6IHRydWVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYWlyc2hpcDsiLCJ2YXIgUGxheWVyID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL3BsYXllclwiKTtcbnZhciBBaXJmaWVsZCA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9haXJmaWVsZFwiKTtcbnZhciBDcmF0ZSA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9jcmF0ZVwiKTtcblxudmFyIHV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuXG52YXIgbGlmZVNwYW4gPSA1MDAwO1xudmFyIHdpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBVcGRhdGUgbGlmZXNwYW4gb2Ygd2luZC5cbiAgICBsaWZlU3BhbiAtPSB3aW5kb3cuYXJjLmdhbWUudGltZS5waHlzaWNzRWxhcHNlZE1TO1xuXG4gICAgLy8gR2VuZXJhdGUgbmV3IHdpbmQuXG4gICAgaWYgKGxpZmVTcGFuIDw9IDApIHtcbiAgICAgICAgbGlmZVNwYW4gPSB1dGlscy5nZXRSYW5kUmFuZ2UoMTAwMCwgMTAwMDApXG4gICAgICAgIHdpbmRvdy5hcmMucGxheWVyLmJvZHkuZ3Jhdml0eS54ID0gdXRpbHMuZ2V0UmFuZFJhbmdlKC04MCwgODApO1xuICAgICAgICB3aW5kb3cuYXJjLnBsYXllci5ib2R5LmdyYXZpdHkueSA9IHV0aWxzLmdldFJhbmRSYW5nZSgtODAsIDgwKTtcbiAgICB9XG59O1xuXG52YXIgY3JhdGVzO1xudmFyIHN0YXRlID0gZnVuY3Rpb24oZ2FtZSkge307XG5zdGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcblxuICAgICAgICB2YXIgbGV2ZWxEYXRhID0gd2luZG93LmFyYy5sZXZlbHNbd2luZG93LmFyYy5sZXZlbCAtIDFdO1xuXG4gICAgICAgIC8vIENyZWF0ZSBhaXJmaWVsZC5cbiAgICAgICAgd2luZG93LmFyYy5haXJmaWVsZCA9IG5ldyBBaXJmaWVsZCgpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBjcmF0ZXMuXG4gICAgICAgIHdpbmRvdy5hcmMuY3JhdGVzID0gW107XG4gICAgICAgIGNyYXRlcyA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdXRpbHMuaXRlcmF0ZShsZXZlbERhdGEuY3JhdGVzLCBmdW5jdGlvbihjcmF0ZURhdGEpIHtcbiAgICAgICAgICAgIHZhciBjcmF0ZSA9IG5ldyBDcmF0ZShjcmF0ZURhdGEpO1xuICAgICAgICAgICAgY3JhdGVzLmFkZChjcmF0ZSk7XG4gICAgICAgICAgICB3aW5kb3cuYXJjLmNyYXRlcy5wdXNoKGNyYXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHBsYXllci5cbiAgICAgICAgd2luZG93LmFyYy5wbGF5ZXIgPSBuZXcgUGxheWVyKHdpbmRvdy5hcmMuYWlyZmllbGQucG9zaXRpb24pO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBsYXllciA9IHdpbmRvdy5hcmMucGxheWVyO1xuICAgICAgICAvLyBBZGp1c3QgdGhlIHdpbmQgYWZmZWN0aW5nIHRoZSBwbGF5ZXIuXG4gICAgICAgIHdpbmQoKTtcblxuICAgICAgICAvLyBIYW5kbGUgY3JhdGUgYW5kIGFpcmZpZWxkIGNvbGxpc2lvbnMuXG5cbiAgICAgICAgLy8gSWYgcmVhZHkgdG8gY29sbGlkZSB3aXRoIHRoZSBhaXJmaWVsLlxuICAgICAgICBpZiAocGxheWVyLm1vZGVsLmNhcnJ5aW5nQ3JhdGUpIHtcblxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHJlYWR5IHRvIGNvbGxpZGUgd2l0aCBhIGNyZWF0ZVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBkaWRIaXQgPSB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUub3ZlcmxhcChwbGF5ZXIsIGNyYXRlcywgd2luZG93LmFyYy5wbGF5ZXIuY29sbGVjdENyYXRlLCBudWxsLCB0aGlzKTtcbiAgICAgICAgICAgIGlmICghZGlkSGl0ICYmICFwbGF5ZXIubW9kZWwuaXNGaXJzdENvbGxpZGUpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuZGlkTWlzcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXRlOyIsInZhciBnYW1lID0gd2luZG93LmFyYy5nYW1lO1xuXG52YXIgVEVYVF9USVRMRSA9IFwiQWlyc2hpcCBSZWNvdmVyeSBDby5cIjtcbnZhciBURVhUX1NUQVJUX0JVVFRPTiA9IFwiU3RhcnQgR2FtZVwiO1xudmFyIFRFWFRfSEVMUCA9IFwiKiBDb2xsZWN0IENyYXRlcyBsZWZ0IG9uIHRoZSBncm91bmQuXFxuXCIgK1xuICAgIFwiKiBSZXR1cm4gdGhlbSB0byB0aGUgQWlycGFkIHRvIGVhcm4gbW9uZXkuXFxuXCIgK1xuICAgIFwiKiBNYWludGFpbiBzdGFiaWxpdHkgb3ZlciBDcmF0ZXMgdG8gcGljayB0aGVtIHVwLlwiO1xuXG52YXIgaG93VG9QbGF5ID0gZnVuY3Rpb24oZ2FtZSkge1xuXG59O1xuXG5ob3dUb1BsYXkucHJvdG90eXBlID0ge1xuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIE1lbnUgbGFiZWxcbiAgICAgICAgdmFyIG1lbnVMYWJlbCA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC53aWR0aCAvIDIsIDEwMCwgVEVYVF9USVRMRSwgeyBmb250OiAnMzBweCBBcmlhbCcsIGZpbGw6ICcjZmZmJyB9KTtcbiAgICAgICAgbWVudUxhYmVsLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XG5cbiAgICAgICAgdmFyIGhlbHBUZXh0ID0gZ2FtZS5hZGQudGV4dCgyMDAsIDMwMCwgVEVYVF9IRUxQLCB7IGZvbnQ6ICcyMHB4IEFyaWFsJywgZmlsbDogJyNmZmYnIH0pO1xuICAgICAgICBoZWxwVGV4dC5hbmNob3Iuc2V0VG8oMCwgMC41KTtcblxuICAgICAgICB2YXIgc3RhcnRCdXR0b24gPSBuZXcgTGFiZWxCdXR0b24oXG4gICAgICAgICAgICBnYW1lLCBnYW1lLndvcmxkLndpZHRoIC8gMiwgZ2FtZS53b3JsZC5oZWlnaHQgLSAxMDAsXG4gICAgICAgICAgICBcImJ1dHRvbi1zdGFydFwiLFxuICAgICAgICAgICAgVEVYVF9TVEFSVF9CVVRUT04sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJmb250XCI6IFwiMThweCBBcmlhbFwiLFxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcImJsYWNrXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzLnN0YXJ0R2FtZSwgdGhpcywgMSwgMiwgMyk7XG4gICAgICAgIHN0YXJ0QnV0dG9uLmFuY2hvci5zZXQoMC41LCAwLjUpO1xuICAgICAgICBzdGFydEJ1dHRvbi5pbnB1dC51c2VIYW5kQ3Vyc29yID0gdHJ1ZTtcbiAgICB9LFxuICAgIHN0YXJ0R2FtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJHYW1lXCIpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaG93VG9QbGF5OyIsInZhciBnYW1lID0gd2luZG93LmFyYy5nYW1lO1xuXG52YXIgbG9hZCA9IGZ1bmN0aW9uKGdhbWUpIHtcblxufTtcblxubG9hZC5wcm90b3R5cGUgPSB7XG4gICAgcHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZShcImFpcnNoaXBcIiwgXCJhc3NldHMvaW1hZ2VzL2FpcnNoaXAucG5nXCIpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoXCJhaXJmaWVsZFwiLCBcImFzc2V0cy9pbWFnZXMvYWlyZmllbGQucG5nXCIpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoXCJjcmF0ZVwiLCBcImFzc2V0cy9pbWFnZXMvY3JhdGUucG5nXCIpO1xuXG4gICAgICAgIC8vIEJ1dHRvbiBiaXRtYXAgZGF0YS5cbiAgICAgICAgdmFyIGJ1dHRvbldpZHRoID0gNjAwO1xuICAgICAgICB2YXIgYnV0dG9uQm1kID0gZ2FtZS5hZGQuYml0bWFwRGF0YShidXR0b25XaWR0aCwgNDApO1xuICAgICAgICBidXR0b25CbWQuY3R4LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsUmVjdCgwLCAwLCBidXR0b25XaWR0aCAvIDQsIDQwKTtcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsU3R5bGUgPSAnI2ZmMDA5OSc7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFJlY3QoMTUwLCAwLCBidXR0b25XaWR0aCAvIDQsIDQwKTtcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsU3R5bGUgPSAnIzAwZmY5OSc7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFJlY3QoMzAwLCAwLCBidXR0b25XaWR0aCAvIDQsIDQwKTtcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsU3R5bGUgPSAnIzk5OTk5OSc7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFJlY3QoNDUwLCAwLCBidXR0b25XaWR0aCAvIDQsIDQwKTtcbiAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KFwiYnV0dG9uLXN0YXJ0XCIsIGJ1dHRvbkJtZC5jYW52YXMudG9EYXRhVVJMKCksIGJ1dHRvbldpZHRoIC8gNCwgNDApO1xuICAgIH0sXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBTZXQgdGhlIHN0YXJ0aW5nIGxldmVsLlxuICAgICAgICB3aW5kb3cuYXJjLmxldmVsID0gMTtcbiAgICAgICAgd2luZG93LmFyYy5sZXZlbHMgPSByZXF1aXJlKFwiLi4vbGV2ZWxzXCIpO1xuXG4gICAgICAgIGNyZWF0ZUxhYmVsQnV0dG9uKCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydChcIk1haW5NZW51XCIpO1xuICAgIH1cbn07XG5cbnZhciBjcmVhdGVMYWJlbEJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5MYWJlbEJ1dHRvbiA9IGZ1bmN0aW9uKGdhbWUsIHgsIHksIGtleSwgbGFiZWwsIGxhYmVsU3R5bGUsIGNhbGxiYWNrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tDb250ZXh0LCBvdmVyRnJhbWUsIG91dEZyYW1lLCBkb3duRnJhbWUsIHVwRnJhbWUpIHtcbiAgICAgICAgUGhhc2VyLkJ1dHRvbi5jYWxsKHRoaXMsIGdhbWUsIHgsIHksIGtleSwgY2FsbGJhY2ssXG4gICAgICAgICAgICBjYWxsYmFja0NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oIDAuNSwgMC41ICk7XG4gICAgICAgIHRoaXMubGFiZWwgPSBuZXcgUGhhc2VyLlRleHQoZ2FtZSwgMCwgMCwgbGFiZWwsIGxhYmVsU3R5bGUpO1xuXG4gICAgICAgIC8vcHV0cyB0aGUgbGFiZWwgaW4gdGhlIGNlbnRlciBvZiB0aGUgYnV0dG9uXG4gICAgICAgIHRoaXMubGFiZWwuYW5jaG9yLnNldFRvKCAwLjUsIDAuNSApO1xuXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5sYWJlbCk7XG4gICAgICAgIHRoaXMuc2V0TGFiZWwobGFiZWwpO1xuXG4gICAgICAgIC8vYWRkcyBidXR0b24gdG8gZ2FtZVxuICAgICAgICBnYW1lLmFkZC5leGlzdGluZyggdGhpcyApO1xuICAgIH07XG5cbiAgICBMYWJlbEJ1dHRvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5CdXR0b24ucHJvdG90eXBlKTtcbiAgICBMYWJlbEJ1dHRvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMYWJlbEJ1dHRvbjtcblxuICAgIExhYmVsQnV0dG9uLnByb3RvdHlwZS5zZXRMYWJlbCA9IGZ1bmN0aW9uKCBsYWJlbCApIHtcblxuICAgICAgICB0aGlzLmxhYmVsLnNldFRleHQobGFiZWwpO1xuXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2FkOyIsInZhciBnYW1lID0gd2luZG93LmFyYy5nYW1lO1xuXG52YXIgVEVYVF9USVRMRSA9IFwiQWlyc2hpcCBSZWNvdmVyeSBDby5cIjtcbnZhciBURVhUX1NUQVJUX0JVVFRPTiA9IFwiU3RhcnQgR2FtZVwiO1xudmFyIFRFWFRfSE9XX1RPX1BMQVkgPSBcIkhvdyBUbyBQbGF5XCI7XG5cbnZhciBzdGF0ZSA9IGZ1bmN0aW9uKCkge1xuXG59O1xuXG5zdGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gTWVudSBsYWJlbFxuICAgICAgICB2YXIgbWVudUxhYmVsID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLndpZHRoIC8gMiwgMTAwLCBURVhUX1RJVExFLCB7IGZvbnQ6ICczMHB4IEFyaWFsJywgZmlsbDogJyNmZmYnIH0pO1xuICAgICAgICBtZW51TGFiZWwuYW5jaG9yLnNldFRvKDAuNSwgMC41KTtcblxuICAgICAgICB2YXIgc3RhcnRCdXR0b24gPSBuZXcgTGFiZWxCdXR0b24oXG4gICAgICAgICAgICBnYW1lLCBnYW1lLndvcmxkLndpZHRoIC8gMiwgZ2FtZS53b3JsZC5oZWlnaHQgLzIsXG4gICAgICAgICAgICBcImJ1dHRvbi1zdGFydFwiLFxuICAgICAgICAgICAgVEVYVF9TVEFSVF9CVVRUT04sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJmb250XCI6IFwiMThweCBBcmlhbFwiLFxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcImJsYWNrXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzLnN0YXJ0R2FtZSwgdGhpcywgMSwgMiwgMyk7XG4gICAgICAgIHN0YXJ0QnV0dG9uLmFuY2hvci5zZXQoMC41LCAwLjUpO1xuICAgICAgICBzdGFydEJ1dHRvbi5pbnB1dC51c2VIYW5kQ3Vyc29yID0gdHJ1ZTtcblxuICAgICAgICB2YXIgaG93VG9QbGF5QnV0dG9uID0gbmV3IExhYmVsQnV0dG9uKFxuICAgICAgICAgICAgZ2FtZSwgZ2FtZS53b3JsZC53aWR0aCAvIDIsIGdhbWUud29ybGQuaGVpZ2h0IC8yICsgNzUsXG4gICAgICAgICAgICBcImJ1dHRvbi1zdGFydFwiLFxuICAgICAgICAgICAgVEVYVF9IT1dfVE9fUExBWSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImZvbnRcIjogXCIxOHB4IEFyaWFsXCIsXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwiYmxhY2tcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAsIHRoaXMsIDEsIDIsIDMpO1xuICAgICAgICBob3dUb1BsYXlCdXR0b24uYW5jaG9yLnNldCgwLjUsIDAuNSk7XG4gICAgICAgIGhvd1RvUGxheUJ1dHRvbi5pbnB1dC51c2VIYW5kQ3Vyc29yID0gdHJ1ZTtcbiAgICB9LFxuICAgIHN0YXJ0R2FtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJHYW1lXCIpO1xuICAgIH0sXG4gICAgc2hvd0hlbHA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KFwiSG93VG9QbGF5XCIpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhdGU7IiwidmFyIHNob3AgPSBmdW5jdGlvbihnYW1lKSB7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvcDsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRSYW5kUmFuZ2U6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xuICAgIH0sXG4gICAgaXRlcmF0ZTogZnVuY3Rpb24oYXJyLCBjYWxsYmFjaykge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhhcnJbaV0pO1xuICAgICAgICB9XG4gICAgfVxufTsiXX0=
