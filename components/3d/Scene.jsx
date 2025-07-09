"use client"
import { useRef, useEffect } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'


function OrganizedBoxModel({animate = true, ...props}) {
  const ref = useRef()

  useFrame((state) => {
  if (animate) {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, Math.sin(t / 10) * 0.3, 0.025)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, Math.sin(t / 2) * 0.1, 0.025)
  }
})

  return (
    <group ref={ref} {...props} dispose={null}>
      {/* Main cardboard box */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[5, 3, 4]} />
        <meshStandardMaterial color="#D4B59E" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Box flaps */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([x, z], i) => (
        <mesh key={i} castShadow position={[x * 1.25, 1.6, z * 1]} rotation={[0.3 * z, 0, 0.2 * x]}>
          <boxGeometry args={[2.5, 0.2, 2]} />
          <meshStandardMaterial color="#C4A491" roughness={0.8} metalness={0.1} />
        </mesh>
      ))}
      
      {/* Box edges */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`edge-${i}`} position={[0, 0, 0]} rotation={[0, Math.PI * 0.5 * i, 0]}>
          <boxGeometry args={[0.1, 3, 0.1]} />
          <meshStandardMaterial color="#B39B8E" roughness={0.8} metalness={0.1} />
        </mesh>
      ))}
      
      {/* Sample products */}
      {Array.from({ length: 8 }).map((_, i) => {
        const scale = 0.4 + Math.random() * 0.3
        return (
          <mesh 
            key={`product-${i}`}
            castShadow 
            position={[
              ((i % 2) - 0.5) * 2,
              -0.5 + scale / 2,
              ((Math.floor(i / 2) % 2) - 0.5) * 2
            ]}
            scale={[scale, scale, scale]}
          >
            <boxGeometry />
            <meshStandardMaterial 
              color={["#E6F1FF", "#CCDCF5", "#99BAEB", "#6697E0"][i % 4]} 
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
        )
      })}
      
      {/* Company logo */}
      <mesh position={[0, 1.52, 1.9]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshStandardMaterial color="#8B7355" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  )
}

function Box({ position, size }) {
  const ref = useRef()
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    const offset = position[0] * 0.2
    ref.current.position.y = Math.sin(time + offset) * 0.2
    ref.current.rotation.x = Math.sin(time / 2 + offset) * 0.1
    ref.current.rotation.z = Math.cos(time / 2 + offset) * 0.1
  })
  
  return (
    <mesh
      ref={ref}
      position={position}
      castShadow
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial 
        color="#ffffff"
        roughness={0.3}
        metalness={0.2}
        opacity={0.6}
        transparent
      />
    </mesh>
  )
}

function FloatingBoxes() {
  return (
    <group position={[0, 0, -5]}>
      {Array.from({ length: 15 }).map((_, i) => {
        const size = 0.2 + Math.random() * 0.3
        const position = [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5 - 3
        ]
        
        return (
          <Box
            key={i}
            position={position}
            size={size}
          />
        )
      })}
    </group>
  )
}

function Scene() {
  const { camera } = useThree()
  const groupRef = useRef()

  useEffect(() => {
    camera.position.set(0, 0, 8)
  }, [camera])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004 
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
      <Environment preset="sunset" />
      
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[0, Math.PI]} // allows full up/down rotation, but not flipping under
        azimuth={[-0.7, 0.7]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <OrganizedBoxModel position={[0, -1, 0]} scale={[0.8, 0.8, 0.8]} />
    </PresentationControls>
    </group>
  )
}

function ThreeScene() {
  return (
    <div className="canvas-container h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 12], fov: 60 }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

export default ThreeScene