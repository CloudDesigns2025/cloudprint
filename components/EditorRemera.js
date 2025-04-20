import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { useRef, useEffect, useState } from 'react';
import useImage from 'use-image';

export default function EditorRemera({ colorRemera, imagenesCliente, setImagenesCliente, stageRef }) {
  const [mockup] = useImage(`/Mockups/${colorRemera}.png`);
  const mockupNodeRef = useRef(null);
  const containerRef = useRef(null);
  const [mockupSize, setMockupSize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState(null);

  // Escalar solo si el ancho de pantalla es menor a 768px
  useEffect(() => {
    if (mockup?.width && mockup?.height) {
      const isMobile = window.innerWidth < 768;
      const scaleFactor = isMobile ? 0.7 : 1; // podés ajustar el 0.7
      setMockupSize({ width: mockup.width * scaleFactor, height: mockup.height * scaleFactor });
    }
  }, [mockup]);

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
    <div ref={containerRef} className="w-full flex justify-center overflow-auto">
      {mockup && mockupSize.width > 0 && (
        <Stage
          width={mockupSize.width}
          height={mockupSize.height}
          ref={stageRef}
          onMouseDown={(e) => {
            const clickedEmpty =
              e.target === e.target.getStage() || e.target === mockupNodeRef.current;
            if (clickedEmpty) {
              setSelectedId(null);
              window.dispatchEvent(new CustomEvent('imagen-seleccionada', { detail: null }));
            }
          }}
        >
          <Layer>
            <KonvaImage image={mockup} ref={mockupNodeRef} />
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
