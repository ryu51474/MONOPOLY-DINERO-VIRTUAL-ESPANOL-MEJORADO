"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTime = exports.generateRandomId = exports.generateTimeBasedId = exports.createUniqueGameId = void 0;
const uuid_1 = require("uuid");
const createGameId = () => {
    const min = 100000;
    const max = 1000000;
    return `${Math.floor(Math.random() * (max - min + 1)) + min}`;
};
const createUniqueGameId = (existingGameIds) => {
    while (true) {
        const newGameId = createGameId();
        if (existingGameIds.indexOf(newGameId) === -1) {
            return newGameId;
        }
    }
};
exports.createUniqueGameId = createUniqueGameId;
const generateTimeBasedId = () => (0, uuid_1.v1)();
exports.generateTimeBasedId = generateTimeBasedId;
const generateRandomId = () => (0, uuid_1.v4)();
exports.generateRandomId = generateRandomId;
const getCurrentTime = () => new Date().toISOString();
exports.getCurrentTime = getCurrentTime;
//# sourceMappingURL=utils.js.map