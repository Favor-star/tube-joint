
import { useMemo } from "react"
import * as THREE from "three";
// --- 2. HOLLOW TUBE GEOMETRY GENERATOR ---
// This creates the custom shape for the ExtrudeGeometry
interface TubeGeometryProps {
  width: number;
  height: number;
  thickness: number;
  length: number;
}

export const TubeGeometry: React.FC<TubeGeometryProps> = ({
  width,
  height,
  thickness,
  length,
}) => {
  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = width / 2;
    const h = height / 2;

    // Outer Rectangle
    shape.moveTo(-w, -h);
    shape.lineTo(w, -h);
    shape.lineTo(w, h);
    shape.lineTo(-w, h);
    shape.lineTo(-w, -h);

    // Inner Hole (Counter-clockwise for holes)
    const hole = new THREE.Path();
    const iw = w - thickness;
    const ih = h - thickness;
    hole.moveTo(-iw, -ih);
    hole.lineTo(iw, -ih);
    hole.lineTo(iw, ih);
    hole.lineTo(-iw, ih);
    hole.lineTo(-iw, -ih);

    shape.holes.push(hole);
    return shape;
  }, [width, height, thickness]);

  const settings = useMemo(
    () => ({
      depth: length,
      bevelEnabled: false,
      steps: 1,
    }),
    [length]
  );

  return <extrudeGeometry args={[shape, settings]} />;
};
