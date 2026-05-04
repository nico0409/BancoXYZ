<div align="center">
  <h1>🏦 BancoXYZ - Mobile Banking App</h1>

  **Una experiencia bancaria móvil moderna, segura y de alto rendimiento.**

  <br />

  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  
  <br />

  [![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)
  [![Zustand](https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)
  [![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)](https://react-hook-form.com/)

  <br />

  [![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
  [![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
  [![Husky](https://img.shields.io/badge/Husky-42b983?style=for-the-badge&logo=git&logoColor=white)](https://typicode.github.io/husky/)
</div>


---

Este proyecto es una solución integral para la prueba técnica de ingreso a **Topaz**. Se trata de una aplicación móvil desarrollada con **React Native** y **Expo**, diseñada bajo estándares de arquitectura empresarial, priorizando la escalabilidad, la seguridad y la robustez técnica.



**Para el desarrollo de este proyecto, mi objetivo fue estructurar una base de código con estándares Enterprise. Las decisiones técnicas más relevantes incluyen:**



* ⚡ **Rendimiento:** Optimización estricta de renders innecesarios, uso intensivo de `useMemo` para estado derivado y gestión eficiente de listas grandes con `FlatList`.

* 🔒 **Seguridad y Ciclo de Vida (Auto-Logout):** Gestión robusta de tokens utilizando almacenamiento encriptado del dispositivo. Además, se implementó un sistema de monitoreo activo del `AppState`: si la aplicación pasa a segundo plano (background) por más de 5 minutos, el sistema purga automáticamente la sesión y el estado en memoria, mitigando drásticamente el riesgo de accesos no autorizados.

* 🛠️ **Mantenibilidad:** Tipado estricto con TypeScript, separación de responsabilidades e inyección de dependencias.

* 🌍 **Escalabilidad Global:** Soporte nativo para internacionalización (i18n), preparado para implementaciones en múltiples regiones (Español y Portugués).



### 🛡️ Gobernanza de Código y Calidad (Quality Assurance)



Para garantizar que el código se mantenga prístino y libre de errores a medida que el proyecto escala, se implementó un ecosistema estricto de validación y automatización:



* 🤖 **CI/CD Pipeline (GitHub Actions):** Flujos de trabajo automatizados que ejecutan validaciones estáticas y pruebas en cada *Pull Request*, impidiendo la integración de código defectuoso a la rama principal.

* 🎣 **Pre-commit Hooks (Husky + lint-staged):** Intercepción automática en Git para ejecutar **ESLint** y **Prettier**. Si el código no cumple con las reglas de estilo establecidas o el mensaje del commit no sigue el estándar *Conventional Commits*, la acción es rechazada.

* 🐻 **Gestión de Estado Híbrida:** Uso estratégico de **Zustand** para el manejo del estado global del cliente (ultraligero y sin *boilerplate*), trabajando en perfecta armonía con TanStack Query para el estado asíncrono del servidor.

* 🧪 **Testing Automatizado (Jest):** Cobertura de pruebas unitarias y de integración asiladas por funcionalidad (*Feature*), validando matemáticamente la lógica de negocio (filtros, validaciones de saldo) y los componentes críticos antes de cualquier despliegue.





* **🚨 Manejo de Errores Críticos (Blocking Error System):**

    * Implementación de una pantalla de error global que intercepta fallos críticos a nivel de red (ej. error al obtener el token en los interceptores de Axios) e impide interacciones inestables.

    * Arquitectura desacoplada: Uso de un *store* global independiente (`useErrorStore` con Zustand) que permite a archivos ajenos a los componentes de React (como el API client) disparar cambios en la UI.

    * Interfaz "Premium" de recuperación: Pantalla de bloqueo con animaciones fluidas (`moti`), iconografía limpia (`lucide-react-native`) y un mecanismo de recuperación (botón "Reintentar") para ofrecer una excelente experiencia de usuario (UX) incluso en escenarios de fallo (Graceful Degradation).





* **[React Native MMKV](https://github.com/mrousavy/react-native-mmkv):** Almacenamiento local de clave-valor escrito en C++. Es síncrono y hasta 30 veces más rápido que AsyncStorage, eliminando cuellos de botella en la inicialización.





### 📂 Estructura de Carpetas (Feature-Sliced Design)



El proyecto abandona la tradicional agrupación por "tipo de archivo" en favor de una arquitectura orientada al dominio de negocio, garantizando escalabilidad y bajo acoplamiento:



```text
📦 src
 ┣ 📂 api           # Configuración de Axios e interceptores (Inyección de JWT)
 ┣ 📂 components    # UI Kit global estricto (Botones, Inputs, Layouts tipados)
 ┣ 📂 config        # Validación estática de variables de entorno (Zod)
 ┣ 📂 features      # Módulos por dominio de negocio (Auth, Balance, Transfers)
 ┃  ┣ 📂 auth       # Lógica, hooks, schemas y vistas de Autenticación
 ┃  ┣ 📂 balance    # Lógica y vistas del Saldo
 ┃  ┗ 📂 transfer   # Formularios, validaciones y vistas de Transferencias
 ┣ 📂 locales       # Diccionarios de internacionalización (i18n: pt-BR, es-CO)
 ┣ 📂 navigation    # Orquestador de rutas (React Navigation)
 ┣ 📂 theme         # Sistema de diseño, paleta "Topaz Purple" y tipografía
 ┗ 📂 utils         # Formateadores de fecha, moneda y utilidades puras

```

## 🛠️ Requisitos del Entorno

Para garantizar la estabilidad de los módulos nativos y la correcta compilación de las librerías de seguridad, se requiere:

* **Node.js:** v22.x (LTS) - **Obligatorio**.

* **Gestor de paquetes:** npm o yarn.
---


## 📦 Configuración por Plataforma (Paso a Paso)


### 🍎 Para iOS (Requiere macOS exclusivamente)





1.  **Xcode:** Instala la última versión desde la Mac App Store.

2.  **Command Line Tools:** Abre Xcode, ve a `Settings > Locations` y asegúrate de que las *Command Line Tools* estén seleccionadas.

3.  **Simulador:** En Xcode, ve a `Window > Devices and Simulators` y crea un simulador (ej. iPhone 15).

4.  **CocoaPods:** Es esencial para gestionar las dependencias de iOS. Instálalo en la terminal de tu Mac:

    ```bash

    brew install cocoapods

    ```



### 🤖 Para Android (Windows, macOS o Linux)



Para validar los *Adaptive Icons* y el comportamiento del hardware:



1.  **Android Studio:** Descarga e instala [Android Studio](https://developer.android.com/studio).

2.  **SDK Manager:** Dentro de Android Studio, instala:

    * Android SDK Platform (versión 34 o superior).

    * Android SDK Build-Tools.

    * Android Emulator.

3.  **Variables de Entorno (PATH):** Asegúrate de tener configurado tu `ANDROID_HOME` y las herramientas de plataforma.

    

    * **En macOS/Linux (`~/.zshrc` o `~/.bashrc`):**

        ```bash

        export ANDROID_HOME=$HOME/Library/Android/sdk

        export PATH=$PATH:$ANDROID_HOME/emulator

        export PATH=$PATH:$ANDROID_HOME/platform-tools

        ```

    * **En Windows (PowerShell):**

        ```powershell

        [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\TU_USUARIO\AppData\Local\Android\Sdk", "User")

        # Asegúrate de agregar las carpetas \emulator y \platform-tools a la variable Path desde el Panel de Control.

        ```

4.  **Virtual Device (AVD):** Crea un dispositivo virtual con Google Play Services habilitado.



---



## 🚀 Cómo ejecutar la aplicación



### 1. Clonar e Instalar

```bash
git clone https://github.com/nico0409/BancoXYZ
cd bancoxyz-mobile
npm install
```

### 2. Configurar Variables de Envorno

Crea un archivo llamado `.env.development` en la raíz de tu proyecto. Este archivo es vital para que la aplicación sepa a qué servidor conectarse.



* **Comando rápido (Mac/Linux):** `touch .env.development`

* **Comando rápido (Windows PowerShell):** `New-Item .env.development`



**Contenido del archivo:**

```env

# .env.development

EXPO_PUBLIC_API_URL=https://qf5k9fspl0.execute-api.us-east-1.amazonaws.com/default

EXPO_PUBLIC_BALANCE_API_URL=https://2k0ic4z7s5.execute-api.us-east-1.amazonaws.com/default

EXPO_PUBLIC_TRANSFER_API_URL=https://ofqx4zxgcf.execute-api.us-east-1.amazonaws.com/default

EXPO_PUBLIC_TRANSFER_HISTORY_API_URL=https://n0qaa2fx3c.execute-api.us-east-1.amazonaws.com/default

```





## 🏃 Ejecución de la Aplicación



Existen dos formas de correr el proyecto. La **Opción A** es la recomendada para evaluar la experiencia real de usuario (iconos y splash screen).



### Opción A: Modo Nativo Completo (Recomendado)

Este modo realiza el *Prebuild*, inyecta los assets nativos y compila el binario real.



#### Para iOS (Solo macOS)

Requiere tener instalado **Xcode** y **CocoaPods**.



1. Instala las dependencias nativas:

   ```bash

   cd ios && pod install && cd ..



2. **Ejecutar el simulador:**

   ```bash

   npx expo run:ios

--- 



#### Para Android (Windows, macOS o Linux)

Requiere **Android Studio** y un emulador (**AVD**) configurado.



1. **Abrir el emulador:** Asegúrate de que el emulador de Android esté encendido.

2. **Ejecutar el comando:**



```bash

npx expo run:android

```



### Opción B: Expo Go (Desarrollo Rápido)

Ideal si no tienes configurado **Android Studio** o **Xcode**. Funciona en cualquier sistema operativo instalando la app **"Expo Go"** en tu móvil físico.



1. **Iniciar el servidor:**

   ```bash

   npx expo start



2. Escanear el código: Abre la cámara (iOS) o la app Expo Go (Android) y escanea el código QR que aparecerá en tu terminal.



-----

## 🧪 Pruebas Unitarias



Para validar la lógica de las transferencias y los cálculos financieros, ejecuta:



```bash

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo "watch"
npm test -- --watch
```
## 📸 Galería de la Aplicación

<table align="center">
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/1c45527e-08b6-4231-8040-e2cf1591c51d" width="220px;" alt="Pantalla de Error" />
      <br /><b>1. Pantalla de Error</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/129628f0-3c86-45f8-8670-098b9a68699a" width="220px;" alt="splashscreen" />
      <br /><b>2. splashscreen</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/04b385f6-d09a-48ee-9b16-e3f0a5dc40a3" width="220px;" alt="Pantalla de login" />
      <br /><b>3. Pantalla de login</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/9d28099f-66c7-4b45-95df-b8f761191720" width="220px;" alt="Formulario de Transferencia" />
      <br /><b>4. home</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ebee8b75-00f9-4064-a1bc-49bce3c6214b" width="220px;" alt="Componente Nativo DatePicker" />
      <br /><b>5. Revision de transferencia</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/d24473e7-0660-41c9-b09f-f3aa449b0ee8" width="220px;" alt="Componente Nativo DatePicker" />
      <br /><b>6. Selector de fechas Nativo</b>
    </td>
  </tr>
</table>


## 🔮 oportunidades de mejora  / Próximos Pasos

Si este proyecto continuara hacia una fase de producción real, estas serían las prioridades de implementación:

1. **E2E Testing (Maestro/Appium):** Implementar flujos de prueba de extremo a extremo para el proceso de transferencia, simulando el comportamiento real del usuario.
2. **MSW (Mock Service Worker):** Integrar un servidor de mocks para pruebas de integración y desarrollo offline más robusto.
3. **Mecanismo de "Kill Switch":** Implementar una validación de versión mínima obligatoria al arranque para forzar actualizaciones en caso de fallos críticos de seguridad.
4. **Dark Mode:** Expandir el sistema de temas de Shopify Restyle para soportar un esquema de colores oscuro nativo.
5. **Certificate Pinning:** Añadir una capa extra de seguridad SSL para prevenir ataques *Man-in-the-Middle* en las comunicaciones con la API.

---

## 🤝 Agradecimientos y Contacto

Quiero expresar mi agradecimiento al equipo técnico de **Topaz** por el tiempo dedicado a la revisión de este repositorio. Diseñar e implementar esta solución ha sido un desafío estimulante y una excelente oportunidad para demostrar mi enfoque hacia la creación de software robusto, seguro y centrado en el usuario.

Quedo a entera disposición para profundizar en cualquier decisión técnica o de arquitectura durante la siguiente etapa del proceso.

* 💼 **LinkedIn:** [Nicolas Gonzalez](https://www.linkedin.com/in/nicolas-gonzalez-rodriguez-50699745)
* 📧 **Email:** [nico04093@gmail.com](mailto:nico04093@gmail.com)
* 💻 **GitHub:** [@nico0409](https://github.com/nico0409)


