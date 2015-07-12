(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require("../utils");
var Entity = require("./entity");

module.exports = function(game) {
    var x = utils.getRandRange(50, game.world.width - 50);
    var y = utils.getRandRange(100, game.world.height - 50);

    var update = function() {
        this.angle += 1;
    };

    var Airfield = new Entity(game, x, y, "airfield", update);

    return Airfield;
};
},{"../utils":11,"./entity":3}],2:[function(require,module,exports){
module.exports = {
    create: function() {

    },
    update: function() {

    }
}
},{}],3:[function(require,module,exports){
/**
 * Generic Entity class. Extends Phaser.Sprite.
 */

var Entity = function(game, x, y, sprite, update){
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.anchor.setTo(0.5, 0.5);
    console.log("Update:", update);
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

module.exports = function(game, position) {

    var update = function() {
        this.angle -= 1;
    };
    var Player = new Entity(game, position.x, position.y, "airship", update);
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
        window.arc.airfield = new Airfield(this.game);
        window.arc.player = new Player(this.game, window.arc.airfield.position);
        //window.arc.crate = new Crate(this.game);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9lbnRpdGllcy9haXJmaWVsZC5qcyIsInNyYy9lbnRpdGllcy9jcmF0ZS5qcyIsInNyYy9lbnRpdGllcy9lbnRpdHkuanMiLCJzcmMvZW50aXRpZXMvcGxheWVyLmpzIiwic3JjL2luaXQuanMiLCJzcmMvc3RhdGVzL2dhbWUuanMiLCJzcmMvc3RhdGVzL2hvd3RvcGxheS5qcyIsInNyYy9zdGF0ZXMvbG9hZC5qcyIsInNyYy9zdGF0ZXMvbWFpbm1lbnUuanMiLCJzcmMvc3RhdGVzL3Nob3AuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbnZhciBFbnRpdHkgPSByZXF1aXJlKFwiLi9lbnRpdHlcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZ2FtZSkge1xuICAgIHZhciB4ID0gdXRpbHMuZ2V0UmFuZFJhbmdlKDUwLCBnYW1lLndvcmxkLndpZHRoIC0gNTApO1xuICAgIHZhciB5ID0gdXRpbHMuZ2V0UmFuZFJhbmdlKDEwMCwgZ2FtZS53b3JsZC5oZWlnaHQgLSA1MCk7XG5cbiAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYW5nbGUgKz0gMTtcbiAgICB9O1xuXG4gICAgdmFyIEFpcmZpZWxkID0gbmV3IEVudGl0eShnYW1lLCB4LCB5LCBcImFpcmZpZWxkXCIsIHVwZGF0ZSk7XG5cbiAgICByZXR1cm4gQWlyZmllbGQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICB9XG59IiwiLyoqXG4gKiBHZW5lcmljIEVudGl0eSBjbGFzcy4gRXh0ZW5kcyBQaGFzZXIuU3ByaXRlLlxuICovXG5cbnZhciBFbnRpdHkgPSBmdW5jdGlvbihnYW1lLCB4LCB5LCBzcHJpdGUsIHVwZGF0ZSl7XG4gICAgUGhhc2VyLlNwcml0ZS5jYWxsKHRoaXMsIGdhbWUsIHgsIHksIHNwcml0ZSk7XG4gICAgdGhpcy5hbmNob3Iuc2V0VG8oMC41LCAwLjUpO1xuICAgIGNvbnNvbGUubG9nKFwiVXBkYXRlOlwiLCB1cGRhdGUpO1xuICAgIGlmICh1cGRhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcbiAgICB9XG4gICAgZ2FtZS5hZGQuZXhpc3RpbmcodGhpcyk7XG59O1xuRW50aXR5LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUGhhc2VyLlNwcml0ZS5wcm90b3R5cGUpO1xuRW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEVudGl0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7IiwidmFyIEVudGl0eSA9IHJlcXVpcmUoXCIuL2VudGl0eVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihnYW1lLCBwb3NpdGlvbikge1xuXG4gICAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmFuZ2xlIC09IDE7XG4gICAgfTtcbiAgICB2YXIgUGxheWVyID0gbmV3IEVudGl0eShnYW1lLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55LCBcImFpcnNoaXBcIiwgdXBkYXRlKTtcbiAgICByZXR1cm4gUGxheWVyO1xufTsiLCJ3aW5kb3cuYXJjID0ge1xuICAgIGdhbWU6IG5ldyBQaGFzZXIuR2FtZSg4MDAsIDYwMCwgUGhhc2VyLkFVVE8sICdnYW1lJylcbn07XG5cbnZhciBsb2FkID0gcmVxdWlyZShcIi4vc3RhdGVzL2xvYWRcIik7XG52YXIgbWFpbk1lbnUgPSByZXF1aXJlKFwiLi9zdGF0ZXMvbWFpbm1lbnVcIik7XG52YXIgaG93VG9QbGF5ID0gcmVxdWlyZShcIi4vc3RhdGVzL2hvd3RvcGxheVwiKTtcbnZhciBnYW1lU3RhdGUgPSByZXF1aXJlKFwiLi9zdGF0ZXMvZ2FtZVwiKTtcbnZhciBzaG9wID0gcmVxdWlyZShcIi4vc3RhdGVzL3Nob3BcIik7XG5cbnZhciBnYW1lID0gd2luZG93LmFyYy5nYW1lO1xuXG5nYW1lLnN0YXRlLmFkZChcIkxvYWRcIiwgbG9hZCk7XG5nYW1lLnN0YXRlLmFkZChcIk1haW5NZW51XCIsIG1haW5NZW51KTtcbmdhbWUuc3RhdGUuYWRkKFwiSG93VG9QbGF5XCIsIGhvd1RvUGxheSk7XG5nYW1lLnN0YXRlLmFkZChcIkdhbWVcIiwgZ2FtZVN0YXRlKTtcbmdhbWUuc3RhdGUuYWRkKFwiU2hvcFwiLCBzaG9wKTtcbmdhbWUuc3RhdGUuc3RhcnQoXCJMb2FkXCIpOyIsInZhciBQbGF5ZXIgPSByZXF1aXJlKFwiLi4vZW50aXRpZXMvcGxheWVyXCIpO1xudmFyIEFpcmZpZWxkID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL2FpcmZpZWxkXCIpO1xudmFyIENyYXRlID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL2NyYXRlXCIpO1xuXG52YXIgc3RhdGUgPSBmdW5jdGlvbihnYW1lKSB7fTtcbnN0YXRlLnByb3RvdHlwZSA9IHtcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3cuYXJjLmFpcmZpZWxkID0gbmV3IEFpcmZpZWxkKHRoaXMuZ2FtZSk7XG4gICAgICAgIHdpbmRvdy5hcmMucGxheWVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIHdpbmRvdy5hcmMuYWlyZmllbGQucG9zaXRpb24pO1xuICAgICAgICAvL3dpbmRvdy5hcmMuY3JhdGUgPSBuZXcgQ3JhdGUodGhpcy5nYW1lKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXRlOyIsInZhciBnYW1lID0gd2luZG93LmFyYy5nYW1lO1xuXG52YXIgVEVYVF9USVRMRSA9IFwiQWlyc2hpcCBSZWNvdmVyeSBDby5cIjtcbnZhciBURVhUX1NUQVJUX0JVVFRPTiA9IFwiU3RhcnQgR2FtZVwiO1xudmFyIFRFWFRfSEVMUCA9IFwiKiBDb2xsZWN0IENyYXRlcyBsZWZ0IG9uIHRoZSBncm91bmQuXFxuXCIgK1xuICAgIFwiKiBSZXR1cm4gdGhlbSB0byB0aGUgQWlycGFkIHRvIGVhcm4gbW9uZXkuXFxuXCIgK1xuICAgIFwiKiBNYWludGFpbiBzdGFiaWxpdHkgb3ZlciBDcmF0ZXMgdG8gcGljayB0aGVtIHVwLlwiO1xuXG52YXIgaG93VG9QbGF5ID0gZnVuY3Rpb24oZ2FtZSkge1xuXG59O1xuXG5ob3dUb1BsYXkucHJvdG90eXBlID0ge1xuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIE1lbnUgbGFiZWxcbiAgICAgICAgdmFyIG1lbnVMYWJlbCA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC53aWR0aCAvIDIsIDEwMCwgVEVYVF9USVRMRSwgeyBmb250OiAnMzBweCBBcmlhbCcsIGZpbGw6ICcjZmZmJyB9KTtcbiAgICAgICAgbWVudUxhYmVsLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XG5cbiAgICAgICAgdmFyIGhlbHBUZXh0ID0gZ2FtZS5hZGQudGV4dCgyMDAsIDMwMCwgVEVYVF9IRUxQLCB7IGZvbnQ6ICcyMHB4IEFyaWFsJywgZmlsbDogJyNmZmYnIH0pO1xuICAgICAgICBoZWxwVGV4dC5hbmNob3Iuc2V0VG8oMCwgMC41KTtcblxuICAgICAgICB2YXIgc3RhcnRCdXR0b24gPSBuZXcgTGFiZWxCdXR0b24oXG4gICAgICAgICAgICBnYW1lLCBnYW1lLndvcmxkLndpZHRoIC8gMiwgZ2FtZS53b3JsZC5oZWlnaHQgLSAxMDAsXG4gICAgICAgICAgICBcImJ1dHRvbi1zdGFydFwiLFxuICAgICAgICAgICAgVEVYVF9TVEFSVF9CVVRUT04sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJmb250XCI6IFwiMThweCBBcmlhbFwiLFxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcImJsYWNrXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzLnN0YXJ0R2FtZSwgdGhpcywgMSwgMiwgMyk7XG4gICAgICAgIHN0YXJ0QnV0dG9uLmFuY2hvci5zZXQoMC41LCAwLjUpO1xuICAgICAgICBzdGFydEJ1dHRvbi5pbnB1dC51c2VIYW5kQ3Vyc29yID0gdHJ1ZTtcbiAgICB9LFxuICAgIHN0YXJ0R2FtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJHYW1lXCIpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaG93VG9QbGF5OyIsInZhciBnYW1lID0gd2luZG93LmFyYy5nYW1lO1xuXG52YXIgbG9hZCA9IGZ1bmN0aW9uKGdhbWUpIHtcblxufTtcblxubG9hZC5wcm90b3R5cGUgPSB7XG4gICAgcHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZShcImFpcnNoaXBcIiwgXCJhc3NldHMvaW1hZ2VzL2FpcnNoaXAucG5nXCIpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoXCJhaXJmaWVsZFwiLCBcImFzc2V0cy9pbWFnZXMvYWlyZmllbGQucG5nXCIpO1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoXCJjcmF0ZVwiLCBcImFzc2V0cy9pbWFnZXMvY3JhdGUucG5nXCIpO1xuXG4gICAgICAgIC8vIEJ1dHRvbiBiaXRtYXAgZGF0YS5cbiAgICAgICAgdmFyIGJ1dHRvbldpZHRoID0gNjAwO1xuICAgICAgICB2YXIgYnV0dG9uQm1kID0gZ2FtZS5hZGQuYml0bWFwRGF0YShidXR0b25XaWR0aCwgNDApO1xuICAgICAgICBidXR0b25CbWQuY3R4LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsUmVjdCgwLCAwLCBidXR0b25XaWR0aCAvIDQsIDQwKTtcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsU3R5bGUgPSAnI2ZmMDA5OSc7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFJlY3QoMTUwLCAwLCBidXR0b25XaWR0aCAvIDQsIDQwKTtcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsU3R5bGUgPSAnIzAwZmY5OSc7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFJlY3QoMzAwLCAwLCBidXR0b25XaWR0aCAvIDQsIDQwKTtcbiAgICAgICAgYnV0dG9uQm1kLmN0eC5maWxsU3R5bGUgPSAnIzk5OTk5OSc7XG4gICAgICAgIGJ1dHRvbkJtZC5jdHguZmlsbFJlY3QoNDUwLCAwLCBidXR0b25XaWR0aCAvIDQsIDQwKTtcbiAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KFwiYnV0dG9uLXN0YXJ0XCIsIGJ1dHRvbkJtZC5jYW52YXMudG9EYXRhVVJMKCksIGJ1dHRvbldpZHRoIC8gNCwgNDApO1xuICAgIH0sXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICBjcmVhdGVMYWJlbEJ1dHRvbigpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJNYWluTWVudVwiKTtcbiAgICB9XG59O1xuXG52YXIgY3JlYXRlTGFiZWxCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cuTGFiZWxCdXR0b24gPSBmdW5jdGlvbihnYW1lLCB4LCB5LCBrZXksIGxhYmVsLCBsYWJlbFN0eWxlLCBjYWxsYmFjayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrQ29udGV4dCwgb3ZlckZyYW1lLCBvdXRGcmFtZSwgZG93bkZyYW1lLCB1cEZyYW1lKSB7XG4gICAgICAgIFBoYXNlci5CdXR0b24uY2FsbCh0aGlzLCBnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLFxuICAgICAgICAgICAgY2FsbGJhY2tDb250ZXh0LCBvdmVyRnJhbWUsIG91dEZyYW1lLCBkb3duRnJhbWUsIHVwRnJhbWUpO1xuXG4gICAgICAgIHRoaXMuYW5jaG9yLnNldFRvKCAwLjUsIDAuNSApO1xuICAgICAgICB0aGlzLmxhYmVsID0gbmV3IFBoYXNlci5UZXh0KGdhbWUsIDAsIDAsIGxhYmVsLCBsYWJlbFN0eWxlKTtcblxuICAgICAgICAvL3B1dHMgdGhlIGxhYmVsIGluIHRoZSBjZW50ZXIgb2YgdGhlIGJ1dHRvblxuICAgICAgICB0aGlzLmxhYmVsLmFuY2hvci5zZXRUbyggMC41LCAwLjUgKTtcblxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubGFiZWwpO1xuICAgICAgICB0aGlzLnNldExhYmVsKGxhYmVsKTtcblxuICAgICAgICAvL2FkZHMgYnV0dG9uIHRvIGdhbWVcbiAgICAgICAgZ2FtZS5hZGQuZXhpc3RpbmcoIHRoaXMgKTtcbiAgICB9O1xuXG4gICAgTGFiZWxCdXR0b24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuQnV0dG9uLnByb3RvdHlwZSk7XG4gICAgTGFiZWxCdXR0b24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGFiZWxCdXR0b247XG5cbiAgICBMYWJlbEJ1dHRvbi5wcm90b3R5cGUuc2V0TGFiZWwgPSBmdW5jdGlvbiggbGFiZWwgKSB7XG5cbiAgICAgICAgdGhpcy5sYWJlbC5zZXRUZXh0KGxhYmVsKTtcblxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbG9hZDsiLCJ2YXIgZ2FtZSA9IHdpbmRvdy5hcmMuZ2FtZTtcblxudmFyIFRFWFRfVElUTEUgPSBcIkFpcnNoaXAgUmVjb3ZlcnkgQ28uXCI7XG52YXIgVEVYVF9TVEFSVF9CVVRUT04gPSBcIlN0YXJ0IEdhbWVcIjtcbnZhciBURVhUX0hPV19UT19QTEFZID0gXCJIb3cgVG8gUGxheVwiO1xuXG52YXIgc3RhdGUgPSBmdW5jdGlvbigpIHtcblxufTtcblxuc3RhdGUucHJvdG90eXBlID0ge1xuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIE1lbnUgbGFiZWxcbiAgICAgICAgdmFyIG1lbnVMYWJlbCA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC53aWR0aCAvIDIsIDEwMCwgVEVYVF9USVRMRSwgeyBmb250OiAnMzBweCBBcmlhbCcsIGZpbGw6ICcjZmZmJyB9KTtcbiAgICAgICAgbWVudUxhYmVsLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XG5cbiAgICAgICAgdmFyIHN0YXJ0QnV0dG9uID0gbmV3IExhYmVsQnV0dG9uKFxuICAgICAgICAgICAgZ2FtZSwgZ2FtZS53b3JsZC53aWR0aCAvIDIsIGdhbWUud29ybGQuaGVpZ2h0IC8yLFxuICAgICAgICAgICAgXCJidXR0b24tc3RhcnRcIixcbiAgICAgICAgICAgIFRFWFRfU1RBUlRfQlVUVE9OLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiZm9udFwiOiBcIjE4cHggQXJpYWxcIixcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJibGFja1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpcy5zdGFydEdhbWUsIHRoaXMsIDEsIDIsIDMpO1xuICAgICAgICBzdGFydEJ1dHRvbi5hbmNob3Iuc2V0KDAuNSwgMC41KTtcbiAgICAgICAgc3RhcnRCdXR0b24uaW5wdXQudXNlSGFuZEN1cnNvciA9IHRydWU7XG5cbiAgICAgICAgdmFyIGhvd1RvUGxheUJ1dHRvbiA9IG5ldyBMYWJlbEJ1dHRvbihcbiAgICAgICAgICAgIGdhbWUsIGdhbWUud29ybGQud2lkdGggLyAyLCBnYW1lLndvcmxkLmhlaWdodCAvMiArIDc1LFxuICAgICAgICAgICAgXCJidXR0b24tc3RhcnRcIixcbiAgICAgICAgICAgIFRFWFRfSE9XX1RPX1BMQVksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJmb250XCI6IFwiMThweCBBcmlhbFwiLFxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcImJsYWNrXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzLnNob3dIZWxwLCB0aGlzLCAxLCAyLCAzKTtcbiAgICAgICAgaG93VG9QbGF5QnV0dG9uLmFuY2hvci5zZXQoMC41LCAwLjUpO1xuICAgICAgICBob3dUb1BsYXlCdXR0b24uaW5wdXQudXNlSGFuZEN1cnNvciA9IHRydWU7XG4gICAgfSxcbiAgICBzdGFydEdhbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KFwiR2FtZVwiKTtcbiAgICB9LFxuICAgIHNob3dIZWxwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydChcIkhvd1RvUGxheVwiKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXRlOyIsInZhciBzaG9wID0gZnVuY3Rpb24oZ2FtZSkge1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3A7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0UmFuZFJhbmdlOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcbiAgICB9XG59OyJdfQ==
