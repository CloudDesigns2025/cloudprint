import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useEffect } from 'react';

export default function EditorRemera({ colorRemera, lado, imagenesCliente, setImagenesCliente, stageRef }) {
  const [mockup] = useImage(`/Mockups/${lado}-${colorRemera}.png`);

  const handleDragEnd = (e, index) => {
    const nuevaLista = [...imagenesCliente];
    nuevaLista[index].props.x = e.target.x();
    nuevaLista[index].props.y = e.target.y();
    setImagenesCliente(nuevaLista);
  };

  const handleTransformEnd = (e, index) => {
    const node = e.target;
    const nuevaLista = [...imagenesCliente];
    nuevaLista[index].props = {
      ...nuevaLista[index].props,
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    };
    setImagenesCliente(nuevaLista);
  };

  const handleClick = (index) => {
    const event = new CustomEvent('imagen-seleccionada', { detail: index });
    window.dispatchEvent(event);
  };

  return (
    <Stage width={400} height={500} ref={stageRef}>
      <Layer>
        {mockup && <KonvaImage image={mockup} width={400} height={500} />}
        {imagenesCliente.map((img, index) => {
          const [imagen] = useImage(img.src);
          return (
            <KonvaImage
              key={index}
              image={imagen}
              draggable
              onClick={() => handleClick(index)}
              onTap={() => handleClick(index)}
              onDragEnd={(e) => handleDragEnd(e, index)}
              onTransformEnd={(e) => handleTransformEnd(e, index)}
              {...img.props}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}
