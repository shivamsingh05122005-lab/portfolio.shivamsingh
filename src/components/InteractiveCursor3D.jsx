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

/* ─── UNIFIED GLOBAL CURSOR (Repulsor Trail for Mouse & Touch) ─── */
function GlobalCursor({ isDark }) {
  const ref = useRef()
  const { viewport, camera } = useThree()
  
  // We manually track coordinates from the window to bypass pointer-events: none on the canvas
  const target = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Convert pixel coordinates to normalized device coordinates [-1, 1], then to world coordinates
    const updateTarget = (clientX, clientY) => {
      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1
      target.current.x = (x * viewport.width) / 2
      target.current.y = (y * viewport.height) / 2
      target.current.active = true
    }

    const onMouseMove = (e) => updateTarget(e.clientX, e.clientY)
    const onTouchMove = (e) => {
      if (e.touches.length > 0) updateTarget(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchStart = (e) => {
      if (e.touches.length > 0) updateTarget(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchEnd = () => {
      target.current.active = false
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [viewport.width, viewport.height])

  useFrame(() => {
    if (!ref.current) return
    
    // Smoothly interpolate current position to target position
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, target.current.x, 0.2)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, target.current.y, 0.2)
    
    // On mobile, fade out when not touching. On desktop, keep it visible.
    const isMobile = window.innerWidth < 768
    const targetScale = (isMobile && !target.current.active) ? 0 : 1
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.15))
  })

  // Colors based on theme
  const coreColor = isDark ? "#ffffff" : "#0ea5e9"
  const glowColor = isDark ? "#22d3ee" : "#0284c7"

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

/* ─── MAIN EXPORT ─── */
export default function InteractiveCursor3D() {
  const isDark = useTheme()

  // Notice we removed the pointerEvents: 'none' workaround logic because 
  // GlobalCursor explicitly listens to window events now, ensuring it works flawlessly.

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }} 
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isDark ? 1 : 1.5} />
        <GlobalCursor isDark={isDark} />
      </Canvas>
    </div>
  )
}
