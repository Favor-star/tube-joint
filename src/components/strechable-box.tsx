import { OrbitControls } from "@react-three/drei"
import { useState, useRef } from "react"

export function StretchableBox() {
  const meshRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [startX, setStartX] = useState(null)

  const onPointerDown = (e) => {
    setDragging(true)
    setStartX(e.clientX)
  }

  const onPointerUp = () => {
    setDragging(false)
  }

  const onPointerMove = (e) => {
    if (!dragging) return

    const delta = (e.clientX - startX) * 0.01  
    const newScaleX = Math.max(0.2, meshRef.current.scale.x + delta)

    meshRef.current.scale.x = newScaleX
    setStartX(e.clientX)
  }

  return (
    <mesh
      ref={meshRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerUp}
      >
          
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}