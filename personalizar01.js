import { useState } from 'react';
import dynamic from 'next/dynamic';

const EditorRemera = dynamic(() => import('@/components/EditorRemera'), { ssr: false });

const coloresDisponibles = ['amarilla', 'beneton','blanca', 'botella', 'francia', 'marino', 'naranja', 'negra', 'roja'];

export default function Personalizar() {
  const [imagenesCliente, setImagenesCliente] = useState([]);
  const [colorRemera, setColorRemera] = useState('blanca');

  const handleImagenChange = (e) => {
    const archivos = e.target.files;
    const nuevasImagenes = [];

    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        nuevasImagenes.push(reader.result);
        if (nuevasImagenes.length === archivos.length) {
          setImagenesCliente((prev) => [...prev, ...nuevasImagenes]);
        }
      };
      reader.readAsDataURL(archivo);
    }
  };

  const handleColorChange = (color) => {
    setColorRemera(color);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-2 text-center">Sé tu mismo el diseñador</h1>

      <p className="text-gray-300 mb-6 text-center max-w-2xl text-lg">
        Subí tu imagen, visualizá tu diseño y disfruta tu pedido YA MISMO!
        <br />
        ¡Creá una prenda 100% única y lista para estampar!
      </p>

      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-xl shadow-md">
        <label className="block text-sm font-semibold text-white mb-2">
          Seleccioná uno o más archivos (JPG, PNG o PDF) para empezar a personalizar:
        </label>

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleImagenChange}
          multiple
          className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-700 focus:outline-none"
        />

        <p className="text-sm text-gray-400 mt-2 italic">
          Asegurate de que tu diseño tenga buena calidad y fondo transparente para mejores resultados.
        </p>
      </div>

      {imagenesCliente.length > 0 && (
        <>
          <div className="mt-10 text-center">
            <h2 className="text-xl font-semibold mb-4">Elegí el color de la remera:</h2>
            <div className="flex gap-3 flex-wrap justify-center mb-6">
              {coloresDisponibles.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`px-4 py-2 rounded-full font-medium border ${
                    colorRemera === color ? 'bg-white text-black' : 'bg-gray-700'
                  }`}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </button>
              ))}
            </div>

            <EditorRemera colorRemera={colorRemera} imagenesCliente={imagenesCliente} />
          </div>
        </>
      )}

      <p className="text-xs text-gray-500 mt-10 text-center max-w-md">
        🔒 Tu diseño no se guarda, solo lo usamos para mostrarte cómo quedaría en la remera.
      </p>
    </div>
  );
}