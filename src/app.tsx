
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
export const App = () => {
    return (
        <Canvas>
            <mesh>
                <OrbitControls />
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <boxGeometry />
                <meshStandardMaterial color="lightgreen" />
                <cylinderGeometry  args={[1,2,4,10]}/>
            </mesh>
        </Canvas>
    );
}