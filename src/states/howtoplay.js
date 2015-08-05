var game = arc.game;

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