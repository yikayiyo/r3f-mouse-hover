import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import Model from "./Model"
import { Center, OrbitControls, PerspectiveCamera } from "@react-three/drei"

function Rig() {
  // state 中可以访问到鼠标的位置，相机的位置
  return useFrame((state, delta) => {
    easing.damp3(state.camera.position, [1 + state.mouse.x / 4, 1.5 + state.mouse.y / 4, 2.5], 0.2, delta)
  })
}

function Scene() {
  const floor = useRef(null)
  const { camera } = useThree()
  const [target, setTarget] = useState([0, 0, 0])
  const [hovered, setHovered] = useState(false)

  const handleClick = (e) => {
    // 相机的高度不变
    const newPosition = { ...e.point, y: camera.position.y }
    camera.position.copy(newPosition)
  }

  useEffect(() => {
    console.log("init camera: ", camera.position)
  }, [])

  useEffect(() => {
    // document.body.style.cursor = hovered ? "pointer" : "auto"
    if (hovered) {
      document.body.classList.add("selected")
    } else {
      document.body.classList.remove("selected")
    }
  }, [hovered])

  return (
    <>
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
        onClick={handleClick}
        position={[0, -1, 0]}
        rotation={[-0.5 * Math.PI, 0, 0]}>
        <planeGeometry args={[4, 4, 1, 1]} />
        <meshBasicMaterial color="pink" />
      </mesh>
      <OrbitControls camera={camera} target={target} />
      {/* <Rig /> */}
    </>
  )
}

export default function App() {
  return (
    <Canvas shadows>
      <Scene />
    </Canvas>
  )
}
