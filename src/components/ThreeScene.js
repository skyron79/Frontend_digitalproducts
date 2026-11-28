import { defineComponent, h, onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

export default defineComponent({
  name: 'ThreeScene',
  setup() {
    const canvasRef = ref(null)
    let renderer
    let animationFrame
    let cleanup = () => {}

    onMounted(() => {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      )

      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

      camera.position.z = 5

      const animate = (time) => {
        cube.rotation.x = time / 2000
        cube.rotation.y = time / 1000
        renderer.render(scene, camera)
        animationFrame = requestAnimationFrame(animate)
      }

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      window.addEventListener('resize', handleResize)
      animationFrame = requestAnimationFrame(animate)

      cleanup = () => {
        cancelAnimationFrame(animationFrame)
        window.removeEventListener('resize', handleResize)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
      }
    })

    onUnmounted(() => cleanup())

    return () => h('canvas', {
      ref: canvasRef,
      'aria-label': 'Three.js animatie',
    })
  },
})
