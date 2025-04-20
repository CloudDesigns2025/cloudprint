import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { useRef, useEffect, useState } from 'react';
import useImage from 'use-image';

export default function EditorRemera({ colorRemera, imagenesCliente, setImagenesCliente, stageRef }) {
  const [mockupFrente] = useImage(`/Mockups/frente-${colorRemera}.png`);
  const [mockupEspalda] = useImage(`/Mockups/espalda-${colorRemera}.png`);
  const mockupNodeRefFrente = useRef(null);
  const mockupNodeRefEspalda = useRef(null);
  const [mockupSize, setMockupSize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState(null);

  // Detectar tamaño del mockup
  useEffect(() => {
    if (mockupFrente?.width && mockupFrente?.height) {
      setMockupSize({ width: mockupFrente.width, height: mockupFrente.height });
    }
  }, [mockupFrente]);

  // Deseleccionar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!stageRef.current?.container().contains(e.target)) {
        setSelectedId(null);
        window.dispatchEvent(new CustomEvent('imagen-seleccionada', { detail: null }));
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const actualizarProps = (index, nuevosProps) => {
    setImagenesCliente((prev) => {
      const copia = [...prev];
      copia[index] = { ...copia[index], props: nuevosProps };
      return copia;
    });
  };

  return (
    <div className="overflow-auto w-full flex justify-center">
      {mockupFrente && mockupEspalda && mockupSize.width > 0 && (
        <Stage
          width={mockupSize.width}
          height={mockupSize.height * 2 + 40} // 2 mockups + espacio entre ellos
          ref={stageRef}
          onMouseDown={(e) => {
            const clickedEmpty =
              e.target === e.target.getStage() ||
              e.target === mockupNodeRefFrente.current ||
              e.target === mockupNodeRefEspalda.current;
            if (clickedEmpty) {
              setSelectedId(null);
              window.dispatchEvent(new CustomEvent('imagen-seleccionada', { detail: null }));
            }
          }}
        >
          <Layer>
            {/* MOCKUP FRENTE */}
            <KonvaImage
              image={mockupFrente}
              ref={mockupNodeRefFrente}
              x={0}
              y={0}
            />

            {/* MOCKUP ESPALDA */}
            <KonvaImage
              image={mockupEspalda}
              ref={mockupNodeRefEspalda}
              x={0}
              y={mockupSize.height + 40}
            />

            {/* IMÁGENES CLIENTE */}
            {imagenesCliente.map((imagen, i) => (
              <URLImage
                key={i}
                index={i}
                imagen={imagen}
                isSelected={selectedId === i}
                onSelect={() => {
                  setSelectedId(i);
                  window.dispatchEvent(new CustomEvent('imagen-seleccionada', { detail: i }));
                }}
                onUpdate={(nuevoEstado) => actualizarProps(i, nuevoEstado)}
              />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
}

function URLImage({ imagen, isSelected, onSelect, onUpdate }) {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(imagen.src);
  const [props, setProps] = useState(imagen.props);

  useEffect(() => {
    if (isSelected && image && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, image]);

  return (
    <>
      <KonvaImage
        image={image}
        ref={shapeRef}
        draggable
        {...props}
        onClick={onSelect}
        onTap={onSelect}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          const nuevosProps = {
            ...props,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX,
            scaleY,
          };
          setProps(nuevosProps);
          onUpdate(nuevosProps);
        }}
        onDragEnd={(e) => {
          const nuevosProps = {
            ...props,
            x: e.target.x(),
            y: e.target.y(),
          };
          setProps(nuevosProps);
          onUpdate(nuevosProps);
        }}
      />
      {isSelected && image && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          anchorSize={14}
          borderStrokeWidth={2}
          anchorStrokeWidth={2}
        />
      )}
    </>
  );
}
