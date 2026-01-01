"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGameState = exports.defaultGameState = void 0;
exports.defaultGameState = {
    players: [],
    useFreeParking: true,
    freeParkingBalance: 0,
    open: true
};
const calculateGameState = (events, currentState) => {
    return events.reduce((state, event) => {
        switch (event.type) {
            case "playerJoin":
                return Object.assign(Object.assign({}, state), { players: [
                        ...state.players,
                        {
                            playerId: event.playerId,
                            name: event.name,
                            banker: false,
                            balance: 0,
                            connected: false
                        }
                    ] });
            case "playerDelete":
                return Object.assign(Object.assign({}, state), { players: state.players.filter((p) => p.playerId !== event.playerId) });
            case "playerNameChange":
                return Object.assign(Object.assign({}, state), { players: state.players.map((p) => p.playerId === event.playerId
                        ? Object.assign(Object.assign({}, p), { name: event.name }) : p) });
            case "playerBankerStatusChange":
                return Object.assign(Object.assign({}, state), { players: state.players.map((p) => p.playerId === event.playerId
                        ? Object.assign(Object.assign({}, p), { banker: event.isBanker }) : p) });
            case "transaction":
                if (event.from === "bank" || event.from === "freeParking") {
                    const destinationPlayer = state.players.find((p) => p.playerId === event.to);
                    if (destinationPlayer === undefined) {
                        throw new Error("Unable to find destination player");
                    }
                    return Object.assign(Object.assign({}, state), { players: [
                            ...state.players.filter((p) => p.playerId !== event.from && p.playerId !== event.to),
                            Object.assign(Object.assign({}, destinationPlayer), { balance: destinationPlayer.balance + event.amount })
                        ], freeParkingBalance: event.from === "freeParking"
                            ? state.freeParkingBalance - event.amount
                            : state.freeParkingBalance });
                }
                else if (event.to === "bank" || event.to === "freeParking") {
                    const sourcePlayer = state.players.find((p) => p.playerId === event.from);
                    if (sourcePlayer === undefined) {
                        throw new Error("Unable to find source player");
                    }
                    return Object.assign(Object.assign({}, state), { players: [
                            ...state.players.filter((p) => p.playerId !== event.from && p.playerId !== event.to),
                            Object.assign(Object.assign({}, sourcePlayer), { balance: sourcePlayer.balance - event.amount })
                        ], freeParkingBalance: event.to === "freeParking"
                            ? state.freeParkingBalance + event.amount
                            : state.freeParkingBalance });
                }
                else {
                    const sourcePlayer = state.players.find((p) => p.playerId === event.from);
                    const destinationPlayer = state.players.find((p) => p.playerId === event.to);
                    if (sourcePlayer === undefined || destinationPlayer === undefined) {
                        throw new Error("Unable to find source or destination player");
                    }
                    return Object.assign(Object.assign({}, state), { players: [
                            ...state.players.filter((p) => p.playerId !== event.from && p.playerId !== event.to),
                            Object.assign(Object.assign({}, sourcePlayer), { balance: sourcePlayer.balance - event.amount }),
                            Object.assign(Object.assign({}, destinationPlayer), { balance: destinationPlayer.balance + event.amount })
                        ] });
                }
            case "gameOpenStateChange":
                return Object.assign(Object.assign({}, state), { open: event.open });
            case "useFreeParkingChange":
                return Object.assign(Object.assign({}, state), { useFreeParking: event.useFreeParking });
            case "playerConnectionChange":
                return Object.assign(Object.assign({}, state), { players: [
                        ...state.players.filter((p) => p.playerId !== event.playerId),
                        Object.assign(Object.assign({}, state.players.find((p) => p.playerId === event.playerId)), { connected: event.connected })
                    ] });
        }
    }, currentState);
};
exports.calculateGameState = calculateGameState;
//# sourceMappingURL=state.js.map