var game = arc.game;
var playerModel = require("../models/player");

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
        game.add.existing(this);
    };

    LabelButton.prototype = Object.create(Phaser.Button.prototype);
    LabelButton.prototype.constructor = LabelButton;

    LabelButton.prototype.setLabel = function( label ) {

        this.label.setText(label);

    };
};

var load = function(game) {

};

load.prototype = {
    preload: function() {
        // Load image assets.
        this.load.image("airship", "/assets/images/airship.png");
        this.load.image("airfield", "/assets/images/airfield.png");
        this.load.image("crate", "/assets/images/crate.png");
        this.load.image("directionindicator", "/assets/images/directionindicator.png");
        this.load.image("weathervane", "/assets/images/weathervane.png");

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

        // Load level data.
        this.load.text("levels", "/src/levels.json");
    },
    create: function() {

        // Set the starting level.
        arc.level = 1;
        arc.levels = JSON.parse(this.game.cache.getText("levels"));

        arc.wind = {
            x: 0,
            y: 0,
            max: 0
        };

        arc.playerData = playerModel;

        createLabelButton();

        this.state.start("MainMenu");
    }
};

module.exports = load;