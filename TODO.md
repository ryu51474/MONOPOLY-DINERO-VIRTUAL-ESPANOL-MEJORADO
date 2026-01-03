# Plan de Mejoras - Monopoly Money

## 1. Tarjetas de Jugador con Colores de Emoji ✅ COMPLETADO

### Cambios realizados:

- `packages/client/src/utils.ts`:

  - Agregado `AVATAR_COLORS`: mapa de emoji→color
  - Agregada función `getPlayerEmojiColor(emoji)` para obtener el color

- `packages/client/src/pages/Funds/PlayerCard.tsx`:

  - Ahora las tarjetas de jugador tienen el fondo del color correspondiente al emoji
  - Ejemplo: "🐶 Perro" tendrá tarjeta color marrón, "🐱 Gato" color rojo, etc.

- `packages/client/src/pages/Settings/index.tsx`:

  - Eliminado el botón de "Cambiar Avatar" (ya no es necesario)
  - Eliminado el import y uso de AvatarSelector
  - Eliminado el prop `proposePlayerAvatarChange` no usado

- `packages/client/src/components/AvatarSelector.tsx`:
  - **ARCHIVO ELIMINADO** - Ya no se necesita selección manual de avatar

### Cómo funciona ahora:

Los jugadores reciben un emoji automáticamente basado en su ID (determinístico). La tarjeta del jugador muestra:

- El emoji del jugador
- El color de fondo correspondiente al emoji (mapeo definido en AVATAR_COLORS)
- El nombre y saldo del jugador

Ejemplos de colores:

- 🐶 Perro: #8B4513 (marrón)
- 🐱 Gato: #FF6B6B (rojo)
- 🦊 Zorro: #FF6B35 (naranja)
- 🐼 Panda: #2C3E50 (azul oscuro)
- 🦁 León: #F39C12 (dorado)
- 🐯 Tigre: #E74C3C (rojo oscuro)
