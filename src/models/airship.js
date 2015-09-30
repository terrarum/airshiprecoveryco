var airship = {
    maxVelocity: 100,
    moveRate: 2,
    velocityTolerance: 15,
    collectTime: 4000,
    dropTime: 2000,
    carryingCrate: false,
    currentCrateId: null,
    hitTime: 0,
    isFirstCollide: true
};

module.exports = airship;