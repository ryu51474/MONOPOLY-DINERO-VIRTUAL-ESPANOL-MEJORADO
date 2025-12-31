import React from "react";
import PagesImage from "../../img/help/pages.png";
import "./Help.scss";

const Help: React.FC = () => {
  return (
    <div className="help">
      <h3 className="text-center">Ayuda de Monopoly Money</h3>
      <p className="lead mt-2 text-center">Una pequeña guía de Monopoly Money.</p>

      <ul>
        <li>
          <a href="#pages">Páginas</a>
        </li>
        <li>
          <a href="#player-help">Ayuda para Jugadores</a>
        </li>
        <li>
          <a href="#banker-help">Ayuda para Banqueros</a>
        </li>
      </ul>

      <h4 id="pages">Páginas</h4>
      <img src={PagesImage} alt="Títulos para cada página" className="mw-100" />

      <h4 id="player-help">Ayuda para Jugadores</h4>

      <h5>Unirse a un Juego</h5>
      <p>
        Para unirte a un juego, selecciona "Unirse al Juego" desde la página de inicio y luego ingresa
        el ID del juego (el banquero lo tendrá) y tu nombre. Presiona "Unirse" cuando hayas completado
        todos los campos.
      </p>

      <h5>Transferir Fondos a Otros Jugadores, Estacionamiento Libre y el Banco</h5>
      <p>
        Para transferir fondos a otra persona/entidad, haz clic en la baldosa asociada con el
        jugador/entidad objetivo en la página de fondos. Debería aparecer un diálogo que te permitirá
        ingresar una cantidad para transferir. Presiona "Enviar" para completar la transacción.
      </p>

      <h5>Ver Transacciones Anteriores</h5>
      <p>
        Monopoly money te permite ver todos los eventos, incluyendo transacciones que han ocurrido
        anteriormente en el juego. Ve a la página de historial para ver estos eventos.
      </p>

      <h4 id="banker-help">Ayuda para Banqueros</h4>

      <h5>Crear un Juego</h5>
      <p>
        Para crear un juego, selecciona "Nuevo Juego" desde la página de inicio, ingresa tu nombre
        (este será tu nombre de jugador) y presiona "Crear".
      </p>

      <h5>Inicializar Saldos de Jugadores</h5>
      <p>
        Inicializar un juego establece el saldo de todos a un valor inicial en una sola acción; esta
        opción solo está disponible si no se ha realizado ninguna transacción aún.
      </p>
      <p>
        Al hacer clic en el botón "Inicializar Saldos de Jugadores" en la página del banquero,
        proporcionando una cantidad y presionando "Inicializar", se establecerán los saldos de todos
        los jugadores al valor proporcionado.
      </p>

      <h5>Dar Dinero a Jugadores desde el Banco</h5>
      <p>
        En la página del banco, debajo de la etiqueta "Dar Dinero al Jugador", hay un formulario para
        dar dinero a los jugadores. Proporciona la cantidad y luego selecciona un jugador objetivo del
        menú desplegable. Al presionar enviar se completará la transacción.
      </p>

      <h5>Mover Dinero de Jugadores al Banco</h5>
      <p>
        También puedes hacer lo opuesto usando el formulario debajo de "Tomar Dinero del Jugador";
        mover dinero de un jugador al banco.
      </p>
      <p>
        Esto típicamente no es una acción requerida pero se proporciona en caso de que el banquero
        accidentalmente dé demasiado dinero a un jugador.
      </p>

      <h5>Jugadores Pasando GO</h5>
      <p>
        En lugar de ingresar repetidamente la recompensa de pasar GO, se muestra un menú desplegable
        en la página del banco debajo del encabezado "Jugador Pasó GO ($[cantidad])". Al seleccionar
        un jugador y luego presionar "Dar", se le dará al jugador la cantidad mostrada arriba.
      </p>
      <p>
        Para cambiar la cantidad dada a un jugador, presiona el botón de configuración a la derecha,
        ingresa una nueva cantidad y presiona "Establecer".
      </p>

      <h5>Dar Estacionamiento Libre a un Jugador</h5>
      <p>
        Para dar estacionamiento libre a un jugador, selecciona el jugador en el menú desplegable
        debajo de la etiqueta "Dar Estacionamiento Libre" y presiona "Dar" para completar la
        transacción.
      </p>

      <h5>Cambiar el Nombre de un Jugador</h5>
      <p>
        Puedes cambiar el nombre de un jugador en la página de configuración haciendo clic en el
        botón de lápiz en la misma fila que el jugador objetivo. Al modificar el nombre y hacer clic
        en "Renombrar" se renombrará al jugador.
      </p>

      <h5>Eliminar un Jugador</h5>
      <p>
        Puedes eliminar a un jugador del juego en la página de configuración haciendo clic en el
        botón de basura en la misma fila que el jugador objetivo. Al confirmar esta acción se
        eliminará al jugador del juego actual.
      </p>

      <h5>Cerrar el Juego a Nuevos Jugadores</h5>
      <p>
        Cerrar el juego evita que nuevos jugadores se unan y oculta el código del juego de la página
        de fondos. Para hacer esto, selecciona "Cerrar Juego a Nuevos Jugadores" en la página de
        configuración. Esto es útil si todos se han unido al juego y no necesitas que nadie más se
        una.
      </p>
      <p>Para reabrir el juego, presiona el mismo botón de nuevo.</p>

      <h5>Terminar el Juego</h5>
      <p>
        Puedes terminar el juego haciendo clic en "Terminar Juego" en la página de configuración y
        confirmando. Esto eliminará completamente el juego y expulsará a todos. No podrás volver a
        entrar a un juego después de terminarlo.
      </p>
    </div>
  );
};

export default Help;

