import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Tube } from "./tube";
import {
  OrbitControls,
  TransformControls,

} from "@react-three/drei";
import { useControls, button } from "leva";
import { useTubeStore, InitialStateProps, StoreState } from "../store";

// --- 4. SCENE CONTROLLER ---
// Handles the TransformControls logic centrally
const SceneController = () => {
  const { tubes, selectedId, updateTube, addTube } = useTubeStore();

  // Controls UI (Leva) [cite: 9, 10]
  useControls({
    "Add Tube": button(() => addTube()),
    Mode: {
      options: ["translate", "rotate"],
      onChange: (v) => setMode(v),
    },
  });

  const [mode, setMode] = useState<"translate" | "rotate" | "scale">(
    "translate"
  );

  // Find the selected object in the scene to attach controls to
  const selectedObject = useMemo(() => {
    // This is a bit of a React-state workaround.
    // In a production app, we'd pass the ref directly via the store.
    return null;
  }, [selectedId]);

  // We need a ref to the transform controls to listen to events
  const transformRef = useRef(null);
  const orbitRef = useRef(null);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls ref={orbitRef} makeDefault />

      <group>
        {tubes.map((tube) => (
          <Tube key={tube.id} data={tube} />
        ))}
      </group>

      {/* We use one TransformControls for the whole scene. 
         We attach it to the object matching the selectedId.
      */}
      {selectedId && (
        <SceneTransformControls
          selectedId={selectedId}
          mode={mode}
          updateTube={updateTube}
          orbitRef={orbitRef}
        />
      )}
    </>
  );
};

// Helper to attach transform controls cleanly
const SceneTransformControls: React.FC<
  StoreState & { mode: "translate" | "rotate" | "scale" }
> = ({ selectedId, mode, updateTube, orbitRef }) => {
  const scene = useThree((state) => state.scene);
  const [target, setTarget] =
    useState<THREE.Object3D<THREE.Object3DEventMap>>();

  // Every time selectedId changes, find the new mesh
  useEffect(() => {
    const obj = scene.getObjectByName(selectedId);
    setTarget(obj);
  }, [selectedId, scene]);

  return target ? (
    <TransformControls
      object={target}
      mode={mode}
      // Snap to grid (1 unit) and Angle (45 degrees)
      translationSnap={1}
      rotationSnap={Math.PI / 4}
      onDraggingChanged={(dragging) => {
        if (orbitRef.current) orbitRef.current.enabled = !dragging;
      }}
      onObjectChange={(e) => {
        // Sync changes back to store so they persist
        const obj = e.target.object;
        updateTube(selectedId, {
          position: [obj.position.x, obj.position.y, obj.position.z],
          rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
        });
      }}
    />
  ) : null;
};

export default function MiniEditor() {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      <SceneController />
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}
