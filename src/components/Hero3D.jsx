import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function useTheme() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)
    const handler = (e) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return isDark
}

/* ─── Arc Reactor Core ─── */
function ArcReactor({ isDark }) {
  const group = useRef()
  const innerRing = useRef()
  const outerRing = useRef()
  const coreGlow = useRef()

  const glowColor = isDark ? "#67e8f9" : "#0ea5e9"
  const emColor = isDark ? "#22d3ee" : "#0284c7"
  const outerColor = isDark ? "#06b6d4" : "#0369a1"

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (innerRing.current) innerRing.current.rotation.z = t * 1.5
    if (outerRing.current) outerRing.current.rotation.z = -t * 0.8
    if (coreGlow.current) {
      coreGlow.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08)
      coreGlow.current.material.emissiveIntensity = (isDark ? 4 : 2) + Math.sin(t * 4) * 0.5
    }
    if (group.current) group.current.rotation.y = Math.sin(t * 0.3) * 0.1
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Core energy ball */}
      <mesh ref={coreGlow}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={glowColor} emissive={emColor} emissiveIntensity={isDark ? 4 : 2} transparent opacity={isDark ? 0.95 : 0.7} />
      </mesh>
      {/* Core glow halo */}
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color={emColor} emissive={outerColor} emissiveIntensity={isDark ? 2 : 1} transparent opacity={isDark ? 0.2 : 0.1} />
      </mesh>

      {/* Inner spinning ring */}
      <mesh ref={innerRing}>
        <torusGeometry args={[1.2, 0.05, 16, 64]} />
        <meshStandardMaterial color={glowColor} emissive={emColor} emissiveIntensity={isDark ? 3 : 1} transparent opacity={isDark ? 0.9 : 0.5} />
      </mesh>
      {/* Inner ring notches */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh key={`in-${i}`}
            position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0]}
            rotation={[0, 0, angle]}>
            <boxGeometry args={[0.18, 0.06, 0.03]} />
            <meshStandardMaterial color={glowColor} emissive={emColor} emissiveIntensity={isDark ? 3 : 1.5} transparent opacity={isDark ? 0.8 : 0.6} />
          </mesh>
        )
      })}

      {/* Outer spinning ring */}
      <mesh ref={outerRing}>
        <torusGeometry args={[1.8, 0.04, 16, 80]} />
        <meshStandardMaterial color={outerColor} emissive={emColor} emissiveIntensity={isDark ? 2.5 : 1} transparent opacity={isDark ? 0.7 : 0.4} />
      </mesh>

      {/* Energy spokes */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh key={`spoke-${i}`} position={[0, 0, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[1.1, 0.008, 0.008]} />
            <meshStandardMaterial color={emColor} emissive={emColor} emissiveIntensity={isDark ? 1.5 : 0.5} transparent opacity={isDark ? 0.3 : 0.1} />
          </mesh>
        )
      })}
    </group>
  )
}

/* ─── HUD Ring with segments ─── */
function HUDRing({ radius, segments, speed, color, opacity, tiltX, tiltY, isDark }) {
  const ref = useRef()
  const segmentAngle = (Math.PI * 2) / segments
  const gapFraction = 0.3

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed
  })

  return (
    <group ref={ref} rotation={[tiltX || 0, tiltY || 0, 0]}>
      {[...Array(segments)].map((_, i) => {
        const startAngle = i * segmentAngle + gapFraction * segmentAngle * 0.5
        const arcLength = segmentAngle * (1 - gapFraction)
        const curve = new THREE.EllipseCurve(0, 0, radius, radius, startAngle, startAngle + arcLength, false, 0)
        const points = curve.getPoints(32)
        const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, p.y, 0)))
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color={color} transparent opacity={opacity} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
          </line>
        )
      })}
    </group>
  )
}

/* ─── Holographic Data Ring (rotating text-like markers) ─── */
function DataRing({ radius, count, speed, color, isDark }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed
  })

  return (
    <group ref={ref}>
      {[...Array(count)].map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const w = 0.08 + Math.random() * 0.15
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle + Math.PI / 2]}>
            <boxGeometry args={[w, 0.015, 0.005]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isDark ? 1.5 : 0.2} transparent opacity={isDark ? 0.6 : 0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

/* ─── Scanning Grid ─── */
function ScanGrid({ isDark }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime()
      ref.current.position.z = -3 + Math.sin(t * 0.5) * 0.5
      ref.current.material.opacity = (isDark ? 0.06 : 0.03) + Math.sin(t * 2) * 0.02
    }
  })

  const gridSize = 20
  const divisions = 30
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const vertices = []
    const half = gridSize / 2
    const step = gridSize / divisions
    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step
      vertices.push(-half, pos, 0, half, pos, 0)
      vertices.push(pos, -half, 0, pos, half, 0)
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geo
  }, [])

  return (
    <lineSegments ref={ref} geometry={geometry} rotation={[Math.PI / 2.5, 0, 0]} position={[0, -3, -3]}>
      <lineBasicMaterial color={isDark ? "#22d3ee" : "#0284c7"} transparent opacity={isDark ? 0.06 : 0.03} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
    </lineSegments>
  )
}

/* ─── Floating HUD Panels ─── */
function HUDPanel({ position, rotation, width, height, color, isDark }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime()
      ref.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.15
      ref.current.material.opacity = (isDark ? 0.08 : 0.03) + Math.sin(t * 1.5 + position[0] * 2) * 0.03
    }
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isDark ? 0.8 : 0.1} transparent opacity={isDark ? 0.1 : 0.05}
        side={THREE.DoubleSide} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
    </mesh>
  )
}

/* ─── Particle Beam ─── */
function ParticleBeams({ count = 60, isDark }) {
  const ref = useRef()

  const { positions, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = []
    const off = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 1.5 + Math.random() * 6
      pos[i * 3] = Math.cos(angle) * r
      pos[i * 3 + 1] = Math.sin(angle) * r
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
      spd.push(0.5 + Math.random() * 2)
      off.push(Math.random() * Math.PI * 2)
    }
    return { positions: pos, speeds: spd, offsets: off }
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const posAttr = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 2] = Math.sin(t * speeds[i] + offsets[i]) * 2
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={isDark ? "#67e8f9" : "#0284c7"} size={isDark ? 0.06 : 0.04} transparent opacity={isDark ? 0.8 : 0.4}
        sizeAttenuation depthWrite={false} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
    </points>
  )
}

/* ─── Scan Line (sweeping beam) ─── */
function ScanBeam({ isDark }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.6
  })

  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(5, 0.3)
    shape.lineTo(5, -0.3)
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [])

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color={isDark ? "#22d3ee" : "#0284c7"} emissive={isDark ? "#22d3ee" : "#0284c7"} emissiveIntensity={isDark ? 0.5 : 0.1}
        transparent opacity={isDark ? 0.04 : 0.02} side={THREE.DoubleSide} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
    </mesh>
  )
}

/* ─── Light Theme Extra Animation ─── */
function FloatingGeometricShapes({ isDark }) {
  const group = useRef()
  
  // Only render in light theme
  if (isDark) return null

  const shapes = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      pos: [(Math.random() - 0.5) * 22, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10 - 2],
      speed: 0.3 + Math.random() * 0.7,
      rotSpeed: 0.2 + Math.random() * 1.2,
      size: 0.15 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
      type: Math.floor(Math.random() * 3)
    }))
  }, [])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.children.forEach((child, i) => {
      const shape = shapes[i]
      child.position.y = shape.pos[1] + Math.sin(t * shape.speed + shape.offset) * 2
      child.rotation.x = t * shape.rotSpeed
      child.rotation.y = t * shape.rotSpeed * 0.8
    })
  })

  return (
    <group ref={group}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.pos}>
          {shape.type === 0 && <boxGeometry args={[shape.size, shape.size, shape.size]} />}
          {shape.type === 1 && <octahedronGeometry args={[shape.size]} />}
          {shape.type === 2 && <tetrahedronGeometry args={[shape.size]} />}
          <meshStandardMaterial 
            color="#0ea5e9" 
            emissive="#38bdf8" 
            emissiveIntensity={0.8} 
            wireframe 
            transparent 
            opacity={0.35} 
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Camera Rig ─── */
function CameraRig() {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useMemo(() => {
    const handler = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('pointermove', handler)
      return () => window.removeEventListener('pointermove', handler)
    }
  }, [])

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.current.x * 1.8, 0.03)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, target.current.y * 1.2, 0.03)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ─── MAIN EXPORT ─── */
export default function Hero3D() {
  const isDark = useTheme()
  const ringColors = isDark ? 
    ["#22d3ee", "#06b6d4", "#0891b2", "#22d3ee", "#155e75"] : 
    ["#0284c7", "#0369a1", "#075985", "#0284c7", "#0c4a6e"]

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', height: '100vh' }}>
      <Canvas camera={{ position: [0, 2, 12], fov: 60 }} dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>

        <ambientLight intensity={isDark ? 0.4 : 0.6} />
        <pointLight position={[5, 5, 5]} intensity={isDark ? 2 : 1} color="#22d3ee" />
        <pointLight position={[-5, -3, 3]} intensity={isDark ? 1.5 : 0.8} color="#06b6d4" />
        <pointLight position={[0, 0, 5]} intensity={isDark ? 2 : 1} color="#67e8f9" />

        <group position={[0, 1.5, 0]}>
          {/* Arc Reactor */}
          <ArcReactor isDark={isDark} />

          {/* HUD Rings */}
          <HUDRing radius={2.8} segments={12} speed={0.4} color={ringColors[0]} opacity={isDark ? 0.5 : 0.3} isDark={isDark} />
          <HUDRing radius={3.5} segments={8} speed={-0.25} color={ringColors[1]} opacity={isDark ? 0.4 : 0.25} tiltX={0.15} isDark={isDark} />
          <HUDRing radius={4.2} segments={16} speed={0.15} color={ringColors[2]} opacity={isDark ? 0.3 : 0.2} tiltX={-0.1} tiltY={0.1} isDark={isDark} />
          <HUDRing radius={5.2} segments={6} speed={-0.1} color={ringColors[3]} opacity={isDark ? 0.2 : 0.15} tiltX={0.2} tiltY={-0.15} isDark={isDark} />
          <HUDRing radius={6.5} segments={20} speed={0.08} color={ringColors[4]} opacity={isDark ? 0.15 : 0.1} isDark={isDark} />

          {/* Data rings */}
          <DataRing radius={2.2} count={40} speed={-0.6} color={ringColors[0]} isDark={isDark} />
          <DataRing radius={3.8} count={60} speed={0.3} color={ringColors[1]} isDark={isDark} />
          <DataRing radius={5} count={30} speed={-0.15} color={ringColors[2]} isDark={isDark} />

          {/* Scan beam */}
          <ScanBeam isDark={isDark} />
        </group>

        {/* Scanning grid floor */}
        <ScanGrid isDark={isDark} />

        {/* Floating HUD panels */}
        <HUDPanel position={[-5, 3, -1]} rotation={[0, 0.3, 0]} width={1.8} height={1.2} color={ringColors[0]} isDark={isDark} />
        <HUDPanel position={[5.5, 2.5, -1.5]} rotation={[0, -0.25, 0.1]} width={1.5} height={1} color={ringColors[1]} isDark={isDark} />
        <HUDPanel position={[-4.5, -1, -0.5]} rotation={[0.1, 0.2, -0.05]} width={1.2} height={0.8} color={ringColors[2]} isDark={isDark} />
        <HUDPanel position={[5, -0.5, -1]} rotation={[-0.1, -0.3, 0.05]} width={1.5} height={0.9} color={ringColors[0]} isDark={isDark} />

        {/* Particle beams */}
        <ParticleBeams count={100} isDark={isDark} />

        {/* Extra animations for Light Theme */}
        <FloatingGeometricShapes isDark={isDark} />

        {/* Mouse camera */}
        <CameraRig />
      </Canvas>
    </div>
  )
}
