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