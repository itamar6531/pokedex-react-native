# Pokédex — React Native App

Aplicación móvil multiplataforma que funciona como una **Pokédex interactiva** de la primera generación (151 Pokémon). Consulta información en tiempo real desde la [PokeAPI](https://pokeapi.co/) y explora cada Pokémon con una interfaz moderna, búsqueda integrada y vista de detalles.

---

## Descripción del proyecto

Esta app permite explorar el catálogo completo de los 151 Pokémon originales. Cada entrada muestra su imagen oficial, número, nombre y tipos con colores distintivos según el elemento. Al tocar un Pokémon se abre un modal con información detallada: descripción, altura, peso, habilidades y estadísticas base representadas con barras visuales.

### Características principales

- **Catálogo completo** — Los 151 Pokémon de la primera generación cargados desde PokeAPI.
- **Búsqueda en tiempo real** — Filtra por nombre o número de Pokédex.
- **Vista de detalle** — Modal con descripción (español o inglés), tipos, habilidades y stats base.
- **Tipos con color** — Etiquetas visuales según el tipo elemental (fuego, agua, planta, etc.).
- **Modo claro y oscuro** — Interfaz adaptable al tema del sistema.
- **Header con efecto parallax** — Cabecera animada con iconografía de Pokéball.
- **Multiplataforma** — Compatible con Android, iOS y web.

---

## Herramientas y tecnologías

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | [React Native](https://reactnative.dev/) `0.79.5` |
| **UI Library** | [React](https://react.dev/) `19.0.0` |
| **Plataforma** | [Expo](https://expo.dev/) SDK `53` |
| **Navegación** | [Expo Router](https://docs.expo.dev/router/introduction/) `5` (enrutamiento basado en archivos) |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) `5.8` |
| **Imágenes** | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) |
| **Animaciones** | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) `3` |
| **Navegación (tabs)** | [@react-navigation/bottom-tabs](https://reactnavigation.org/) `7` |
| **Feedback háptico** | [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) |
| **Fuentes** | [expo-font](https://docs.expo.dev/versions/latest/sdk/font/) (SpaceMono) |
| **Build & deploy** | [EAS Build](https://docs.expo.dev/build/introduction/) + [expo-dev-client](https://docs.expo.dev/versions/latest/sdk/dev-client/) |
| **Linting** | [ESLint](https://eslint.org/) con `eslint-config-expo` |
| **API de datos** | [PokeAPI](https://pokeapi.co/) v2 |
| **Arquitectura** | Nueva Arquitectura de React Native habilitada (`newArchEnabled`) |

---

## Estructura del proyecto

```
reactnative_app1/
├── app/                    # Pantallas y rutas (Expo Router)
│   ├── (tabs)/
│   │   ├── index.tsx       # Pantalla principal — Pokédex
│   │   ├── explore.tsx     # Pantalla de exploración / info del template
│   │   └── _layout.tsx     # Layout de pestañas inferiores
│   ├── _layout.tsx         # Layout raíz y carga de fuentes
│   └── +not-found.tsx      # Pantalla 404
├── components/             # Componentes reutilizables
│   ├── ParallaxScrollView.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── ui/                 # Iconos, fondo de tab bar, etc.
├── constants/              # Colores y constantes de tema
├── hooks/                  # Hooks personalizados (tema, color scheme)
├── assets/                 # Imágenes, iconos y fuentes
├── app.json                # Configuración de Expo
├── eas.json                # Perfiles de build EAS
└── package.json
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (incluido vía `npx`)
- Para dispositivo físico: app [Expo Go](https://expo.dev/go) o un **development build**
- Para emuladores: [Android Studio](https://developer.android.com/studio) y/o [Xcode](https://developer.apple.com/xcode/) (macOS)

---

## Instalación y ejecución

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd reactnative_app1
npm install
```

### 2. Iniciar el servidor de desarrollo

```bash
npx expo start
```

Desde el menú de Expo podrás abrir la app en:

| Opción | Comando / acción |
|--------|------------------|
| Android (emulador) | `a` |
| iOS (simulador, solo macOS) | `i` |
| Web | `w` |
| Expo Go (dispositivo físico) | Escanear el código QR |

### Scripts disponibles

```bash
npm start          # Inicia Expo Dev Server
npm run android    # Abre en emulador Android
npm run ios        # Abre en simulador iOS
npm run web        # Abre en navegador web
npm run lint       # Ejecuta ESLint
```

---

## Build para producción (EAS)

El proyecto está configurado con [EAS Build](https://docs.expo.dev/build/introduction/). Perfiles definidos en `eas.json`:

| Perfil | Uso |
|--------|-----|
| `development` | Build con development client para depuración |
| `preview` | Build interno para pruebas |
| `production` | Build de producción con auto-incremento de versión |

```bash
# Instalar EAS CLI (si no lo tienes)
npm install -g eas-cli

# Login en Expo
eas login

# Crear build de producción
eas build --platform android
eas build --platform ios
```

---

## API utilizada

Los datos provienen de **[PokeAPI](https://pokeapi.co/)**, una API REST gratuita y de código abierto:

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/v2/pokemon?limit=151` | Lista de los 151 Pokémon |
| `GET /api/v2/pokemon/{id}` | Detalles de un Pokémon |
| `GET /api/v2/pokemon-species/{id}` | Descripción y datos de especie |

Sprites oficiales proporcionados por el repositorio [PokeAPI/sprites](https://github.com/PokeAPI/sprites).

---

## Capturas de pantalla

> _Añade aquí capturas de la Pokédex, la búsqueda y el modal de detalles._

---

## Licencia

Proyecto de uso educativo y personal. Los personajes y datos de Pokémon son propiedad de [The Pokémon Company](https://www.pokemon.com/). Los datos son proporcionados por [PokeAPI](https://pokeapi.co/), que no está afiliada con Nintendo o The Pokémon Company.

---

## Créditos

- Datos: [PokeAPI](https://pokeapi.co/)
- Sprites: [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
- Template base: [create-expo-app](https://www.npmjs.com/package/create-expo-app) con Expo Router
