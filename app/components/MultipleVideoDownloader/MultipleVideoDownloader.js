'use client';

import { useState } from 'react';

export default function MultipleVideoDownloader() {
    const [videoIds, setVideoIds] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState([]);
    const [currentDownload, setCurrentDownload] = useState(null);

    const downloadVideoById = async (videoId, index, total) => {
        try {
            setCurrentDownload({ videoId, index: index + 1, total });
            
            const response = await fetch(`/api/downloadvideoandsubtitles?idvideovimeo=${videoId}`);
            
            if (!response.ok) {
                throw new Error(`Error downloading video ${videoId}: ${response.status}`);
            }

            // Obtener el nombre del archivo desde el header Content-Disposition
            const contentDisposition = response.headers.get('content-disposition');
            let filename = `video_${videoId}.zip`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename=(.+)/);
                if (filenameMatch) {
                    filename = filenameMatch[1].replace(/"/g, '');
                }
            }

            // Crear un blob con la respuesta
            const blob = await response.blob();
            
            // Crear un enlace temporal para descargar el archivo
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Actualizar el progreso
            setDownloadProgress(prev => [
                ...prev,
                { videoId, status: 'success', filename }
            ]);

        } catch (error) {
            console.error('Error downloading video:', error);
            setDownloadProgress(prev => [
                ...prev,
                { videoId, status: 'error', error: error.message }
            ]);
        }
    };

    const handleDownloadAll = async () => {
        const ids = videoIds
            .split(',')
            .map(id => id.trim())
            .filter(id => id.length > 0);

        if (ids.length === 0) {
            alert('Por favor, ingresa al menos un ID de video');
            return;
        }

        setIsDownloading(true);
        setDownloadProgress([]);
        setCurrentDownload(null);

        try {
            // Descargar uno por uno secuencialmente
            for (let i = 0; i < ids.length; i++) {
                await downloadVideoById(ids[i], i, ids.length);
                
                // Esperar un poco entre descargas para no sobrecargar
                if (i < ids.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        } catch (error) {
            console.error('Error in download process:', error);
        } finally {
            setIsDownloading(false);
            setCurrentDownload(null);
        }
    };

    const handleClearAll = () => {
        setVideoIds('');
        setDownloadProgress([]);
        setCurrentDownload(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Descargador de Múltiples Videos
            </h2>

            <div className="space-y-4">
                {/* Área de texto para IDs */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        IDs de Videos (separados por comas):
                    </label>
                    <textarea
                        value={videoIds}
                        onChange={(e) => setVideoIds(e.target.value)}
                        placeholder="Ejemplo: 123456789, 987654321, 555666777"
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={isDownloading}
                    />
                </div>

                {/* Botones */}
                <div className="flex space-x-4">
                    <button
                        onClick={handleDownloadAll}
                        disabled={isDownloading || !videoIds.trim()}
                        className={`px-6 py-2 rounded-md font-medium transition-colors ${
                            isDownloading || !videoIds.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                                : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                        }`}
                    >
                        {isDownloading ? 'Descargando...' : 'Descargar Todos'}
                    </button>

                    <button
                        onClick={handleClearAll}
                        disabled={isDownloading}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Limpiar Todo
                    </button>
                </div>

                {/* Indicador de descarga actual */}
                {currentDownload && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-4">
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
                            <span className="text-blue-700 dark:text-blue-300">
                                Descargando video {currentDownload.index} de {currentDownload.total}: ID {currentDownload.videoId}
                            </span>
                        </div>
                    </div>
                )}

                {/* Progreso de descargas */}
                {downloadProgress.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Progreso de Descargas:
                        </h3>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {downloadProgress.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-3 rounded-md ${
                                        item.status === 'success'
                                            ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700'
                                            : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-700'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        {item.status === 'success' ? (
                                            <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        <span className={`font-medium ${
                                            item.status === 'success' 
                                                ? 'text-green-800 dark:text-green-300' 
                                                : 'text-red-800 dark:text-red-300'
                                        }`}>
                                            Video ID: {item.videoId}
                                        </span>
                                    </div>
                                    <div className={`text-sm ${
                                        item.status === 'success'
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {item.status === 'success' 
                                            ? `Descargado: ${item.filename}` 
                                            : `Error: ${item.error}`
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resumen final */}
                {!isDownloading && downloadProgress.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Resumen:</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-green-600 dark:text-green-400">
                                ✓ {downloadProgress.filter(item => item.status === 'success').length} exitosos
                            </span>
                            {downloadProgress.filter(item => item.status === 'error').length > 0 && (
                                <span className="ml-4 text-red-600 dark:text-red-400">
                                    ✗ {downloadProgress.filter(item => item.status === 'error').length} con errores
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}