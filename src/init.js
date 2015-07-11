var $ = require("../bower_components/jquery/dist/jquery");
window.$ = $;

// When the DOM is ready, launch the game.
$(function() {
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
});