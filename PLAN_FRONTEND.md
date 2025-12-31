# Plan de Mejora del Frontend - Monopoly Money

## Resumen del Problema

El frontend actual tiene:

- Gradientes morados/azules poco relacionados con Monopoly
- Botones transparentes difíciles de ver
- Poco contraste en textos
- Sin animaciones ni sonidos
- Diseño básico sin personalidad

## Solución Propuesta

### 1. Paleta de Colores Monopoly

```
PRIMARY (Verde Dinero):      #1D8A3D  o  #2E7D32
SECONDARY (Rojo):            #C41E3A  o  #D32F2F
DARK (Azul Monopoly):        #1A3A6E  o  #1565C0
ACCENT (Amarillo):           #F5C518  o  #FFC107
SUCCESS (Verde):             #388E3C
WARNING (Naranja):           #F57C00
BACKGROUND (Verde Mesa):     #E8F5E9  o  #F1F8E9
CARD BG (Blanco/Crema):      #FFFEF7
```

### 2. Archivos a Modificar

#### A. `index.scss` - Estilos globales

- Definir variables CSS con colores Monopoly
- Cambiar fondo a verde estilo mesa de Monopoly
- Mejorar botones con colores sólidos
- Añadir sombras y efectos

#### B. `Navigation.scss` + `Navigation.tsx`

- Navbar con color azul Monopoly
- Botones con fondo verde y mejor contraste

#### C. `Funds.scss` + `PlayerCard.tsx`

- Cards con bordes verdes y fondo crema
- Mejor contraste en textos
- Animación de hover
- Indicador de conexión más visible

#### D. `SendMoneyModal.tsx`

- Modal con estilo Monopoly
- Botones grandes y coloridos
- Animación de entrada

#### E. `Home/index.tsx` + `Home.scss`

- Banner mejorado
- Botones principales atractivos
- Cards de juegos activos mejorados

#### F. `Bank/index.tsx` + `Bank.scss`

- Secciones con colores diferenciados
- Mejor organización visual

#### G. `History/index.tsx` + `History.scss`

- Barras de colores según tipo de evento
- Mejor legibilidad

#### H. `Settings/index.tsx` + `Settings.scss`

- Mejora visual de tablas y botones

### 3. Sonidos (Nueva funcionalidad)

Crear archivo `utils/sounds.ts` con:

- Sonido de dinero al transferir
- Sonido de notificación
- Usar Web Audio API o archivos de audio

### 4. Animaciones (Nueva funcionalidad)

- Animación de "dinero volando" al transferir
- Flash de actualización de balance
- Animación de entrada para modales
- Efecto de dinero contando

## Archivos a Crear/Nuevos

1. `packages/client/src/utils/sounds.ts` - Utilidad de sonidos
2. `packages/client/src/components/MoneyAnimation.tsx` - Componente de animación de dinero
3. `packages/client/public/sounds/` - Archivos de audio (opcional, usar sintesis)

## Dependencias Existentes a Mantener

- react-bootstrap
- hookrouter
- luxon
- react-number-format

## Pasos de Implementación

### Paso 1: Variables CSS y Estilos Base

- Definir CSS custom properties
- Reemplazar gradientes con colores sólidos
- Mejorar contraste

### Paso 2: Componentes Principales

- Navigation
- PlayerCard
- SendMoneyModal

### Paso 3: Páginas

- Home
- Funds
- Bank
- History
- Settings

### Paso 4: Sonidos y Animaciones

- Implementar utilidad de sonidos
- Añadir animaciones CSS
- Componente de animación de dinero

## Consideraciones

- Mantener accesibilidad
- No romper funcionalidad existente
- Mantener diseño responsive
- Usar los colores consistentemente

---

_Plan creado: $(date)_
