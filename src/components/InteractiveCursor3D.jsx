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

/* ─── MOBILE PARTICLES (Scroll-Activated Energy) ─── */
function MobileParticles({ count = 40, isDark }) {
  const ref = useRef()
  const scrollY = useRef(0)
  const { viewport } = useThree()

  const glowColor = isDark ? "#67e8f9" : "#0284c7"

  // Track scroll position
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleScroll = () => {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Generate random particles
  const { positions, randomFactors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const rFactors = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Random X within viewport width, random Y within viewport height
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5
      
      // Random speed factor
      rFactors[i] = Math.random() * 0.5 + 0.5
    }
    return { positions: pos, randomFactors: rFactors }
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const posAttr = ref.current.geometry.attributes.position
    const t = clock.getElapsedTime()
    
    // Base scroll speed plus subtle floating animation
    const scrollOffset = scrollY.current * 0.01

    for (let i = 0; i < count; i++) {
      let y = posAttr.array[i * 3 + 1]
      
      // Move particle up based on time and scroll offset
      y += (0.02 * randomFactors[i]) + (scrollOffset * 0.005)
      
      // Reset particle if it goes off top of screen
      if (y > viewport.height / 2 + 2) {
        y = -viewport.height / 2 - 2
        posAttr.array[i * 3] = (Math.random() - 0.5) * viewport.width // New random X
      }
      
      posAttr.array[i * 3 + 1] = y
      
      // Subtle sine wave X movement
      posAttr.array[i * 3] += Math.sin(t * 2 + i) * 0.005
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        color={glowColor} 
        size={isDark ? 0.08 : 0.05} 
        transparent 
        opacity={isDark ? 0.6 : 0.3}
        sizeAttenuation 
        depthWrite={false} 
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
      />
    </points>
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
          <MobileParticles count={50} isDark={isDark} />
        ) : (
          <DesktopCursor isDark={isDark} />
        )}
      </Canvas>
    </div>
  )
}
