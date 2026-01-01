import express from "express";
import gameStore from "../../gameStore";
import { ICreateGameRequest, IJoinGameRequest, IJoinGameResponse } from "../dto";

export const subRoute = "/api/game";

const router = express.Router();

// Create a new game
router.post("/", (req, res) => {
  const { name } = req.body as ICreateGameRequest;

  const { gameId, userToken, playerId } = gameStore.createGame(name);

  const response: IJoinGameResponse = { gameId, userToken, playerId };
  res.json(response);
  res.end();
});

// Join a game
router.post("/:gameId", (req, res) => {
  const { gameId } = req.params;
  const { name } = req.body as IJoinGameRequest;

  if (!gameStore.doesGameExist(gameId)) {
    res.status(404).send("El juego no existe");
  } else if (!gameStore.getGame(gameId).isGameOpen()) {
    res.status(403).send("El juego no está abierto");
  } else {
    const game = gameStore.getGame(gameId);
    const { userToken, playerId } = game.addPlayer(name);

    const response: IJoinGameResponse = { gameId, userToken, playerId };
    res.json(response);
  }

  res.end();
});

// Get game status
router.get("/:gameId", (req, res) => {
  const { gameId } = req.params;
  const userToken = req.get("Authorization");

  if (userToken === undefined) {
    res.status(401).send("Autorización no proporcionada");
  } else if (!gameStore.doesGameExist(gameId)) {
    res.status(404).send("El juego no existe");
  } else if (!gameStore.getGame(gameId).isUserInGame(userToken)) {
    res.status(401).send("No tienes permiso para realizar esta operación");
  } else {
    const game = gameStore.getGame(gameId);
    const state = game.getGameState();
    res.json(state);
  }

  res.end();
});

export default router;
