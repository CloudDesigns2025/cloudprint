import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Cloud Print – Cloud Designs Argentina</title>
        <meta
          name="description"
          content="La herramienta oficial de Cloud Designs Argentina para personalizar productos."
        />
      </Head>

      {/* HERO: VIDEO DE FONDO */}
<div className="relative w-full h-[30vh] sm:h-[40vh] md:h-[70vh] flex items-center justify-center overflow-hidden m-0 p-0 leading-none">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute w-full h-full object-contain sm:object-cover z-0"
  >
    <source src="/Videos/CLOUD.mp4" type="video/mp4" />
    Tu navegador no soporta video HTML5.
  </video>

  {/* Texto encima del video */}
 <div className="relative z-10 flex flex-col items-center justify-center text-white px-4 text-center translate-y-20 sm:translate-y-12 md:translate-y-30">
    <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold drop-shadow-xl mb-2">
      Cloud Print
    </h1>
    <p className="text-base sm:text-xl md:text-2xl text-cyan-300 font-semibold">
      es una herramienta de Cloud Designs Argentina
    </p>
  </div>
</div>

      {/* DESCRIPCIÓN */}
      <div className="bg-black text-white px-6 text-center">
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed py-8 sm:py-10">
          Desarrollada con tecnología web de última generación, Cloud Print ofrece una experiencia rápida, intuitiva y visual que transforma tus ideas en productos personalizados.
          Visualizá tus diseños en tiempo real y llevá tu creatividad directo a remeras, tazas, bolsos, morrales... o lo que se te ocurra.
        </p>
      </div>

      {/* BENEFICIOS */}
      <section className="bg-gray-900 text-gray-200 px-6 py-16 text-center">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

          {/* BENEFICIO 1 */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">🧠</div>
            <h3 className="text-xl font-bold text-white">Fácil de usar</h3>
            <p className="text-base sm:text-sm text-gray-300">
              No necesitás ser diseñador ni tener experiencia previa.<br />
              Subí tu imagen, elegí el producto y ¡listo!<br />
              Desde tu celu o compu, diseñás en segundos. Así de simple.
            </p>
          </div>

          {/* BENEFICIO 2 */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">🛒</div>
            <h3 className="text-xl font-bold text-white">Diseñás y comprás en un solo lugar</h3>
            <p className="text-base sm:text-sm text-gray-300">
              Cloud Print te permite crear, visualizar y hacer tu pedido sin salir de la página.<br />
              Todo rápido, directo y sin complicaciones.<br />
              Elegís, personalizás y lo mandás a producción al instante.
            </p>
          </div>

          {/* BENEFICIO 3 */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">📱</div>
            <h3 className="text-xl font-bold text-white">Pedido directo a WhatsApp</h3>
            <p className="text-base sm:text-sm text-gray-300">
              Una vez que tenés tu diseño listo, lo enviás con un solo clic a nuestro WhatsApp.<br />
              Recibimos tu mockup, lo revisamos y coordinamos la producción al toque.<br />
              ¡Cero vueltas, todo al instante!
            </p>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-12 text-center">
          <Link href="/personalizar" passHref>
            <a className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white text-lg sm:text-xl font-bold px-8 sm:px-10 py-4 rounded-full shadow-lg transition duration-300">
              🚀 Probar Cloud Print ahora
            </a>
          </Link>
          <p className="text-sm sm:text-base text-gray-400 mt-3">
            No hace falta registrarte. Es gratis y al toque.
          </p>
        </div>
      </section>
    </>
  );
}
