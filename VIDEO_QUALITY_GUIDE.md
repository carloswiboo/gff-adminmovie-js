# Guía de Configuración de Calidad de Video

## Opciones de Calidad Disponibles

### 🎬 Cinema Quality (cinema_quality)
- **Recomendado para festivales de cine**
- Resolución: Mantiene la resolución original
- Frame Rate: 24fps (estándar cinematográfico)
- Codec: H.264 con AAC audio
- **Uso**: Ideal para proyecciones profesionales y festivales

### 📹 Source Quality (source)
- **Calidad original del archivo**
- Resolución: Sin cambios
- Codec: Mantiene configuración original
- **Uso**: Cuando quieres preservar exactamente la calidad original

### 🔥 Ultra HD 4K (uhd_4k)
- **Requiere plan Vimeo Pro+ o superior**
- Resolución: Hasta 4K UHD
- Codec: H.264 optimizado para alta resolución
- **Uso**: Contenido de máxima calidad para pantallas grandes

### 📺 Full HD 1080p (fhd_1080p)
- Resolución: 1920x1080
- Frame Rate: 30fps
- Codec: H.264 con AAC
- **Uso**: Calidad alta para visualización online estándar

### 💻 HD 720p (hd_720p)
- Resolución: 1280x720
- Frame Rate: 30fps
- Codec: H.264 con AAC
- **Uso**: Buen balance entre calidad y tamaño de archivo

### 🌐 Web Optimized (web_optimized)
- **Streaming adaptivo**
- Múltiples resoluciones generadas automáticamente
- Se adapta a la conexión del espectador
- **Uso**: Para distribución web con audiencias diversas

### 📱 SD 480p (sd_480p)
- Resolución: 640x480
- Frame Rate: 24fps
- Optimizado para dispositivos móviles
- **Uso**: Carga rápida, ideal para conexiones lentas

## Configuración en el Frontend

El selector de calidad está integrado en `UploadVideoToVimeoComponent` y permite:

1. Selección visual con iconos y descripciones
2. Información contextual sobre cada opción
3. Recomendación automática para festivales (Cinema Quality)

## Configuración en el Backend

El endpoint `/api/uploadvideo` procesa el parámetro `quality` y aplica:

```javascript
// Ejemplo de configuración
{
  transcode: {
    quality: 'source',
    video_codec: 'h264',
    audio_codec: 'aac',
    fps: 24
  }
}
```

## Consideraciones Técnicas

### Planes de Vimeo
- **Basic/Plus**: Hasta 1080p
- **Pro/Business/Premium**: Hasta 4K, más opciones de codec
- **Enterprise**: Configuraciones personalizadas

### Tiempo de Procesamiento
- **Source/Cinema**: Procesamiento mínimo
- **HD/FHD**: 5-15 minutos típico
- **4K**: 15-30+ minutos
- **Adaptive**: 10-20 minutos (genera múltiples versiones)

### Recomendaciones por Uso

| Caso de Uso | Calidad Recomendada | Razón |
|-------------|-------------------|--------|
| Festival de Cine | `cinema_quality` | Estándar profesional 24fps |
| Distribución Web | `web_optimized` | Adaptabilidad automática |
| Archivo/Backup | `source` | Preserva original |
| Móvil/Rápido | `sd_480p` | Carga rápida |
| Pantallas Grandes | `uhd_4k` | Máxima definición |

## Implementación Personalizada

Para casos especiales, puedes extender las configuraciones en:

```javascript
// En /api/uploadvideo/route.js
const configs = {
  'custom_festival': {
    transcode: {
      quality: 'source',
      video_codec: 'h264',
      audio_codec: 'aac',
      fps: 25, // PAL estándar
      bitrate: '10000k' // Alta calidad
    }
  }
};
```

## Monitoreo y Debug

El sistema registra en consola:
- Configuración de calidad seleccionada
- Respuesta completa de Vimeo
- Errores de transcoding

Logs disponibles:
```javascript
console.log('Quality config applied:', qualityConfig);
console.log('Vimeo upload response:', result);
```