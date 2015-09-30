

module.exports = function() {
    return {
        weathervane: {
            name: "Weather Vane",
            description: "Shows the direction of the wind.",
            cost: 75,
            purchased: true,
            upgrades: {
                strength: {
                    name: "Wind Strength",
                    description: "Shows the strength as well the direction of the wind.",
                    cost: 50,
                    purchased: false
                }
            }
        }
    }
};