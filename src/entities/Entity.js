/**
 * Generic Entity class. Extends Phaser.Sprite.
 */

var Entity = function(game, x, y, sprite, update){
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.anchor.setTo(0.5, 0.5);

    if (update !== undefined) {
        this.update = update;
    }
    game.add.existing(this);
};
Entity.prototype = Object.create(Phaser.Sprite.prototype);
Entity.prototype.constructor = Entity;

module.exports = Entity;