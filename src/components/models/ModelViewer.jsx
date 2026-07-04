import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import ModelScene from './ModelScene'
import ModelLoader from './ModelLoader'

// Transparent, auto-rotating 3D viewer used across the Models page.
// `alpha: true` + no scene background keeps the canvas see-through so the
// model floats over whatever page background is behind it (light or dark).
export default function ModelViewer({ modelPath }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.5, 9], fov: 42 }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Suspense fallback={<ModelLoader />}>
        <ModelScene modelPath={modelPath} autoRotate />
      </Suspense>
    </Canvas>
  )
}
