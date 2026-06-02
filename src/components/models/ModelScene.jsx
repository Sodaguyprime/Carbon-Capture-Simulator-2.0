import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TARGET_SIZE = 5.5

function Model({ path, autoRotate }) {
  const { scene } = useGLTF(path)
  const ref = useRef()

  // Compute a normalizing scale so every model fills ~TARGET_SIZE units
  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    return maxDim > 0 ? TARGET_SIZE / maxDim : 1
  }, [scene])

  useFrame((_, delta) => {
    if (autoRotate && ref.current) {
      ref.current.rotation.y += delta * 0.3
    }
  })

  useEffect(() => {
    scene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <Center>
      <primitive ref={ref} object={scene} scale={normalizedScale} />
    </Center>
  )
}

export default function ModelScene({ modelPath, autoRotate }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
      <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#33D17A" />
      <pointLight position={[0, 6, 0]} intensity={0.8} color="#33D17A" />

      {/* Environment */}
      <Environment preset="city" />

      {/* Model */}
      <Model path={modelPath} autoRotate={autoRotate} />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.35}
        scale={10}
        blur={2.5}
        far={4}
        color="#33D17A"
      />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={20}
        autoRotate={false}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  )
}

// Pre-load all three models
useGLTF.preload('/models/Fermentor.glb')
useGLTF.preload('/models/Middlepart.glb')
useGLTF.preload('/models/3rd_part.glb')
