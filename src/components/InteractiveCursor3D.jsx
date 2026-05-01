import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

// Custom hook to detect light/dark mode
function useTheme() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)
    const handler = (e) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return isDark
}

// Custom hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

/* ─── DESKTOP CURSOR (Repulsor Trail) ─── */
function DesktopCursor({ isDark }) {
  const ref = useRef()
  const { viewport, pointer } = useThree()

  // Colors based on theme
  const coreColor = isDark ? "#ffffff" : "#0ea5e9"
  const glowColor = isDark ? "#22d3ee" : "#0284c7"

  useFrame(() => {
    if (!ref.current) return
    // Map normalized pointer coordinates to 3D world coordinates
    const targetX = (pointer.x * viewport.width) / 2
    const targetY = (pointer.y * viewport.height) / 2

    // Smoothly interpolate current position to target position
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.2)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.2)
  })

  return (
    <group ref={ref}>
      <Trail
        width={isDark ? 0.8 : 0.5}
        length={isDark ? 8 : 4}
        color={glowColor}
        attenuation={(t) => t * t}
        transparent
        opacity={0.4}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      >
        {/* Core glowing orb */}
        <mesh>
          <sphereGeometry args={[isDark ? 0.08 : 0.05, 16, 16]} />
          <meshBasicMaterial 
            color={coreColor} 
            transparent
            opacity={0.8}
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
          />
        </mesh>
        {/* Outer aura */}
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial 
            color={glowColor} 
            transparent 
            opacity={isDark ? 0.3 : 0.15} 
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
          />
        </mesh>
      </Trail>
    </group>
  )
}

/* ─── MOBILE GEOMETRY (Scroll-Linked Rotation) ─── */
function MobileGeometry({ isDark }) {
  const ref = useRef()
  const scrollY = useRef(0)
  const targetRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleScroll = () => {
      scrollY.current = window.scrollY
      // Map scroll position to target rotation
      targetRotation.current.y = scrollY.current * 0.005
      targetRotation.current.x = scrollY.current * 0.002
    }
    
    // Initial check
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    if (!ref.current) return
    // Smoothly lerp towards target rotation. Stops completely when scrolling stops.
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotation.current.y, 0.1)
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotation.current.x, 0.1)
  })

  const glowColor = isDark ? "#22d3ee" : "#0284c7"

  return (
    <group ref={ref} position={[0, 0, -2]}>
      {/* Outer abstract wireframe sphere */}
      <mesh>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial 
          color={glowColor} 
          wireframe 
          transparent 
          opacity={isDark ? 0.12 : 0.06} 
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
        />
      </mesh>
      
      {/* Intersecting Torus Ring 1 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.02, 16, 64]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={isDark ? 0.3 : 0.15} 
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
        />
      </mesh>
      
      {/* Intersecting Torus Ring 2 */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={isDark ? 0.4 : 0.2} 
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
        />
      </mesh>
    </group>
  )
}

/* ─── MAIN EXPORT ─── */
export default function InteractiveCursor3D() {
  const isDark = useTheme()
  const isMobile = useIsMobile()

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }} 
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isDark ? 1 : 1.5} />
        
        {isMobile ? (
          <MobileGeometry isDark={isDark} />
        ) : (
          <DesktopCursor isDark={isDark} />
        )}
      </Canvas>
    </div>
  )
}
