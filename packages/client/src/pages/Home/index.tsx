import { navigate } from "hookrouter";
import { DateTime } from "luxon";
import React from "react";
import { Badge, Button, Card } from "react-bootstrap";
import useStoredGames from "../../hooks/useStoredGames";
import bannerImage from "../../img/banner.png";
import Screenshot1Image from "../../img/screenshots/screenshot-1.png";
import Screenshot2Image from "../../img/screenshots/screenshot-2.png";
import Screenshot3Image from "../../img/screenshots/screenshot-3.png";
import Screenshot4Image from "../../img/screenshots/screenshot-4.png";
import { formatCurrency } from "../../utils";
import "./Home.scss";

interface IHomeProps {
  onGameSetup: (gameId: string, userToken: string, playerId: string) => void;
}

const Home: React.FC<IHomeProps> = ({ onGameSetup }) => {
  const { storedGames } = useStoredGames();

  const newGame = () => navigate("/new-game");
  const joinGame = () => navigate("/join");

  return (
    <div className="home text-center">
      <h1 className="sr-only">Monopoly Money</h1>
      <img src={bannerImage} className="banner" alt="Monopoly Money Banner" />

      <p className="lead mt-2">
        Una forma fácil de gestionar las finanzas en tu partida de Monopoly desde el navegador.
      </p>

      <div className="new-join-button-wrapper mt-4">
        <Button size="lg" onClick={newGame}>
          Nuevo Juego
        </Button>
        <Button size="lg" onClick={joinGame}>
          Unirse al Juego
        </Button>
      </div>

      <div className="mt-4">
        <h2>Tus Juegos Activos</h2>
        {storedGames.length > 0 ? (
          <div className="active-game-cards">
            {storedGames
              .sort((a, b) => (a.time > b.time ? -1 : 1))
              .map(({ gameId, userToken, playerId, status, time }) => (
                <Card key={gameId} className="mb-1">
                  <Card.Body className="p-2">
                    <div className="text-left">
                      Juego {gameId}
                      <small style={{ float: "right" }}>
                        {DateTime.fromISO(time).toFormat("DD h:mm a")}
                      </small>
                    </div>
                    <div>
                      {status?.players
                        .sort((p1, _) => (p1.playerId === playerId ? -1 : 0))
                        .map((player) => (
                          <Badge
                            key={player.playerId}
                            variant={
                              player.playerId === playerId
                                ? "dark"
                                : player.banker
                                ? "info"
                                : "success"
                            }
                            className="mr-1"
                          >
                            {player.name}: {formatCurrency(player.balance)}
                          </Badge>
                        ))}
                      {status !== null && status.useFreeParking && (
                        <Badge variant="warning">
                          Estacionamiento Libre: {formatCurrency(status.freeParkingBalance)}
                        </Badge>
                      )}
                    </div>
                    <Button
                      block
                      size="sm"
                      variant="outline-primary"
                      onClick={() => onGameSetup(gameId, userToken, playerId)}
                      className="mt-2"
                    >
                      Unirse al Juego
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ) : (
          <div>No tienes juegos activos</div>
        )}
      </div>

      <hr />

      <div>
        <h2>¿Qué es Monopoly Money?</h2>
        <p>
          Monopoly Money es una aplicación web que te ayuda a llevar un control de tus finanzas en una partida de Monopoly
          (o cualquier juego que use moneda).
        </p>
        <p>
          En lugar de usar el efectivo que comúnmente viene con el juego, puedes jugar Monopoly como
          si estuvieras jugando la edición de tarjeta de crédito, pero con tu teléfono - una forma mucho más rápida de
          intercambiar dinero.
        </p>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gridGap: 6 }}
          className="mt-5"
        >
          <img src={Screenshot1Image} alt="Página de fondos con ID de juego" className="w-100" />
          <img src={Screenshot2Image} alt="Transferir fondos" className="w-100" />
          <img src={Screenshot3Image} alt="Historial del juego" className="w-100" />
          <img src={Screenshot4Image} alt="Página de acciones del banquero" className="w-100" />
        </div>
      </div>

      <hr />

      <div>
        <h2>Hospedalo Tú Mismo</h2>
        <p>Monopoly Money es código abierto, lo que significa que puedes hospedar tu propia instancia.</p>
        <p>
          <a href="https://github.com/brentvollebregt/monopoly-money">
            github.com/brentvollebregt/monopoly-money
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;

