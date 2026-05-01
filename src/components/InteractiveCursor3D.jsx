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

/* ─── MOBILE EDGE SCANNER ("JARVIS" Style HUD) ─── */
function JarvisEdgeScanner({ isDark }) {
  const leftScanner = useRef()
  const rightScanner = useRef()
  const scrollY = useRef(0)
  const { viewport } = useThree()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleScroll = () => {
      scrollY.current = window.scrollY
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(({ clock }) => {
    if (!leftScanner.current || !rightScanner.current) return
    const t = clock.getElapsedTime()
    
    // Smooth scanning motion: sine wave combined with scroll position
    const scanBase = Math.sin(t * 0.8) * (viewport.height * 0.4)
    const scrollOffset = scrollY.current * 0.005
    
    // We want it to stay largely on screen, moving slightly with scroll and time
    const wrappedY = ((scanBase + scrollOffset + viewport.height * 10) % viewport.height) - viewport.height / 2

    leftScanner.current.position.y = THREE.MathUtils.lerp(leftScanner.current.position.y, wrappedY, 0.1)
    rightScanner.current.position.y = THREE.MathUtils.lerp(rightScanner.current.position.y, wrappedY, 0.1)
  })

  const glowColor = isDark ? "#22d3ee" : "#0284c7"
  const edgeX = viewport.width / 2 - 0.15 // Just inside the edge

  return (
    <group position={[0, 0, 0]}>
      {/* Faint Edge Tracks */}
      <mesh position={[-edgeX, 0, 0]}>
        <planeGeometry args={[0.01, viewport.height * 2]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={isDark ? 0.1 : 0.05} 
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
        />
      </mesh>
      <mesh position={[edgeX, 0, 0]}>
        <planeGeometry args={[0.01, viewport.height * 2]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={isDark ? 0.1 : 0.05} 
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
        />
      </mesh>

      {/* Left Scanner HUD Bracket */}
      <group ref={leftScanner} position={[-edgeX, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.04, 0.5]} />
          <meshBasicMaterial color={glowColor} transparent opacity={isDark ? 0.8 : 0.5} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
        </mesh>
        <mesh position={[0.08, 0.25, 0]}>
          <planeGeometry args={[0.15, 0.02]} />
          <meshBasicMaterial color={glowColor} transparent opacity={isDark ? 0.8 : 0.5} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
        </mesh>
        <mesh position={[0.08, -0.25, 0]}>
          <planeGeometry args={[0.15, 0.02]} />
          <meshBasicMaterial color={glowColor} transparent opacity={isDark ? 0.8 : 0.5} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
        </mesh>
      </group>

      {/* Right Scanner HUD Bracket */}
      <group ref={rightScanner} position={[edgeX, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.04, 0.5]} />
          <meshBasicMaterial color={glowColor} transparent opacity={isDark ? 0.8 : 0.5} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
        </mesh>
        <mesh position={[-0.08, 0.25, 0]}>
          <planeGeometry args={[0.15, 0.02]} />
          <meshBasicMaterial color={glowColor} transparent opacity={isDark ? 0.8 : 0.5} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
        </mesh>
        <mesh position={[-0.08, -0.25, 0]}>
          <planeGeometry args={[0.15, 0.02]} />
          <meshBasicMaterial color={glowColor} transparent opacity={isDark ? 0.8 : 0.5} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
        </mesh>
      </group>
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
          <JarvisEdgeScanner isDark={isDark} />
        ) : (
          <DesktopCursor isDark={isDark} />
        )}
      </Canvas>
    </div>
  )
}
