var _ = require("lodash");

var showBar = function(hitTime) {
    console.log("show");
    this.exists = true;
    this.hitTime = hitTime;
};

var progressUpdate = function(lastHitTime, completeTime) {
    var remaining = completeTime - Date.now();
    var percent = remaining / (completeTime - lastHitTime);
    if (percent < 0) percent = 0;

    this.width = this.originalWidth * percent;
};

var hideBar = function() {
    console.log("hide");
    this.exists = false;
};

var createProgressBar = function(options) {

    var game = window.arc.game;

    if (options == undefined) {
        options == {}
    }

    var defaults = {
        width: 100,
        height: 5,
        fillStyle: "#ffffff",
        exists: false
    }

    var o = _.merge(defaults, options);

    bmd = game.add.bitmapData(o.width, o.height);
    bmd.ctx.fillStyle = o.fillStyle;
    bmd.ctx.fillRect(0, 0, o.width, o.height)

    var bar = game.add.sprite(0, 0, bmd);
    bar.anchor.setTo(0.5, 0.5);
    bar.exists = o.exists;
    bar.originalWidth = o.width;

    bar.show = showBar;
    bar.hide = hideBar;
    bar.progressUpdate = progressUpdate;

    return bar;
};

module.exports = createProgressBar;