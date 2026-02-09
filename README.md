<div align="center">
    <a href="https://github.com/ryu51474/MONOPOLY-DINERO-VIRTUAL-ESPANOL-MEJORADO"><img src="./packages/client/src/img/banner.png" alt="Monopoly Dinero Virtual Banner" style="background: white;"></a>
</div>

<p align="center">Gestiona tus finanzas en una partida de Monopoly directamente desde tu navegador.</p>
<p align="center">🎮 La experiencia definitiva del Monopoly virtual en español mejorado</p>

---

## 📌 Créditos y Autoría

Este proyecto es una versión **Español Mejorado** desarrollada y mantenida por **Daniel (ryu51474)**.

Está basado en el excelente trabajo original de **nitratine (Brent Vollebregt)**.

**Enlaces de Interés:**
- **Esta Versión (Español Mejorado):** [https://github.com/ryu51474/MONOPOLY-DINERO-VIRTUAL-ESPANOL-MEJORADO](https://github.com/ryu51474/MONOPOLY-DINERO-VIRTUAL-ESPANOL-MEJORADO)
- **Autoría y Copyright:** [www.profedaniel.cl](http://www.profedaniel.cl)
- **Repositorio Original (Inglés):** [https://github.com/nitratine/monopoly-money](https://github.com/nitratine/monopoly-money)

---

## 🌟 ¿Qué trae el "Español Mejorado"?

Esta versión no es solo una traducción, es una reconstrucción orientada a la mejor experiencia de usuario en móviles y tablets:

| Característica | Original (Inglés) | Español Mejorado (Esta Versión) |
| :--- | :--- | :--- |
| **Idioma** | Inglés | ✅ Español completo |
| **Subastas** | Funcional básico | ✅ **Subastas 2.0**: Cualquier jugador puede iniciar, precios automáticos, pujas acumulativas, saldo proyectado y notificaciones visuales. |
| **Sonido** | ❌ No disponible | ✅ Sistema de sonidos reactivo (Ka-ching!, transacciones, errores) optimizado para móviles. |
| **Funcionalidad GO** | Estándar ($200) | ✅ **"Cayó en GO"**: Opción de cobro doble ($400) con reset automático. |
| **Interfaz** | Sobria | ✅ Colores vibrantes, diseño 3D, animaciones fluidas y **layout dinámico**. |
| **Conectividad** | Localhost | ✅ Apertura automática usando la **IP de red** y QR dinámico para unión rápida. |
| **Facilidad de Uso** | Comandos NPM | ✅ **Scripts de un solo clic**: `iniciar_WINDOWS.bat` e `iniciar_MAC_o_LINUX.sh`. |

---

---

## 📋 Características

- 🎮 **Multijugador** - Múltiples partidas simultáneas en el servidor
- 📱 **Dispositivos propios** - Cada jugador usa su propio dispositivo
- 💸 **Transferencias fáciles** - Envía dinero entre jugadores sin necesidad de contar efectivo
- ⚡ **Tiempo real** - Los jugadores son notificados inmediatamente de los eventos
- 🏦 **Sistema bancario** - El creador de la partida es el banquero:
  - Dar y recibir dinero del banco
  - Asignar estacionamiento libre
  - Actualizar nombres de jugadores
  - Eliminar jugadores
  - Activar/desactivar estacionamiento libre
  - Cerrar la partida a nuevos jugadores
  - Finalizar el juego completamente
- 📜 **Historial** - Registro completo de todos los eventos de la partida con renderizado de HTML corregido
- 🔨 **Sistema de Subastas (NUEVO)** - Un sistema de subastas interactivo para propiedades:
  - Activable/desactivable desde la configuración del banquero
  - Cualquier jugador puede iniciar una subasta eligiendo el color de la propiedad
  - Precios fijos según el color (reglas estándar de Monopoly)
  - Pujas en tiempo real (+10, +50, +100, +500)
  - El banquero finaliza la subasta y el dinero se descuenta automáticamente del ganador
- 🚀 **Inicio Rápido** - Scripts autoejecutables para iniciar el juego sin comandos complicados
- 🌐 **Apertura Automática** - El navegador se abre automáticamente en la dirección correcta al iniciar

---

## 🛠️ Configuración

1. Clona el repositorio y entra en la carpeta del proyecto
   (ej)`git clone https://github.com/ryu51474/MONOPOLY-DINERO-VIRTUAL-ESPANOL-MEJORADO.git`
2. Instala las dependencias ejecutando `npm install`
3. Configura las variables de entorno:
   - Configura las variables en la sesión actual, o
   - Copia los archivos `.env.example` en los paquetes server y client:
     - `cp packages/server/.env.example packages/server/.env`
     - `cp packages/client/.env.example packages/client/.env`
4. Ejecuta `npm run build` para compilar el proyecto
5. Ejecuta `npm start` para iniciar el servidor
6. **¡Listo!** El navegador se abrirá automáticamente en `http://localhost:3000`

### 🚀 Uso de Scripts de Inicio (Más Fácil)

Si no quieres usar la terminal, puedes usar los scripts incluidos:

- **Windows**: Haz doble clic en `iniciar_juego.bat`
- **Linux/macOS**: Ejecuta `./iniciar_juego.sh` (asegúrate de darle permisos con `chmod +x iniciar_juego.sh`)

### 🧪 Configuración para Desarrollo

Para activar hot-reloading en backend y frontend:

- Ejecuta el backend: `npm run server:dev`
- Ejecuta el frontend: `npm run client:dev`

> El archivo `launch.json` también permite conectar y depurar el servidor al ejecutar `npm run client:dev`.

Este proyecto usa npm workspaces. Comandos útiles:

- Añadir dependencia al cliente: `npm install DEP -w ./packages/client --save`
- Construir solo el cliente: `npm run build -w ./packages/client`

---

## ❓ ¿Por qué?

Si alguna vez has jugado la edición de tarjeta de crédito de Monopoly, apreciarás lo rápido que avanza el juego sin tener que contar efectivo. Esta aplicación web sustituye la necesidad de efectivo en una partida de Monopoly por una solución de banca móvil donde los jugadores pueden enviarse fácilmente moneda virtual.

---

## 🌐 Despliegue

Esta aplicación está diseñada para desplegar el servidor en fly.io (con el cliente) y un cliente separado (principal) en GitHub Pages.

- El flujo de despliegue del servidor está en [deploy-server.yml](./.github/workflows/deploy-server.yml)
- El flujo de despliegue del cliente está en [deploy-client.yml](./.github/workflows/deploy-client.yml)

---

## 📄 Licencia

Este proyecto está basado en el trabajo original de nitratine bajo licencia MIT.

---

<div align="center">
  <p>Desarrollado con ❤️ para la comunidad de Monopoly</p>
  <p>Basado en el proyecto original de nitratine</p>
</div>
