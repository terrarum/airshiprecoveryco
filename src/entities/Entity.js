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