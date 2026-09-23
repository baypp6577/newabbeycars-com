/**
 * Soft navy/gold Three.js backdrop behind Abbey Tires + Abbey Cars.
 * Floating particles + a slow rotating tire ring. Falls back quietly if WebGL is unavailable.
 */
(function () {
  var canvas = document.getElementById('brands-canvas')
  var stage = document.getElementById('brands-stage')
  if (!canvas || !stage || typeof THREE === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  var renderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
  } catch (err) {
    return
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)

  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 0.2, 7.2)

  var group = new THREE.Group()
  scene.add(group)

  // Ambient depth
  var fogLight = new THREE.AmbientLight(0xc5a059, 0.35)
  scene.add(fogLight)
  var key = new THREE.DirectionalLight(0xffffff, 0.55)
  key.position.set(3, 4, 5)
  scene.add(key)
  var fill = new THREE.DirectionalLight(0x1a3358, 0.4)
  fill.position.set(-4, -1, 2)
  scene.add(fill)

  // Tire ring
  var tire = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.28, 16, 72),
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.35,
      roughness: 0.55,
      emissive: 0x0a1528,
      emissiveIntensity: 0.25,
    })
  )
  tire.rotation.x = Math.PI / 2.35
  group.add(tire)

  var rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.18, 0.06, 12, 64),
    new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0xc5a059,
      emissiveIntensity: 0.15,
    })
  )
  rim.rotation.x = Math.PI / 2.35
  group.add(rim)

  // Soft car silhouette (simple box body + cabin)
  var car = new THREE.Group()
  var bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a3358,
    metalness: 0.4,
    roughness: 0.4,
    emissive: 0x0d1c33,
    emissiveIntensity: 0.2,
  })
  var body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.28, 0.55), bodyMat)
  body.position.y = -0.05
  car.add(body)
  var cabin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.28, 0.48), bodyMat)
  cabin.position.set(-0.08, 0.22, 0)
  car.add(cabin)
  car.position.set(0, 0.05, 0)
  car.scale.set(0.72, 0.72, 0.72)
  group.add(car)

  // Gold dust particles
  var count = 420
  var positions = new Float32Array(count * 3)
  var speeds = []
  for (var i = 0; i < count; i++) {
    var r = 2.2 + Math.random() * 4.5
    var a = Math.random() * Math.PI * 2
    var y = (Math.random() - 0.5) * 5.5
    positions[i * 3] = Math.cos(a) * r
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(a) * r * 0.7
    speeds.push(0.15 + Math.random() * 0.45)
  }
  var pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  var particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: 0xe0c37a,
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
  scene.add(particles)

  var navyPoints = new THREE.Points(
    pGeo.clone(),
    new THREE.PointsMaterial({
      color: 0x3a5a8a,
      size: 0.05,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
  navyPoints.rotation.y = 0.6
  scene.add(navyPoints)

  function resize() {
    var w = stage.clientWidth
    var h = Math.max(stage.clientHeight, 320)
    renderer.setSize(w, h, false)
    camera.aspect = w / Math.max(h, 1)
    camera.updateProjectionMatrix()
  }

  var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
  if (ro) ro.observe(stage)
  else window.addEventListener('resize', resize)
  resize()

  var clock = new THREE.Clock()
  var running = true
  var io = new IntersectionObserver(
    function (entries) {
      running = entries[0] && entries[0].isIntersecting
    },
    { threshold: 0.05 }
  )
  io.observe(stage)

  function tick() {
    requestAnimationFrame(tick)
    if (!running) return
    var t = clock.getElapsedTime()
    tire.rotation.z = t * 0.28
    rim.rotation.z = t * 0.28
    car.rotation.y = Math.sin(t * 0.35) * 0.25
    car.position.y = 0.05 + Math.sin(t * 0.8) * 0.06
    group.rotation.y = Math.sin(t * 0.12) * 0.18
    group.position.y = Math.sin(t * 0.4) * 0.08
    particles.rotation.y = t * 0.05
    navyPoints.rotation.y = -t * 0.03

    var pos = particles.geometry.attributes.position.array
    for (var i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t * speeds[i] + i) * 0.0015
    }
    particles.geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }
  tick()
})()
