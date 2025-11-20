// import {
//   Edges,
//   OrbitControls,
//   PerspectiveCamera,
//   PivotControls,
//   TransformControls,
// } from "@react-three/drei";
// import { useRef, useState } from "react";
// import * as THREE from "three";
// import { useFrame } from "@react-three/fiber";

// export function MyScene() {
//   const ref1 = useRef<THREE.Mesh>(null!);
//   const ref2 = useRef<THREE.Mesh>(null!);

//   const box1 = useRef(new THREE.Box3());
//   const box2 = useRef(new THREE.Box3());

//   const [selected, setSelected] = useState<THREE.Object3D | null>(null);
//   const [isTransforming, setIsTransforming] = useState(false);
//   // Update bounding boxes
//   useFrame(() => {
//     box1.current.setFromObject(ref1.current);
//     box2.current.setFromObject(ref2.current);
//   });
//   const handleSelectDeselect = (ref: React.RefObject<THREE.Mesh>) => {
//     setSelected(ref.current);
//   };
//   return (
//     <>
//       <group onClick={() => setSelected(null)}>
//         <PerspectiveCamera makeDefault position={[0, 0, 10]} />

//         {/* Orbit controls — disabled when transform is active */}
//         <OrbitControls enabled={selected === null} />

//         {/* If something selected → show transform gizmo */}
//         {/* {selected && (
//         <PivotControls enabled={selected === ref1.current}>
//           <mesh
//             ref={ref1}
//             onClick={(e) => {
//               e.stopPropagation(); // prevents deselecting by accident
//               handleSelectDeselect(ref1);
//             }}
//           >
//             <cylinderGeometry args={[2, 2, 5, 4, 4]} />
//             <meshStandardMaterial color="#1e1e1e" />
//             <Edges threshold={15} color="white" />
//           </mesh>
//         </PivotControls>
//         // <TransformControls
//         //   object={selected}
//         //   mode="translate" // "translate" | "rotate" | "scale"
//         //   onMouseDown={() => setIsTransforming(true)}
//         //   onMouseUp={() => setIsTransforming(false)}
//         // />
//       )} */}
//         <PivotControls enabled={selected === ref1.current} anchor={[2, 2, 2]}>
//           <mesh
//             ref={ref1}
//             onClick={(e) => {
//               e.stopPropagation(); // prevents deselecting by accident
//               handleSelectDeselect(ref1);
//             }}
//           >
//             <cylinderGeometry args={[2, 2, 5, 4, 4]} />
//             <meshStandardMaterial color="#1e1e1e" />
//             <Edges threshold={15} color="white" />
//           </mesh>
//         </PivotControls>
//         {/* Object 1 */}
//         {/* <mesh
//         ref={ref1}
//         onClick={(e) => {
//           e.stopPropagation(); // prevents deselecting by accident
//           handleSelectDeselect(ref1);
//         }}
//       >
//         <cylinderGeometry args={[2, 2, 5, 4, 4]} />
//         <meshStandardMaterial color="#1e1e1e" />
//         <Edges threshold={15} color="white" />
//       </mesh> */}

//         {/* Object 2 */}
//         <mesh
//           ref={ref2}
//           position={[5, 0, 0]}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleSelectDeselect(ref2);
//                   }}

//         >
//           <boxGeometry args={[2, 2, 15, 4, 4]} />
//           <meshStandardMaterial color="red" />
//           <Edges threshold={15} color="white" />
//         </mesh>
//       </group>
//     </>
//   );
// }

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OBB } from "three-stdlib";

import {
  OrbitControls,
  TransformControls,
  PivotControls,
  Edges,
} from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function DraggableMesh({ geometry, color, position = [0, 0, 0] }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const pivotRef = useRef<THREE.Group>(null!);
  const { camera, raycaster, mouse } = useThree();

  const [selected, setSelected] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Invisible plane for dragging
  const planeRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (!dragging || !meshRef.current || !planeRef.current) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeRef.current);
    if (intersects[0]) {
      meshRef.current.position.copy(intersects[0].point);
    }
  });
  // In your update loop (useFrame)
  useFrame(() => {
    if (!selected) return;

    // 1. Create OBB for current tube
    const geometry = meshRef.current.geometry;
    geometry.computeBoundingBox();
    const obb1 = new OBB().fromBox3(geometry.boundingBox);
    // Apply current world matrix (position/rotation)
    obb1.applyMatrix4(meshRef.current.matrixWorld);

    // // 2. Check against other tubes
    // tubes.forEach((otherTube) => {
    //   // ... create obb2 for otherTube ...

    //   if (obb1.intersectsOBB(obb2)) {
    //     console.log("Collision Detected - Possible Joint");
    //     // Trigger UI highlight
    //     // Snap calculation logic goes here
    //   }
    // });
  });

  return (
    <>
      {/* Invisible plane for dragging in XZ */}
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* PivotControls around mesh for rotation */}
      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        scale={1.2}
        visible={selected}
      >
        {/* TransformControls for translation/rotation */}
        <TransformControls
          object={meshRef.current!}
          mode="translate"
          enabled={selected}
          onDraggingChanged={(isDragging: boolean) => setDragging(isDragging)}
        >
          <mesh
            ref={meshRef}
            position={position}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(true);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              setSelected(true);
              setDragging(true);
            }}
            onPointerUp={() => setDragging(false)}
          >
            {geometry}
            <meshStandardMaterial color={color} />
            <Edges color={selected ? "yellow" : "white"} />
          </mesh>
        </TransformControls>
      </PivotControls>
    </>
  );
}

export default function MiniEditor() {
  const orbit = useRef<any>();

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls ref={orbit} makeDefault />

      {/* Example objects */}
      <DraggableMesh
        geometry={<boxGeometry args={[2, 2, 2]} />}
        color="orange"
        position={[-3, 1, 0]}
      />
      <DraggableMesh
        geometry={<cylinderGeometry args={[1, 1, 3, 32]} />}
        color="skyblue"
        position={[3, 1, 0]}
      />
      <DraggableMesh
        geometry={<sphereGeometry args={[1, 32, 32]} />}
        color="pink"
        position={[0, 1, 3]}
      />
    </>
  );
}
