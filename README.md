# TaskFlow

## Descripción
TaskFlow es una aplicación móvil de gestión de tareas "offline-first", diseñada con una interfaz moderna y eficiente, similar a plataformas como Trello o Asana. Permite a los usuarios organizar su día a día, marcando tareas como pendientes o completadas, de forma fluida y sin depender de una conexión constante a internet.

## Stack Tecnológico
La aplicación está construida utilizando las mejores prácticas de desarrollo móvil multiplataforma moderno:

*   **Framework Base:** Expo + React Native orientados a la máxima productividad.
*   **Lenguaje:** TypeScript estricto para asegurar legibilidad, autocompletado y una alta fiabilidad en tiempo de compilación.
*   **Persistencia Local (Offline-First):** `@react-native-async-storage/async-storage` encolado tras una arquitectura de repositorios limpia.
*   **Manejo de Estado UI:** `Zustand` por su enfoque minimalista y libre de boilerplate.
*   **Navegación:** React Navigation v6 (`@react-navigation/native-stack`).
*   **Fuente de Datos Remota (API):** `https://dummyjson.com/todos`, emulando un backend real para la lista de tareas.
*   **Testing:** Integración exhaustiva de Jest y `@testing-library/react-native` para pruebas unitarias fiables.

## Instalación
Sigue estos pasos para clonar el proyecto y poner en marcha el entorno local:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/taskflow.git
    cd taskflow
    ```

2.  **Instalar dependencias:**
    Asegúrate de tener Node.js instalado antes de ejecutar el siguiente comando.
    ```bash
    npm install
    # o bien usando expo cli:
    # npx expo install
    ```

## Cómo correr la app
La aplicación está estructurada para desarrollarse nativamente a través del ecosistema Expo Managed Workflow.

1.  Inicia el servidor de bundler (Metro):
    ```bash
    npx expo start
    ```
2.  **Prueba en dispositivo físico:** Escanea el código QR que se mostrará en la terminal usando la aplicación **Expo Go** (disponible en Android e iOS).
3.  **Prueba en emulador:** Tras inicializar, presiona `a` para abrir en el emulador de Android o `i` para abrir en el simulador de iOS.

## Cómo correr los tests
Hemos preparado una suite de pruebas usando Jest que avalan tanto la lógica de negocio como los repositorios. Para ejecutar los tests unitarios:

```bash
npm test
# o alternativamente:
# npx jest
```

## Arquitectura Offline-First
La verdadera fuerza de TaskFlow radica en su resiliencia bajo conectividad no confiable. 

**¿Por qué utilizamos AsyncStorage?**
Aunque inicialmente se evaluó el uso de una base de datos reactiva local (como WatermelonDB o OP-SQLite), las limitaciones del "Expo Managed Workflow" que restringen vinculaciones nativas complejas llevaron a la elección de `AsyncStorage`. Es una solución estándar, probada y, con una buena capa de abstracción, cumple la función de almacenamiento local persistente a la perfección en esta aplicación.

**El Patrón Repositorio y SyncService:**
La aplicación separa tajantemente la lógica de datos de la UI. 
*   Contamos con un esquema de dominio estricto apoyado en un `TaskLocalRepository` que serializa y abstrae sobre `AsyncStorage`.
*   A nivel superior, el orquestador principal es `SyncService.ts`. Su responsabilidad en la carga o inicio de la app (`init`) es examinar si ya existen datos locales, proveyéndolos de forma inmediata para permitir uso fuera de línea sin bloqueos.
*   Al activar intencionalmente la sincronización cruzando la UI (mediante un Pull-to-Refresh invocado en `syncNow()`), el servicio captura información de red desde el API y la reconcilia con lógica `upsertMany` hacia el disco local previniendo caídas totales de la aplicación (fallando de manera silenciosa) si la red no está en servicio.

## Componente AvatarView
El componente `AvatarView.tsx` genera un visualizador de perfil dinámico asignando colores hermosos basados en hash sobre el nombre de usuario y determinando las abreviaturas correspondientes.

*   **Implementación actual:** Es una solución 100% escrita en código JavaScript (React Native clásico `View` y `Text`). Completamente compatible con el ecosistema web/Expo gracias a que no requiere puentes nativos directos.
*   **Enfoque de Producción Bare Workflow:** Hemos dejado exportado una abstracción `NativeAvatarView`. En un entorno productivo con "Bare Workflow" donde el rendimiento y el memory foot-print fueran críticos (ej. en listas de cientos de usuarios renderizándose), este View debió ser una implementación pura nativa. En Android se codificaría usando `SimpleViewManager` extendido en **Kotlin** controlando una UI propia, y en iOS, mediante un componente registrado desde **Swift** con `RCTViewManager`.

## Uso de IA
Esta aplicación fue construida aprovechando el ecosistema de inteligencia artificial **Google Antigravity acoplado con Gemini 3.1 Pro**. La herramienta facilitó enormemente la escritura del "boilerplate", el tipado de los modelos TypeScript, conformación de la arquitectura de inyección/repositorio y la lógica detallada para sincronización offline/online en conjunto con Jest.

Sin embargo, toda la supervisión general, decisiones de ajuste arquitectónico profundo (como el cambio de WatermelonDB por AsyncStorage), resolución estática, manejo de flujos incompatibles en Expo y la garantía de integración de los entornos, tests y flujos de usuario fueron gestionadas y refinadas por el raciocinio humano del desarrollador de este proyecto.
