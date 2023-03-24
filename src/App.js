import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { easing } from "maath"
import Model from "./Model"

function Rig() {
  // state 中可以访问到鼠标的位置，相机的位置
  return useFrame((state, delta) => {
    easing.damp3(state.camera.position, [1 + state.mouse.x / 4, 1.5 + state.mouse.y / 4, 2.5], 0.2, delta)
  })
}

export default function App() {
  const floor = useRef(null)
  const [hovered, setHovered] = useState(false)
  useEffect(() => {
    // document.body.style.cursor = hovered ? "pointer" : "auto"
    if (hovered) {
      console.log("hhhh")
      document.body.classList.add("selected")
      console.log(document.body.classList)
    } else {
      document.body.classList.remove("selected")
      console.log(document.body.classList)
    }
  }, [hovered])

  return (
    <Canvas shadows camera={{ position: [1, 1.5, 2.5], fov: 50 }}>
      <ambientLight />
      <directionalLight position={[-5, 5, 5]} castShadow shadow-mapSize={1024} />
      <group position={[0, -1, 0]}>
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </group>
      <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10, 1, 1]} />
        <meshBasicMaterial color="#dfa" />
      </mesh>
      <mesh
        ref={floor}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, -0.9, 0]}
        rotation={[-0.5 * Math.PI, 0, 0]}>
        <planeGeometry args={[4, 4, 1, 1]} />
        <meshStandardMaterial transparent opacity={1} />
      </mesh>
      <Rig />
    </Canvas>
  )
}
