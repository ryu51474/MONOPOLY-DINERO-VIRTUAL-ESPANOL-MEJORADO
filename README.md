<div align="center">
    <a href="https://monopoly-money.nitratine.net/"><img src="./packages/client/src/img/banner.png" alt="Monopoly Dinero Virtual Banner" style="background: white;"></a>
</div>

<p align="center">Gestiona tus finanzas en una partida de Monopoly directamente desde tu navegador.</p>
<p align="center">🎮 La experiencia definitiva del Monopoly virtual en español</p>

---

## 📌 Créditos y Agradecimientos

Este proyecto está basado en el trabajo original de **nitratine** (Brady).

**Repositorio Original:**

- GitHub: [https://github.com/nitratine/monopoly-money](https://github.com/nitratine/monopoly-money)
- Sitio Web: [https://monopoly-money.nitratine.net/](https://monopoly-money.nitratine.net/)

**Esta versión mejorada** es una adaptación con traducción completa al español, nuevas características estéticas, sistema de sonidos y mejoras de usabilidad.

---

## 🌟 Diferencias y Mejoras vs. Repositorio Original

| Característica            | Original (nitratine) | Esta Versión Mejorada                                             |
| ------------------------- | -------------------- | ----------------------------------------------------------------- |
| **Idioma**                | Inglés               | ✅ Español completo                                               |
| **Colores**               | Estándar, sobrios    | ✅ Colores vibrantes inspirados en el tablero clásico de Monopoly |
| **Sonidos**               | ❌ No disponible     | ✅ Sistema completo de sonidos (Web Audio API)                    |
| **Efectos visuales**      | Básicos              | ✅ Animaciones: pulse, fade-in, shake, monedas flotando, etc.     |
| **Interfaz**              | Funcional            | ✅ Diseño 3D, bordes coloreados, gradientes                       |
| **Tarjetas de jugadores** | Simples              | ✅ Efectos hover, animaciones de rebote, estilos tipo ficha       |
| **Botones**               | Estándar             | ✅ Efecto 3D tipo ficha de Monopoly                               |
| **Loading**               | Básico               | ✅ Spinner estilo ruleta de Monopoly                              |
| **Scrollbar**             | Por defecto          | ✅ Personalizada con colores del Monopoly                         |

### 🔊 Sistema de Sonidos (NUEVO)

La versión mejorada incluye un sistema completo de efectos de sonido generados mediante Web Audio API:

| Sonido                         | Descripción                          |
| ------------------------------ | ------------------------------------ |
| 💰 `playMoneySound()`          | Monedas cayendo (ka-ching!)          |
| ✅ `playTransactionSound()`    | Transacción exitosa (melodía casino) |
| ❌ `playErrorSound()`          | Error (buzz suave)                   |
| 🔔 `playNotificationSound()`   | Notificación (ding!)                 |
| 👆 `playClickSound()`          | Sonido de klik para botones          |
| 🃏 `playShuffleSound()`        | Barajar/mover dinero                 |
| 💎 `playBigTransactionSound()` | Transacción grande (ka-CHING!)       |
| 🖱️ `playHoverSound()`          | Hover en tarjetas                    |
| 🏆 `playWinSound()`            | Celebración (fanfare)                |

### 🎨 Paleta de Colores Mejorada

La versión española utiliza una paleta de colores inspirada directamente en el tablero de Monopoly:

| Color           | Código    | Uso                       |
| --------------- | --------- | ------------------------- |
| Verde Monopoly  | `#2ECC71` | Principal, dinero, éxitos |
| Verde Oscuro    | `#27AE60` | Bordes, sombras           |
| Rojo Monopoly   | `#E74C3C` | Errores, peligro          |
| Azul Monopoly   | `#3498DB` | Navegación, información   |
| Amarillo Dorado | `#F1C40F` | Destacados, advertencias  |
| Naranja         | `#E67E22` | Alertas                   |
| Crema           | `#FFFEF7` | Fondos de tarjetas        |

### ✨ Efectos Visuales y Animaciones

- **Animaciones de entrada:** `fadeInUp` para elementos emergentes
- **Pulse:** Para elementos importantes
- **Balance Flash:** Flash verde al actualizar saldo
- **Shake:** Para errores
- **Money Float:** Monedas flotando al recibir dinero
- **Card Bounce:** Rebote de tarjetas
- **Shimmer Gold:** Efecto brillo dorado
- **Card Pop 3D:** Emergencia 3D de tarjetas
- **Money Wave:** Ondas en iconos de dinero
- **Elastic Bounce:** Rebote elástico

---

## 📋 Características

- 🎮 **Multijugador** - Múltijas partidas simultáneas en el servidor
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
- 📜 **Historial** - Registro completo de todos los eventos de la partida visible por todos

---

## 🛠️ Configuración

1. Clona el repositorio y entra en la carpeta del proyecto
2. Instala las dependencias ejecutando `npm install`
3. Configura las variables de entorno:
   - Configura las variables en la sesión actual, o
   - Copia los archivos `.env.example` en los paquetes server y client:
     - `cp packages/server/.env.example packages/server/.env`
     - `cp packages/client/.env.example packages/client/.env`
4. Construye las dependencias con `npm run build`
5. Ejecuta `npm start` para iniciar el servidor

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
