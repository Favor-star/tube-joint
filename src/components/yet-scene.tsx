import React, { useRef, useState, forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import * as THREE from "three";

// Standard Tube Component
const Tube = forwardRef(
  ({ position, rotation, color, children, onClick, ...props }, ref) => {
    return (
      <mesh
        ref={ref}
        position={position}
        rotation={rotation}
        onClick={onClick}
        {...props}
      >
        <boxGeometry args={[2, 2, 6]} />
        <meshStandardMaterial color={color} />
        {children}
      </mesh>
    );
  }
);

function Scene() {
  const fixedTubeRef = useRef();
  const movingTubeRef = useRef();

  const [isDragging, setIsDragging] = useState(false);

  // State to track attachment status
  const [isAttached, setIsAttached] = useState(false);

  // State to store the calculated offset (Local Position & Rotation)
  const [attachedTransform, setAttachedTransform] = useState({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  });

  const checkSnap = () => {
    if (isAttached || !fixedTubeRef.current || !movingTubeRef.current) return;

    const fixed = fixedTubeRef.current;
    const moving = movingTubeRef.current;

    // 1. Get World Positions for distance check
    const fixedWorldPos = new THREE.Vector3();
    fixed.getWorldPosition(fixedWorldPos);

    const movingWorldPos = new THREE.Vector3();
    moving.getWorldPosition(movingWorldPos);

    // 2. Check Distance
    if (fixedWorldPos.distanceTo(movingWorldPos) < 3.5) {
      // --- THE MATH MAGICAL PART ---

      // A. Calculate Relative Position
      // We take the Moving Tube's World Position...
      // And convert it to the Fixed Tube's Local Space.
      // Note: .clone() is vital because worldToLocal mutates the vector.
      const newLocalPos = fixed.worldToLocal(movingWorldPos.clone());

      // B. Calculate Relative Rotation
      // LocalRot = ParentInverse * ChildRot
      const fixedWorldQuat = new THREE.Quaternion();
      fixed.getWorldQuaternion(fixedWorldQuat);

      const movingWorldQuat = new THREE.Quaternion();
      moving.getWorldQuaternion(movingWorldQuat);

      // Invert parent rotation and multiply by child rotation
      const newLocalQuat = fixedWorldQuat.invert().multiply(movingWorldQuat);
      const newLocalEuler = new THREE.Euler().setFromQuaternion(newLocalQuat);

      // 3. Save these calculated local transforms
      setAttachedTransform({
        position: [newLocalPos.x, newLocalPos.y, newLocalPos.z],
        rotation: [newLocalEuler.x, newLocalEuler.y, newLocalEuler.z],
      });

      // 4. Trigger the UI update
      setIsAttached(true);
    }
  };

  const detach = () => setIsAttached(false);

  return (
    <>
      <OrbitControls makeDefault enabled={!isDragging} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <gridHelper args={[20, 20]} />

      {/* --- PARENT (BLUE) --- */}
      {/* We wrap the parent in controls to prove the child follows it */}
      <TransformControls mode="translate" onDraggingChanged={setIsDragging}>
        <Tube ref={fixedTubeRef} position={[0, 0, 0]} color="blue">
          {/* --- CHILD (RED) - ATTACHED STATE --- */}
          {isAttached && (
            <Tube
              ref={movingTubeRef}
              color="red"
              // Apply the calculated RELATIVE transform
              position={attachedTransform.position}
              rotation={attachedTransform.rotation}
              onClick={(e) => {
                e.stopPropagation();
                detach();
              }}
            />
          )}
        </Tube>
      </TransformControls>

      {/* --- CHILD (RED) - DETACHED STATE --- */}
      {!isAttached && (
        <TransformControls
          object={movingTubeRef}
          mode="translate"
          onDraggingChanged={setIsDragging}
          onMouseUp={checkSnap}
        >
          <Tube ref={movingTubeRef} position={[4, 2, 0]} color="red" />
        </TransformControls>
      )}
    </>
  );
}

export default function YetScene() {
  return (
    <Canvas camera={{ position: [5, 8, 10] }}>
      <Scene />
    </Canvas>
  );
}
