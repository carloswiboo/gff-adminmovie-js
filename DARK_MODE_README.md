# Dark Mode Implementation - Girona Film Festival

## Descripción
Se ha implementado la funcionalidad de modo oscuro utilizando Flowbite y Tailwind CSS. La funcionalidad incluye:

- **Detección automática**: Detecta la preferencia del sistema del usuario
- **Persistencia**: Guarda la preferencia en localStorage
- **Transiciones suaves**: Animaciones al cambiar entre modos
- **Componentes adaptados**: Todos los componentes soportan ambos temas

## Componentes Creados

### 1. DarkModeProvider
**Ubicación**: `/app/components/DarkModeProvider/DarkModeProvider.js`

Context Provider que gestiona el estado global del modo oscuro:

```javascript
import { DarkModeProvider, useDarkMode } from './components/DarkModeProvider/DarkModeProvider';

// En cualquier componente hijo:
const { isDarkMode, toggleDarkMode, setLightMode, setDarkMode, isLoaded } = useDarkMode();
```

### 2. DarkModeToggle
**Ubicación**: `/app/components/DarkModeToggle/DarkModeToggle.js`

Componente reutilizable para alternar entre modos:

```javascript
import DarkModeToggle from './components/DarkModeToggle/DarkModeToggle';

// Variante botón (por defecto)
<DarkModeToggle />

// Variante switch
<DarkModeToggle variant="switch" />

// Con clases personalizadas
<DarkModeToggle className="custom-classes" />
```

### 3. DarkModeExample
**Ubicación**: `/app/components/DarkModeExample/DarkModeExample.js`

Componente de ejemplo que muestra todas las funcionalidades implementadas.

## Configuración

### Tailwind CSS
El archivo `tailwind.config.js` ha sido actualizado para incluir:

```javascript
module.exports = {
  darkMode: 'class', // Habilita modo oscuro basado en clases
  // ... resto de configuración
};
```

### Layout Root
El archivo `app/layout.js` incluye:

- DarkModeProvider envolviendo toda la aplicación
- Clases de transición en el body
- Soporte para Toast notifications en modo oscuro

### CSS Global
Se han añadido utilidades CSS personalizadas en `app/globals.css`:

```css
.bg-primary-light { @apply bg-white dark:bg-gray-900; }
.bg-secondary-light { @apply bg-gray-50 dark:bg-gray-800; }
.text-primary { @apply text-gray-900 dark:text-white; }
.text-secondary { @apply text-gray-600 dark:text-gray-300; }
.border-primary { @apply border-gray-200 dark:border-gray-700; }
```

## Uso en Componentes Existentes

### Clases de Tailwind para Dark Mode
Usar el patrón `light:class dark:class` en elementos:

```javascript
// Fondos
className="bg-white dark:bg-gray-900"

// Texto  
className="text-gray-900 dark:text-white"

// Bordes
className="border-gray-200 dark:border-gray-700"

// Estados hover/focus
className="hover:bg-gray-100 dark:hover:bg-gray-800"
```

### Ejemplo de Componente Adaptado
```javascript
const MyComponent = () => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1>Título que se adapta al modo {isDarkMode ? 'oscuro' : 'claro'}</h1>
      <button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
        Botón adaptativo
      </button>
    </div>
  );
};
```

## Características

✅ **Auto-detección**: Detecta la preferencia del sistema operativo  
✅ **Persistencia**: Guarda la elección del usuario en localStorage  
✅ **SSR Compatible**: Previene hydration mismatches  
✅ **Transiciones suaves**: Animaciones CSS entre modos  
✅ **Flowbite Integration**: Compatible con componentes de Flowbite  
✅ **Iconos**: Incluye iconos de sol/luna (react-icons)  
✅ **Accesibilidad**: Botones con títulos descriptivos  

## Dependencias Instaladas

- `react-icons`: Para iconos de sol/luna en el toggle
- `flowbite` y `flowbite-react`: Ya estaban instalados

## Implementación en Página Principal

La página principal (`app/page.js`) ha sido actualizada para incluir:

- Toggle de modo oscuro en la esquina superior derecha
- Inputs adaptados con estilos dark/light
- Mensajes de estado con colores apropiados para cada modo
- Fondo `.fondoLogin` que se adapta automáticamente

## Próximos Pasos

1. **Actualizar componentes restantes**: Aplicar clases dark mode a todos los componentes existentes
2. **Testing**: Probar en diferentes navegadores y dispositivos  
3. **Personalización**: Ajustar colores específicos del brand si es necesario
4. **Performance**: Optimizar las transiciones si es requerido

## Notas de Desarrollo

- El contexto previene re-renders innecesarios
- Se usa `isLoaded` para prevenir flash de contenido incorrecto
- Las clases CSS siguen la convención de Tailwind para dark mode
- Compatible con Next.js 14 y App Router