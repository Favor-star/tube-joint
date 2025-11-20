import { Edges, useCursor } from "@react-three/drei";
import { useState, useRef } from "react";
import { type InitialStateProps } from "../store";
import { useTubeStore } from "../store";
import { OBB } from "three-stdlib";
import { TubeGeometry } from "./tube-geometry";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
// --- 3. THE TUBE COMPONENT ---
export const Tube = ({ data }: { data: InitialStateProps["tubes"][0] }) => {
  const meshRef = useRef<Mesh>(null);
  const { selectedId, select, tubes } = useTubeStore();
  const isSelected = selectedId === data.id;

  const [hovered, setHover] = useState(false);
  const [isColliding, setIsColliding] = useState(false);

  useCursor(hovered);

  // COLLISION LOGIC (OBB) [cite: 19]
  useFrame(() => {
    if (!meshRef.current) return;

    // 1. Update my OBB
    // Note: We must update world matrix to get accurate current position during drag
    meshRef.current.updateMatrixWorld();
    const geometry = meshRef.current.geometry;
    geometry.computeBoundingBox();

    const myOBB = new OBB().fromBox3(geometry.boundingBox);
    myOBB.applyMatrix4(meshRef.current.matrixWorld);

    // 2. Check against ALL other tubes
    let collisionFound = false;

    for (let otherTubeData of tubes) {
      if (otherTubeData.id === data.id) continue; // Don't check against self

      // We need to find the THREE object of the other tube.
      // In a real large app, we might map refs in the store.
      // For this challenge, we query the scene graph by name/userdata is easiest.
      const otherObject = meshRef.current.parent.getObjectByName(
        otherTubeData.id
      );

      if (otherObject) {
          const otherGeo = otherObject.geometry;
        otherGeo.computeBoundingBox();
        const otherOBB = new OBB().fromBox3(otherGeo.boundingBox);
        otherOBB.applyMatrix4(otherObject.matrixWorld);

        if (myOBB.intersectsOBB(otherOBB)) {
          console.log("collision found with : ", otherOBB);
          collisionFound = true;
          // Here you could calculate the precise angle using vector math
          // e.g. checkAngle(meshRef.current, otherObject);
        }
      }
    }

    if (collisionFound !== isColliding) {
      setIsColliding(collisionFound);
    }
  });

  const materialColor = isColliding
    ? "#ff4444"
    : isSelected
      ? "#ffa500"
      : "#cccccc";
  const emissiveColor = isColliding ? "#550000" : "#000000";

  return (
    <mesh
      ref={meshRef}
      name={data.id} // Important for finding this object later
      position={data.position}
      rotation={data.rotation}
      onClick={(e) => {
        e.stopPropagation();
        select(data.id);
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <TubeGeometry
        width={data.width}
        height={data.height}
        thickness={data.thickness}
        length={data.length}
      />
      <meshStandardMaterial
        color={materialColor}
        emissive={emissiveColor}
        roughness={0.3}
        metalness={0.6}
      />
      <Edges threshold={15} color="white" />
    </mesh>
  );
};
