module.exports = {
    getRandRange: function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    },
    iterate: function(arr, callback) {
        for (var i = 0, len = arr.length; i < len; i++) {
            callback(arr[i]);
        }
    }
};