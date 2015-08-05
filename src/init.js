// Initialise Phaser.
arc = {
    game: new Phaser.Game(800, 600, Phaser.AUTO, 'game')
};
var game = arc.game;

// Set up game states.
game.state.add("Load", require("./states/load"));
game.state.add("MainMenu", require("./states/mainmenu"));
game.state.add("HowToPlay", require("./states/howtoplay"));
game.state.add("Game", require("./states/game"));
game.state.add("Shop", require("./states/shop"));

// Initialise loading state.
game.state.start("Load");