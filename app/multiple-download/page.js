import MultipleVideoDownloader from '@/app/components/MultipleVideoDownloader/MultipleVideoDownloader';
import DarkModeToggle from '@/app/components/DarkModeToggle/DarkModeToggle';
import Head from 'next/head';
import Image from 'next/image';

export default function MultipleDownloadPage() {
    return (
        <>
            <Head>
                <title>Descarga Múltiple de Videos - Girona Film Festival</title>
            </Head>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                {/* Header */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center">
                            <img
                                src="https://www.gironafilmfestival.com/wp-content/uploads/2022/08/logo-girona-film-festival.png"
                                className="w-16 h-16 mr-4"
                                alt="Girona Film Festival Logo"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Descarga Múltiple de Videos
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">
                                    Girona Film Festival - Herramienta de Administración
                                </p>
                            </div>
                        </div>
                        <DarkModeToggle />
                    </div>

                    {/* Instrucciones */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                            📋 Instrucciones de Uso
                        </h2>
                        <div className="text-blue-700 dark:text-blue-300 space-y-2">
                            <p>• Ingresa los IDs de video de Vimeo separados por comas en el área de texto</p>
                            <p>• Haz clic en Descargar Todos para iniciar el proceso</p>
                            <p>• Los videos se descargarán uno por uno de forma secuencial</p>
                            <p>• Cada descarga incluirá el video y sus subtítulos (si los tiene)</p>
                            <p>• Los archivos se guardarán como ZIP con el nombre de la película</p>
                        </div>
                    </div>

                    {/* Componente principal */}
                    <MultipleVideoDownloader />

                    {/* Información adicional */}
                    <div className="mt-12 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                            ℹ️ Información Importante
                        </h3>
                        <div className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
                            <p>• Las descargas se procesan de forma secuencial para evitar sobrecargar el servidor</p>
                            <p>• Si una descarga falla, el proceso continuará con los siguientes videos</p>
                            <p>• Los archivos se descargarán en la calidad más alta disponible (1080p → 720p → primera disponible)</p>
                            <p>• Los subtítulos se incluyen automáticamente si están disponibles en el video</p>
                            <p>• El navegador puede solicitar permiso para descargas múltiples</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}