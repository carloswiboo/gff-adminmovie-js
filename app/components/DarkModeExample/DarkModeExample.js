'use client';

import React from 'react';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { Card, Button } from 'flowbite-react';
import { useDarkMode } from '../DarkModeProvider/DarkModeProvider';

const DarkModeExample = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="p-6 space-y-6">
      {/* Header with toggle */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          Girona Film Festival - {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
        </h1>
        <div className="flex items-center space-x-4">
          {/* Button variant */}
          <DarkModeToggle variant="button" />
          {/* Switch variant */}
          <DarkModeToggle variant="switch" />
        </div>
      </div>

      {/* Example content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary-light border-primary">
          <h5 className="text-xl font-bold text-primary">
            Administración de Películas
          </h5>
          <p className="text-secondary">
            Gestiona tus películas y descarga certificados fácilmente. 
            El modo oscuro mejora la experiencia visual durante largos períodos de uso.
          </p>
          <Button color="blue" size="sm">
            Explorar funciones
          </Button>
        </Card>

        <Card className="bg-secondary-light border-primary">
          <h5 className="text-xl font-bold text-primary">
            Características del Modo Oscuro
          </h5>
          <ul className="text-secondary space-y-2">
            <li>• Reduce la fatiga visual</li>
            <li>• Ahorra batería en pantallas OLED</li>
            <li>• Mejor experiencia nocturna</li>
            <li>• Guarda tu preferencia automáticamente</li>
          </ul>
        </Card>
      </div>

      {/* Login background example */}
      <div className="fondoLogin rounded-lg p-8 text-center text-white min-h-[200px] flex items-center justify-center">
        <div className="bg-black/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Fondo de Login Adaptativo</h3>
          <p>El fondo se adapta automáticamente al modo seleccionado</p>
        </div>
      </div>
    </div>
  );
};

export default DarkModeExample;