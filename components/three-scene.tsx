"use client"

import { useEffect, useRef } from "react"

export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Dynamic import of Three.js to avoid SSR issues
    import("three").then((THREE) => {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      containerRef.current?.appendChild(renderer.domElement)

      // Create particles
      const particlesGeometry = new THREE.BufferGeometry()
      const particlesCount = 5000
      const posArray = new Float32Array(particlesCount * 3)

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100
      }

      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8,
      })

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
      scene.add(particlesMesh)

      // Create glowing cubes
      const cubes: THREE.Mesh[] = []
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

      for (let i = 0; i < 20; i++) {
        const material = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x6366f1 : 0x06b6d4,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        })
        const cube = new THREE.Mesh(cubeGeometry, material)
        cube.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50)
        cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
        cubes.push(cube)
        scene.add(cube)
      }

      camera.position.z = 30

      // Mouse movement handler
      const handleMouseMove = (event: MouseEvent) => {
        mousePosition.current = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        }
      }

      window.addEventListener("mousemove", handleMouseMove)

      // Animation loop
      let animationFrameId: number
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate)

        // Rotate particles
        particlesMesh.rotation.y += 0.001
        particlesMesh.rotation.x += 0.0005

        // Rotate cubes
        cubes.forEach((cube, index) => {
          cube.rotation.x += 0.01 * (index % 2 === 0 ? 1 : -1)
          cube.rotation.y += 0.01 * (index % 3 === 0 ? 1 : -1)
        })

        // Camera follows mouse
        camera.position.x += (mousePosition.current.x * 5 - camera.position.x) * 0.05
        camera.position.y += (mousePosition.current.y * 5 - camera.position.y) * 0.05
        camera.lookAt(scene.position)

        renderer.render(scene, camera)
      }

      animate()

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      window.addEventListener("resize", handleResize)

      // Cleanup
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("resize", handleResize)
        cancelAnimationFrame(animationFrameId)
        containerRef.current?.removeChild(renderer.domElement)
        renderer.dispose()
      }
    })
  }, [])

  return <div ref={containerRef} className="fixed inset-0 -z-10" aria-hidden="true" />
}
