var game = window.arc.game;

var TEXT_TITLE = "Airship Recovery Co.";
var TEXT_START_BUTTON = "Start Game";
var TEXT_HOW_TO_PLAY = "How To Play";

var mainmenu = function(game) {

};

mainmenu.prototype = {
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

module.exports = mainmenu;