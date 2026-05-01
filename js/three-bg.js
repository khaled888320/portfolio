// ===== THREE.JS 3D BACKGROUND =====
const canvas = document.getElementById('bg-canvas')

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

// ===== PARTICLES =====
const geometry = new THREE.BufferGeometry()
const count = 2000
const positions = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({
  color: 0x7c6af7,
  size: 0.025,
  transparent: true,
  opacity: 0.8,
})

const points = new THREE.Points(geometry, material)
scene.add(points)

// ===== FLOATING TORUS =====
const torusGeo = new THREE.TorusGeometry(1.5, 0.4, 16, 100)
const torusMat = new THREE.MeshBasicMaterial({
  color: 0x7c6af7,
  wireframe: true,
  transparent: true,
  opacity: 0.12
})
const torus = new THREE.Mesh(torusGeo, torusMat)
torus.position.set(4, 0, -2)
scene.add(torus)

// ===== FLOATING ICOSAHEDRON =====
const icoGeo = new THREE.IcosahedronGeometry(1, 0)
const icoMat = new THREE.MeshBasicMaterial({
  color: 0xf76a9f,
  wireframe: true,
  transparent: true,
  opacity: 0.1
})
const ico = new THREE.Mesh(icoGeo, icoMat)
ico.position.set(-4, 1, -3)
scene.add(ico)

// ===== FLOATING OCTAHEDRON =====
const octaGeo = new THREE.OctahedronGeometry(0.8, 0)
const octaMat = new THREE.MeshBasicMaterial({
  color: 0x6af7c0,
  wireframe: true,
  transparent: true,
  opacity: 0.1
})
const octa = new THREE.Mesh(octaGeo, octaMat)
octa.position.set(0, 3, -4)
scene.add(octa)

// ===== MOUSE PARALLAX =====
let mouseX = 0
let mouseY = 0

document.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3
  mouseY = -(e.clientY / window.innerHeight - 0.5) * 0.3
})

// ===== ANIMATION LOOP =====
function animate() {
  requestAnimationFrame(animate)

  // Rotate particles slowly
  points.rotation.y += 0.0003
  points.rotation.x += 0.0001

  // Rotate shapes
  torus.rotation.x += 0.005
  torus.rotation.y += 0.003

  ico.rotation.x += 0.004
  ico.rotation.z += 0.003

  octa.rotation.y += 0.006
  octa.rotation.x += 0.004

  // Mouse parallax
  camera.position.x += (mouseX - camera.position.x) * 0.05
  camera.position.y += (mouseY - camera.position.y) * 0.05

  renderer.render(scene, camera)
}

animate()

// ===== RESIZE =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})