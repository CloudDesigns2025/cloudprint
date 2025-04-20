import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const EditorRemera = dynamic(() => import('@/components/EditorRemera'), { ssr: false });

const coloresDisponibles = ['amarilla', 'beneton', 'blanca', 'botella', 'francia', 'marino', 'naranja', 'negra', 'roja'];

export default function Personalizar() {
  const [imagenesCliente, setImagenesCliente] = useState([]);
  const [colorRemera, setColorRemera] = useState('blanca');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const handler = (e) => setSelectedIndex(e.detail);
    window.addEventListener('imagen-seleccionada', handler);
    return () => window.removeEventListener('imagen-seleccionada', handler);
  }, []);

  const handleImagenChange = (e) => {
    const archivos = e.target.files;
    const nuevasImagenes = [];

    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        nuevasImagenes.push(reader.result);
        if (nuevasImagenes.length === archivos.length) {
          setImagenesCliente((prev) => [
            ...prev,
            ...nuevasImagenes.map((src) => ({
              src,
              props: {
                x: 100,
                y: 150,
                scaleX: 0.5,
                scaleY: 0.5,
                rotation: 0,
              },
            })),
          ]);
        }
      };
      reader.readAsDataURL(archivo);
    }
  };

  const handleColorChange = (color) => {
    setColorRemera(color);
  };

  const handleEnviarWhatsApp = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });

    const link = document.createElement('a');
    link.download = `diseño-cloudprint-${Date.now()}.png`;
    link.href = uri;
    link.click();

    const mensajeFinal = `Hola, soy ${nombre}. Mi número es ${telefono}.
Este es mi diseño para estampar. Detalles:\n${mensaje}`;

    const linkWhatsApp = `https://wa.me/541123932163?text=${encodeURIComponent(mensajeFinal)}`;
    window.open(linkWhatsApp, '_blank');

    setEnviado(true);
  };

  const handleCerrarMensaje = () => {
    setEnviado(false);
    setNombre('');
    setTelefono('');
    setMensaje('');
    setImagenesCliente([]);
    setColorRemera('blanca');
    setSelectedIndex(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarImagenSeleccionada = () => {
    if (selectedIndex === null) return;
    const confirmacion = confirm('¿Seguro que querés eliminar la imagen seleccionada?');
    if (!confirmacion) return;
    const nuevaLista = imagenesCliente.filter((_, index) => index !== selectedIndex);
    setImagenesCliente(nuevaLista);
    setSelectedIndex(null);
  };

  const borrarTodasLasImagenes = () => {
    const confirmacion = confirm('¿Seguro que querés borrar todas las imágenes?');
    if (confirmacion) {
      setImagenesCliente([]);
      setSelectedIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-2 text-center">Sé tu mismo el diseñador</h1>

      <p className="text-gray-300 mb-6 text-center max-w-2xl text-lg">
        Subí tu imagen, visualizá tu diseño y disfrutá tu pedido YA MISMO!
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

            {/* Mockup de frente */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-2">Frente</h3>
              <EditorRemera
                colorRemera={`frente-${colorRemera}`}
                imagenesCliente={imagenesCliente}
                setImagenesCliente={setImagenesCliente}
                stageRef={stageRef}
              />
            </div>

            {/* Mockup de espalda */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-2">Espalda</h3>
              <EditorRemera
                colorRemera={`espalda-${colorRemera}`}
                imagenesCliente={imagenesCliente}
                setImagenesCliente={setImagenesCliente}
                stageRef={stageRef}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <button
                onClick={eliminarImagenSeleccionada}
                disabled={selectedIndex === null}
                className={`px-4 py-2 rounded font-medium ${
                  selectedIndex === null
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                Eliminar imagen seleccionada
              </button>

              <button
                onClick={borrarTodasLasImagenes}
                className="px-4 py-2 rounded font-medium bg-red-600 hover:bg-red-700 text-white"
              >
                Borrar todas
              </button>
            </div>
          </div>

          <div className="mt-10 max-w-xl w-full bg-gray-800 p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Tus datos:</h3>

            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mb-4 w-full p-2 rounded bg-gray-900 border border-gray-600 text-white"
            />

            <input
              type="tel"
              placeholder="Tu teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="mb-4 w-full p-2 rounded bg-gray-900 border border-gray-600 text-white"
            />

            <textarea
              placeholder="Comentario o detalle del pedido..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={3}
              className="mb-4 w-full p-2 rounded bg-gray-900 border border-gray-600 text-white"
            />

            <button
              onClick={handleEnviarWhatsApp}
              className="bg-green-500 text-white font-bold px-6 py-2 rounded-full hover:bg-green-600 transition"
            >
              Enviar por WhatsApp
            </button>
          </div>

          {enviado && (
            <div className="mt-8 bg-green-600 p-6 text-white rounded-lg max-w-xl text-center shadow-lg">
              <h2 className="text-2xl font-bold mb-2">¡Listo! 🎉</h2>
              <p className="mb-2">Tu diseño fue enviado con éxito a nuestro equipo.</p>
              <p className="mb-2 font-semibold">
                Gracias por confiar en <span className="text-cyan-300">CloudPrint 💙</span>
              </p>
              <p className="text-sm mb-4">
                En breve te vamos a responder por WhatsApp para confirmar tu pedido y coordinar la producción.
                <br />
                Mientras tanto, ¡seguí creando y personalizando lo que se te ocurra!
              </p>
              <button
                onClick={handleCerrarMensaje}
                className="bg-white text-green-700 font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition"
              >
                Cerrar
              </button>
            </div>
          )}
        </>
      )}

      <p className="text-xs text-gray-500 mt-10 text-center max-w-md">
        🔒 Tu diseño no se guarda, solo lo usamos para mostrarte cómo quedaría en la remera.
      </p>
    </div>
  );
}
