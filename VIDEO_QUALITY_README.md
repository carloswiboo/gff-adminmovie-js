# Control de Calidad de Video - Girona Film Festival

## 🎬 Nueva Funcionalidad: Selección de Calidad de Video

Ahora puedes controlar la calidad específica con la que se procesan y almacenan los videos en Vimeo. Esta funcionalidad está especialmente optimizada para festivales de cine.

## 📋 Características Implementadas

### 1. **Selector de Calidad Intuitivo**
- Interfaz visual con iconos y descripciones
- 7 opciones predefinidas de calidad
- Información contextual sobre cada opción
- Advertencias para opciones que requieren plan Pro+

### 2. **Opciones de Calidad Disponibles**

| Opción | Resolución | FPS | Codec | Uso Recomendado |
|--------|------------|-----|-------|-----------------|
| 🎬 **Cinema Quality** | Original | 24fps | H.264+AAC | **Festivales de cine** |
| 📹 **Source Quality** | Original | Original | Original | Archivo/backup |
| 🔥 **Ultra HD 4K** | Hasta 4K | 30fps | H.264+AAC | Pantallas grandes |
| 📺 **Full HD 1080p** | 1920x1080 | 30fps | H.264+AAC | Web estándar |
| 💻 **HD 720p** | 1280x720 | 30fps | H.264+AAC | Balance calidad/tamaño |
| 🌐 **Web Optimized** | Adaptivo | Variable | H.264+AAC | Múltiples dispositivos |
| 📱 **SD 480p** | 640x480 | 24fps | H.264+AAC | Móviles/carga rápida |

### 3. **Componentes Actualizados**

#### `UploadVideoToVimeoComponent`
- Selector de calidad integrado
- Tarjeta informativa dinámica
- Envío del parámetro `quality` al backend

#### `VideoQualityInfo` (Nuevo)
- Muestra información detallada de la calidad seleccionada
- Indicadores visuales con colores
- Estimación de tiempo de procesamiento

#### `useVideoQuality` Hook (Nuevo)
- Lógica reutilizable para manejo de calidad
- Configuraciones predefinidas
- Utilidades para validación

### 4. **API Backend Mejorada**

#### Endpoint: `/api/uploadvideo`
```javascript
// Ahora acepta parámetro quality
{
  "filename": "movie.mp4",
  "size": 1024000,
  "tokendata": "jwt_token",
  "quality": "cinema_quality"  // ← NUEVO
}
```

#### Configuraciones Aplicadas
```javascript
// Ejemplo: Cinema Quality
{
  transcode: {
    quality: 'source',
    video_codec: 'h264',
    audio_codec: 'aac',
    fps: 24
  }
}
```

### 5. **Logging Mejorado**
```javascript
console.log('Quality selected:', quality);
console.log('Quality config applied:', qualityConfig);
console.log('Video details:', { name, size, filename });
```

## 🚀 Cómo Usar

### Para Desarrolladores

1. **Importar el hook**:
```javascript
import { useVideoQuality } from "../hooks/useVideoQuality";
```

2. **Usar en componente**:
```javascript
const { selectedQuality, setSelectedQuality, qualityOptions } = useVideoQuality('cinema_quality');
```

3. **Enviar al backend**:
```javascript
body: JSON.stringify({
  filename: file.name,
  size: file.size,
  tokendata: token,
  quality: selectedQuality
})
```

### Para Usuarios del Festival

1. **Seleccionar archivo de video**
2. **Elegir calidad apropiada**:
   - 🎬 **Cinema Quality**: Recomendado para festivales
   - 📹 **Source**: Para preservar calidad exacta
   - 🌐 **Web Optimized**: Para distribución web
3. **Subir video** - la calidad se aplica automáticamente

## ⚙️ Configuración Técnica

### Variables de Entorno (Sin cambios)
```env
VIMEO_CLIENT_ID=your_client_id
VIMEO_CLIENT_SECRET=your_client_secret
VIMEO_TOKEN=your_access_token
```

### Consideraciones de Planes Vimeo

- **Basic/Plus**: Hasta 1080p
- **Pro/Business/Premium**: Hasta 4K + opciones avanzadas
- **Enterprise**: Configuraciones personalizadas

### Tiempo de Procesamiento Estimado

| Calidad | Archivo 1GB | Archivo 5GB | Archivo 10GB |
|---------|-------------|-------------|--------------|
| Cinema/Source | 2-5 min | 8-15 min | 15-30 min |
| 4K UHD | 3-8 min | 12-25 min | 25-45 min |
| 1080p/720p | 2-6 min | 10-20 min | 20-35 min |
| Web Optimized | 3-10 min | 15-30 min | 30-50 min |

## 🔧 Personalización

### Agregar Nueva Calidad

1. **En el hook** (`useVideoQuality.js`):
```javascript
// Agregar a VIDEO_QUALITY_OPTIONS
{
  value: 'custom_festival',
  label: '🏆 Custom Festival Quality',
  description: 'Special quality for your festival',
  isDefault: false,
  isPro: false
}

// Agregar configuración
const configs = {
  'custom_festival': {
    transcode: {
      quality: 'source',
      video_codec: 'h264',
      audio_codec: 'aac',
      fps: 25, // PAL standard
      bitrate: '8000k'
    }
  }
};
```

2. **Actualizar componente de información** (`VideoQualityInfo.js`)

### Modificar Configuración Existente

Editar las configuraciones en `/api/uploadvideo/route.js`:

```javascript
const getQualityConfig = (qualityLevel) => {
  const configs = {
    'cinema_quality': {
      transcode: {
        quality: 'source',
        video_codec: 'h264',
        audio_codec: 'aac',
        fps: 24,
        // Agregar más opciones aquí
        bitrate: 'auto',
        audio_bitrate: '320k'
      }
    }
  };
  return configs[qualityLevel] || configs['adaptive'];
};
```

## 📊 Monitoreo y Debug

### Logs Disponibles
- Configuración de calidad seleccionada
- Parámetros enviados a Vimeo
- Respuesta completa de Vimeo
- Tiempo de procesamiento

### Verificar Configuración
1. Abrir Developer Tools
2. Ir a Network tab
3. Subir video
4. Revisar request a `/api/uploadvideo`
5. Verificar parámetro `quality` en el body

## 🎯 Casos de Uso

### Festival de Cine Profesional
```
Calidad: Cinema Quality (24fps)
Razón: Estándar cinematográfico profesional
Tiempo: Mínimo procesamiento
```

### Distribución Web General
```
Calidad: Web Optimized (Adaptivo)
Razón: Se adapta automáticamente a cada espectador
Tiempo: Medio (genera múltiples versiones)
```

### Archivo de Alta Calidad
```
Calidad: Source Quality
Razón: Preserva exactamente el archivo original
Tiempo: Mínimo procesamiento
```

### Móvil/Redes Lentas
```
Calidad: SD 480p
Razón: Carga rápida, compatible móvil
Tiempo: Rápido procesamiento
```

---

## 📝 Archivos Modificados/Creados

### Modificados:
- `app/api/uploadvideo/route.js` - Lógica de calidad en backend
- `app/components/UploadVideoToVimeoComponent/UploadVideoToVimeoComponent.js` - Selector UI

### Creados:
- `app/components/VideoQualityInfo/VideoQualityInfo.js` - Componente informativo
- `app/hooks/useVideoQuality.js` - Hook reutilizable
- `VIDEO_QUALITY_GUIDE.md` - Guía técnica detallada

## 🏁 Próximos Pasos

1. **Testear con diferentes tipos de archivos**
2. **Monitorear tiempos de procesamiento reales**
3. **Agregar configuraciones personalizadas según necesidades específicas**
4. **Implementar presets por tipo de proyecto/festival**

¡Disfruta de la nueva funcionalidad de control de calidad de video! 🎬✨