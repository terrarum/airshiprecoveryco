(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require("../utils");
var Entity = require("./entity");

module.exports = function(game) {
    var game = window.arc.game;
    var x = utils.getRandRange(50, game.world.width - 50);
    var y = utils.getRandRange(100, game.world.height - 50);

    var Airfield = new Entity(new Phaser.Point(x, y), "airfield");

    return Airfield;
};
},{"../utils":11,"./entity":3}],2:[function(require,module,exports){
var utils = require("../utils");
var Entity = require("./entity");

// Generates X and Y coordinates for the crate. Will later need to account
// for Airfield position to ensure there are no overlaps.
var generateCratePosition = function() {
    var game = window.arc.game;
    var x = utils.getRandRange(50, game.world.width - 50);
    var y = utils.getRandRange(100, game.world.height - 50);

    return new Phaser.Point(x, y);
}

module.exports = function() {
    var update = function() {
        this.angle += 1;
    };

    var Crate = new Entity(generateCratePosition(), "crate", update);

    return Crate;
};
},{"../utils":11,"./entity":3}],3:[function(require,module,exports){
/**
 * Generic Entity class. Extends Phaser.Sprite.
 */

var Entity = function(position, spriteName, update){
    var game = window.arc.game;
    Phaser.Sprite.call(this, game, position.x, position.y, spriteName);
    this.anchor.setTo(0.5, 0.5);

    if (update !== undefined) {
        this.update = update;
    }
    game.add.existing(this);
};
Entity.prototype = Object.create(Phaser.Sprite.prototype);
Entity.prototype.constructor = Entity;

module.exports = Entity;
},{}],4:[function(require,module,exports){
var Entity = require("./entity");

module.exports = function(position) {
    var Player = new Entity(position, "airship");
    return Player;
};
},{"./entity":3}],5:[function(require,module,exports){
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
},{"./states/game":6,"./states/howtoplay":7,"./states/load":8,"./states/mainmenu":9,"./states/shop":10}],6:[function(require,module,exports){
var Player = require("../entities/player");
var Airfield = require("../entities/airfield");
var Crate = require("../entities/crate");

var state = function(game) {};
state.prototype = {
    create: function() {
        window.arc.airfield = new Airfield();
        window.arc.player = new Player(window.arc.airfield.position);
        window.arc.crates = new Crate();
    },
    update: function() {

    },
    render: function() {

    }
};

module.exports = state;
},{"../entities/airfield":1,"../entities/crate":2,"../entities/player":4}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
var shop = function(game) {

};

module.exports = shop;
},{}],11:[function(require,module,exports){
module.exports = {
    getRandRange: function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
};
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9lbnRpdGllcy9haXJmaWVsZC5qcyIsInNyYy9lbnRpdGllcy9jcmF0ZS5qcyIsInNyYy9lbnRpdGllcy9lbnRpdHkuanMiLCJzcmMvZW50aXRpZXMvcGxheWVyLmpzIiwic3JjL2luaXQuanMiLCJzcmMvc3RhdGVzL2dhbWUuanMiLCJzcmMvc3RhdGVzL2hvd3RvcGxheS5qcyIsInNyYy9zdGF0ZXMvbG9hZC5qcyIsInNyYy9zdGF0ZXMvbWFpbm1lbnUuanMiLCJzcmMvc3RhdGVzL3Nob3AuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xudmFyIEVudGl0eSA9IHJlcXVpcmUoXCIuL2VudGl0eVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihnYW1lKSB7XG4gICAgdmFyIGdhbWUgPSB3aW5kb3cuYXJjLmdhbWU7XG4gICAgdmFyIHggPSB1dGlscy5nZXRSYW5kUmFuZ2UoNTAsIGdhbWUud29ybGQud2lkdGggLSA1MCk7XG4gICAgdmFyIHkgPSB1dGlscy5nZXRSYW5kUmFuZ2UoMTAwLCBnYW1lLndvcmxkLmhlaWdodCAtIDUwKTtcblxuICAgIHZhciBBaXJmaWVsZCA9IG5ldyBFbnRpdHkobmV3IFBoYXNlci5Qb2ludCh4LCB5KSwgXCJhaXJmaWVsZFwiKTtcblxuICAgIHJldHVybiBBaXJmaWVsZDtcbn07IiwidmFyIHV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xudmFyIEVudGl0eSA9IHJlcXVpcmUoXCIuL2VudGl0eVwiKTtcblxuLy8gR2VuZXJhdGVzIFggYW5kIFkgY29vcmRpbmF0ZXMgZm9yIHRoZSBjcmF0ZS4gV2lsbCBsYXRlciBuZWVkIHRvIGFjY291bnRcbi8vIGZvciBBaXJmaWVsZCBwb3NpdGlvbiB0byBlbnN1cmUgdGhlcmUgYXJlIG5vIG92ZXJsYXBzLlxudmFyIGdlbmVyYXRlQ3JhdGVQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBnYW1lID0gd2luZG93LmFyYy5nYW1lO1xuICAgIHZhciB4ID0gdXRpbHMuZ2V0UmFuZFJhbmdlKDUwLCBnYW1lLndvcmxkLndpZHRoIC0gNTApO1xuICAgIHZhciB5ID0gdXRpbHMuZ2V0UmFuZFJhbmdlKDEwMCwgZ2FtZS53b3JsZC5oZWlnaHQgLSA1MCk7XG5cbiAgICByZXR1cm4gbmV3IFBoYXNlci5Qb2ludCh4LCB5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYW5nbGUgKz0gMTtcbiAgICB9O1xuXG4gICAgdmFyIENyYXRlID0gbmV3IEVudGl0eShnZW5lcmF0ZUNyYXRlUG9zaXRpb24oKSwgXCJjcmF0ZVwiLCB1cGRhdGUpO1xuXG4gICAgcmV0dXJuIENyYXRlO1xufTsiLCIvKipcbiAqIEdlbmVyaWMgRW50aXR5IGNsYXNzLiBFeHRlbmRzIFBoYXNlci5TcHJpdGUuXG4gKi9cblxudmFyIEVudGl0eSA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBzcHJpdGVOYW1lLCB1cGRhdGUpe1xuICAgIHZhciBnYW1lID0gd2luZG93LmFyYy5nYW1lO1xuICAgIFBoYXNlci5TcHJpdGUuY2FsbCh0aGlzLCBnYW1lLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55LCBzcHJpdGVOYW1lKTtcbiAgICB0aGlzLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XG5cbiAgICBpZiAodXBkYXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy51cGRhdGUgPSB1cGRhdGU7XG4gICAgfVxuICAgIGdhbWUuYWRkLmV4aXN0aW5nKHRoaXMpO1xufTtcbkVudGl0eS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TcHJpdGUucHJvdG90eXBlKTtcbkVudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBFbnRpdHk7XG5cbm1vZHVsZS5leHBvcnRzID0gRW50aXR5OyIsInZhciBFbnRpdHkgPSByZXF1aXJlKFwiLi9lbnRpdHlcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcbiAgICB2YXIgUGxheWVyID0gbmV3IEVudGl0eShwb3NpdGlvbiwgXCJhaXJzaGlwXCIpO1xuICAgIHJldHVybiBQbGF5ZXI7XG59OyIsIndpbmRvdy5hcmMgPSB7XG4gICAgZ2FtZTogbmV3IFBoYXNlci5HYW1lKDgwMCwgNjAwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKVxufTtcblxudmFyIGxvYWQgPSByZXF1aXJlKFwiLi9zdGF0ZXMvbG9hZFwiKTtcbnZhciBtYWluTWVudSA9IHJlcXVpcmUoXCIuL3N0YXRlcy9tYWlubWVudVwiKTtcbnZhciBob3dUb1BsYXkgPSByZXF1aXJlKFwiLi9zdGF0ZXMvaG93dG9wbGF5XCIpO1xudmFyIGdhbWVTdGF0ZSA9IHJlcXVpcmUoXCIuL3N0YXRlcy9nYW1lXCIpO1xudmFyIHNob3AgPSByZXF1aXJlKFwiLi9zdGF0ZXMvc2hvcFwiKTtcblxudmFyIGdhbWUgPSB3aW5kb3cuYXJjLmdhbWU7XG5cbmdhbWUuc3RhdGUuYWRkKFwiTG9hZFwiLCBsb2FkKTtcbmdhbWUuc3RhdGUuYWRkKFwiTWFpbk1lbnVcIiwgbWFpbk1lbnUpO1xuZ2FtZS5zdGF0ZS5hZGQoXCJIb3dUb1BsYXlcIiwgaG93VG9QbGF5KTtcbmdhbWUuc3RhdGUuYWRkKFwiR2FtZVwiLCBnYW1lU3RhdGUpO1xuZ2FtZS5zdGF0ZS5hZGQoXCJTaG9wXCIsIHNob3ApO1xuZ2FtZS5zdGF0ZS5zdGFydChcIkxvYWRcIik7IiwidmFyIFBsYXllciA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9wbGF5ZXJcIik7XG52YXIgQWlyZmllbGQgPSByZXF1aXJlKFwiLi4vZW50aXRpZXMvYWlyZmllbGRcIik7XG52YXIgQ3JhdGUgPSByZXF1aXJlKFwiLi4vZW50aXRpZXMvY3JhdGVcIik7XG5cbnZhciBzdGF0ZSA9IGZ1bmN0aW9uKGdhbWUpIHt9O1xuc3RhdGUucHJvdG90eXBlID0ge1xuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy5hcmMuYWlyZmllbGQgPSBuZXcgQWlyZmllbGQoKTtcbiAgICAgICAgd2luZG93LmFyYy5wbGF5ZXIgPSBuZXcgUGxheWVyKHdpbmRvdy5hcmMuYWlyZmllbGQucG9zaXRpb24pO1xuICAgICAgICB3aW5kb3cuYXJjLmNyYXRlcyA9IG5ldyBDcmF0ZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcblxuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhdGU7IiwidmFyIGdhbWUgPSB3aW5kb3cuYXJjLmdhbWU7XG5cbnZhciBURVhUX1RJVExFID0gXCJBaXJzaGlwIFJlY292ZXJ5IENvLlwiO1xudmFyIFRFWFRfU1RBUlRfQlVUVE9OID0gXCJTdGFydCBHYW1lXCI7XG52YXIgVEVYVF9IRUxQID0gXCIqIENvbGxlY3QgQ3JhdGVzIGxlZnQgb24gdGhlIGdyb3VuZC5cXG5cIiArXG4gICAgXCIqIFJldHVybiB0aGVtIHRvIHRoZSBBaXJwYWQgdG8gZWFybiBtb25leS5cXG5cIiArXG4gICAgXCIqIE1haW50YWluIHN0YWJpbGl0eSBvdmVyIENyYXRlcyB0byBwaWNrIHRoZW0gdXAuXCI7XG5cbnZhciBob3dUb1BsYXkgPSBmdW5jdGlvbihnYW1lKSB7XG5cbn07XG5cbmhvd1RvUGxheS5wcm90b3R5cGUgPSB7XG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gTWVudSBsYWJlbFxuICAgICAgICB2YXIgbWVudUxhYmVsID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLndpZHRoIC8gMiwgMTAwLCBURVhUX1RJVExFLCB7IGZvbnQ6ICczMHB4IEFyaWFsJywgZmlsbDogJyNmZmYnIH0pO1xuICAgICAgICBtZW51TGFiZWwuYW5jaG9yLnNldFRvKDAuNSwgMC41KTtcblxuICAgICAgICB2YXIgaGVscFRleHQgPSBnYW1lLmFkZC50ZXh0KDIwMCwgMzAwLCBURVhUX0hFTFAsIHsgZm9udDogJzIwcHggQXJpYWwnLCBmaWxsOiAnI2ZmZicgfSk7XG4gICAgICAgIGhlbHBUZXh0LmFuY2hvci5zZXRUbygwLCAwLjUpO1xuXG4gICAgICAgIHZhciBzdGFydEJ1dHRvbiA9IG5ldyBMYWJlbEJ1dHRvbihcbiAgICAgICAgICAgIGdhbWUsIGdhbWUud29ybGQud2lkdGggLyAyLCBnYW1lLndvcmxkLmhlaWdodCAtIDEwMCxcbiAgICAgICAgICAgIFwiYnV0dG9uLXN0YXJ0XCIsXG4gICAgICAgICAgICBURVhUX1NUQVJUX0JVVFRPTixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImZvbnRcIjogXCIxOHB4IEFyaWFsXCIsXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwiYmxhY2tcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRoaXMuc3RhcnRHYW1lLCB0aGlzLCAxLCAyLCAzKTtcbiAgICAgICAgc3RhcnRCdXR0b24uYW5jaG9yLnNldCgwLjUsIDAuNSk7XG4gICAgICAgIHN0YXJ0QnV0dG9uLmlucHV0LnVzZUhhbmRDdXJzb3IgPSB0cnVlO1xuICAgIH0sXG4gICAgc3RhcnRHYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydChcIkdhbWVcIik7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBob3dUb1BsYXk7IiwidmFyIGdhbWUgPSB3aW5kb3cuYXJjLmdhbWU7XG5cbnZhciBsb2FkID0gZnVuY3Rpb24oZ2FtZSkge1xuXG59O1xuXG5sb2FkLnByb3RvdHlwZSA9IHtcbiAgICBwcmVsb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKFwiYWlyc2hpcFwiLCBcImFzc2V0cy9pbWFnZXMvYWlyc2hpcC5wbmdcIik7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZShcImFpcmZpZWxkXCIsIFwiYXNzZXRzL2ltYWdlcy9haXJmaWVsZC5wbmdcIik7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZShcImNyYXRlXCIsIFwiYXNzZXRzL2ltYWdlcy9jcmF0ZS5wbmdcIik7XG5cbiAgICAgICAgLy8gQnV0dG9uIGJpdG1hcCBkYXRhLlxuICAgICAgICB2YXIgYnV0dG9uV2lkdGggPSA2MDA7XG4gICAgICAgIHZhciBidXR0b25CbWQgPSBnYW1lLmFkZC5iaXRtYXBEYXRhKGJ1dHRvbldpZHRoLCA0MCk7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xuICAgICAgICBidXR0b25CbWQuY3R4LmZpbGxSZWN0KDAsIDAsIGJ1dHRvbldpZHRoIC8gNCwgNDApO1xuICAgICAgICBidXR0b25CbWQuY3R4LmZpbGxTdHlsZSA9ICcjZmYwMDk5JztcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsUmVjdCgxNTAsIDAsIGJ1dHRvbldpZHRoIC8gNCwgNDApO1xuICAgICAgICBidXR0b25CbWQuY3R4LmZpbGxTdHlsZSA9ICcjMDBmZjk5JztcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsUmVjdCgzMDAsIDAsIGJ1dHRvbldpZHRoIC8gNCwgNDApO1xuICAgICAgICBidXR0b25CbWQuY3R4LmZpbGxTdHlsZSA9ICcjOTk5OTk5JztcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsUmVjdCg0NTAsIDAsIGJ1dHRvbldpZHRoIC8gNCwgNDApO1xuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoXCJidXR0b24tc3RhcnRcIiwgYnV0dG9uQm1kLmNhbnZhcy50b0RhdGFVUkwoKSwgYnV0dG9uV2lkdGggLyA0LCA0MCk7XG4gICAgfSxcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGNyZWF0ZUxhYmVsQnV0dG9uKCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydChcIk1haW5NZW51XCIpO1xuICAgIH1cbn07XG5cbnZhciBjcmVhdGVMYWJlbEJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5MYWJlbEJ1dHRvbiA9IGZ1bmN0aW9uKGdhbWUsIHgsIHksIGtleSwgbGFiZWwsIGxhYmVsU3R5bGUsIGNhbGxiYWNrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tDb250ZXh0LCBvdmVyRnJhbWUsIG91dEZyYW1lLCBkb3duRnJhbWUsIHVwRnJhbWUpIHtcbiAgICAgICAgUGhhc2VyLkJ1dHRvbi5jYWxsKHRoaXMsIGdhbWUsIHgsIHksIGtleSwgY2FsbGJhY2ssXG4gICAgICAgICAgICBjYWxsYmFja0NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oIDAuNSwgMC41ICk7XG4gICAgICAgIHRoaXMubGFiZWwgPSBuZXcgUGhhc2VyLlRleHQoZ2FtZSwgMCwgMCwgbGFiZWwsIGxhYmVsU3R5bGUpO1xuXG4gICAgICAgIC8vcHV0cyB0aGUgbGFiZWwgaW4gdGhlIGNlbnRlciBvZiB0aGUgYnV0dG9uXG4gICAgICAgIHRoaXMubGFiZWwuYW5jaG9yLnNldFRvKCAwLjUsIDAuNSApO1xuXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5sYWJlbCk7XG4gICAgICAgIHRoaXMuc2V0TGFiZWwobGFiZWwpO1xuXG4gICAgICAgIC8vYWRkcyBidXR0b24gdG8gZ2FtZVxuICAgICAgICBnYW1lLmFkZC5leGlzdGluZyggdGhpcyApO1xuICAgIH07XG5cbiAgICBMYWJlbEJ1dHRvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5CdXR0b24ucHJvdG90eXBlKTtcbiAgICBMYWJlbEJ1dHRvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMYWJlbEJ1dHRvbjtcblxuICAgIExhYmVsQnV0dG9uLnByb3RvdHlwZS5zZXRMYWJlbCA9IGZ1bmN0aW9uKCBsYWJlbCApIHtcblxuICAgICAgICB0aGlzLmxhYmVsLnNldFRleHQobGFiZWwpO1xuXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2FkOyIsInZhciBnYW1lID0gd2luZG93LmFyYy5nYW1lO1xuXG52YXIgVEVYVF9USVRMRSA9IFwiQWlyc2hpcCBSZWNvdmVyeSBDby5cIjtcbnZhciBURVhUX1NUQVJUX0JVVFRPTiA9IFwiU3RhcnQgR2FtZVwiO1xudmFyIFRFWFRfSE9XX1RPX1BMQVkgPSBcIkhvdyBUbyBQbGF5XCI7XG5cbnZhciBzdGF0ZSA9IGZ1bmN0aW9uKCkge1xuXG59O1xuXG5zdGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gTWVudSBsYWJlbFxuICAgICAgICB2YXIgbWVudUxhYmVsID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLndpZHRoIC8gMiwgMTAwLCBURVhUX1RJVExFLCB7IGZvbnQ6ICczMHB4IEFyaWFsJywgZmlsbDogJyNmZmYnIH0pO1xuICAgICAgICBtZW51TGFiZWwuYW5jaG9yLnNldFRvKDAuNSwgMC41KTtcblxuICAgICAgICB2YXIgc3RhcnRCdXR0b24gPSBuZXcgTGFiZWxCdXR0b24oXG4gICAgICAgICAgICBnYW1lLCBnYW1lLndvcmxkLndpZHRoIC8gMiwgZ2FtZS53b3JsZC5oZWlnaHQgLzIsXG4gICAgICAgICAgICBcImJ1dHRvbi1zdGFydFwiLFxuICAgICAgICAgICAgVEVYVF9TVEFSVF9CVVRUT04sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJmb250XCI6IFwiMThweCBBcmlhbFwiLFxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcImJsYWNrXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzLnN0YXJ0R2FtZSwgdGhpcywgMSwgMiwgMyk7XG4gICAgICAgIHN0YXJ0QnV0dG9uLmFuY2hvci5zZXQoMC41LCAwLjUpO1xuICAgICAgICBzdGFydEJ1dHRvbi5pbnB1dC51c2VIYW5kQ3Vyc29yID0gdHJ1ZTtcblxuICAgICAgICB2YXIgaG93VG9QbGF5QnV0dG9uID0gbmV3IExhYmVsQnV0dG9uKFxuICAgICAgICAgICAgZ2FtZSwgZ2FtZS53b3JsZC53aWR0aCAvIDIsIGdhbWUud29ybGQuaGVpZ2h0IC8yICsgNzUsXG4gICAgICAgICAgICBcImJ1dHRvbi1zdGFydFwiLFxuICAgICAgICAgICAgVEVYVF9IT1dfVE9fUExBWSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImZvbnRcIjogXCIxOHB4IEFyaWFsXCIsXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwiYmxhY2tcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAsIHRoaXMsIDEsIDIsIDMpO1xuICAgICAgICBob3dUb1BsYXlCdXR0b24uYW5jaG9yLnNldCgwLjUsIDAuNSk7XG4gICAgICAgIGhvd1RvUGxheUJ1dHRvbi5pbnB1dC51c2VIYW5kQ3Vyc29yID0gdHJ1ZTtcbiAgICB9LFxuICAgIHN0YXJ0R2FtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJHYW1lXCIpO1xuICAgIH0sXG4gICAgc2hvd0hlbHA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KFwiSG93VG9QbGF5XCIpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhdGU7IiwidmFyIHNob3AgPSBmdW5jdGlvbihnYW1lKSB7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvcDsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRSYW5kUmFuZ2U6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xuICAgIH1cbn07Il19
