/**
 * Three.js glass cab backdrop behind the "I need" office switcher.
 * Soft glass car + cab hat + slow drift. Quiet no-op if WebGL unavailable.
 */
(function () {
  var canvas = document.getElementById('office-glass-canvas')
  var stage = document.getElementById('services')
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
  var camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40)
  camera.position.set(0, 0.35, 5.4)

  var group = new THREE.Group()
  scene.add(group)

  scene.add(new THREE.AmbientLight(0xffffff, 0.55))
  var key = new THREE.DirectionalLight(0xfff4dd, 0.85)
  key.position.set(2.5, 3.5, 4)
  scene.add(key)
  var rimLight = new THREE.DirectionalLight(0xc5a059, 0.45)
  rimLight.position.set(-3, 1.5, -2)
  scene.add(rimLight)
  var fill = new THREE.DirectionalLight(0x5b7db2, 0.35)
  fill.position.set(-2, -1, 3)
  scene.add(fill)

  var glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xb9d0ef,
    metalness: 0.05,
    roughness: 0.08,
    transmission: 0.78,
    thickness: 0.55,
    transparent: true,
    opacity: 0.92,
    envMapIntensity: 1.1,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  })
  var navyGlass = new THREE.MeshPhysicalMaterial({
    color: 0x1a3358,
    metalness: 0.55,
    roughness: 0.22,
    transmission: 0.35,
    thickness: 0.4,
    transparent: true,
    opacity: 0.88,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
  })
  var goldMat = new THREE.MeshStandardMaterial({
    color: 0xc5a059,
    metalness: 0.9,
    roughness: 0.22,
    emissive: 0xc5a059,
    emissiveIntensity: 0.18,
  })
  var hatMat = new THREE.MeshStandardMaterial({
    color: 0xe11d48,
    metalness: 0.35,
    roughness: 0.35,
    emissive: 0x9f1239,
    emissiveIntensity: 0.25,
  })

  var car = new THREE.Group()
  var body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.42, 0.95), navyGlass)
  body.position.y = 0
  car.add(body)
  var cabin = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.42, 0.82), glassMat)
  cabin.position.set(-0.12, 0.38, 0)
  car.add(cabin)
  var bumper = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.1, 0.98), goldMat)
  bumper.position.y = -0.2
  car.add(bumper)

  // Defined cab hat (roof light)
  var hatStem = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.18), hatMat)
  hatStem.position.set(0.05, 0.65, 0)
  car.add(hatStem)
  var hat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.28), hatMat)
  hat.position.set(0.05, 0.8, 0)
  car.add(hat)
  var hatGlow = new THREE.PointLight(0xfb7185, 0.55, 3.5)
  hatGlow.position.set(0.05, 0.95, 0.4)
  car.add(hatGlow)

  function glassTire(radius, tube, color) {
    var g = new THREE.Group()
    var tread = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 18, 72),
      new THREE.MeshPhysicalMaterial({
        color: color || 0xc5a059,
        metalness: 0.15,
        roughness: 0.06,
        transmission: 0.82,
        thickness: 0.45,
        transparent: true,
        opacity: 0.9,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide,
      })
    )
    var rimRing = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.62, tube * 0.35, 12, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0xe8f0ff,
        metalness: 0.05,
        roughness: 0.04,
        transmission: 0.9,
        thickness: 0.3,
        transparent: true,
        opacity: 0.75,
        clearcoat: 1,
      })
    )
    var hub = new THREE.Mesh(
      new THREE.SphereGeometry(tube * 1.1, 16, 16),
      goldMat
    )
    g.add(tread)
    g.add(rimRing)
    g.add(hub)
    return g
  }

  function wheel(x) {
    var w = glassTire(0.26, 0.08, 0x9eb6d8)
    w.rotation.y = Math.PI / 2
    w.position.set(x, -0.28, 0.5)
    car.add(w)
    var w2 = glassTire(0.26, 0.08, 0x9eb6d8)
    w2.rotation.y = Math.PI / 2
    w2.position.set(x, -0.28, -0.5)
    car.add(w2)
  }
  wheel(-0.7)
  wheel(0.75)

  car.position.set(0, -0.05, 0)
  car.scale.set(0.9, 0.9, 0.9)
  group.add(car)

  // Large glass tyres flanking the cab
  var tire = glassTire(1.45, 0.18, 0xc5a059)
  tire.rotation.x = Math.PI / 2.15
  tire.position.set(-1.85, 0.15, -0.45)
  group.add(tire)
  var tire2 = glassTire(1.45, 0.18, 0xc5a059)
  tire2.rotation.x = Math.PI / 2.15
  tire2.position.set(1.85, 0.1, -0.4)
  group.add(tire2)
  var tireMid = glassTire(0.95, 0.12, 0xb9d0ef)
  tireMid.rotation.x = Math.PI / 2.4
  tireMid.position.set(0, 0.55, -1.1)
  group.add(tireMid)

  var count = 180
  var positions = new Float32Array(count * 3)
  for (var i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2.2
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1
  }
  var pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  var sparkle = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: 0xe0c37a,
      size: 0.03,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
  scene.add(sparkle)

  function resize() {
    var w = stage.clientWidth
    var h = Math.max(stage.clientHeight, 140)
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
    car.rotation.y = Math.sin(t * 0.4) * 0.22
    car.position.y = -0.05 + Math.sin(t * 0.9) * 0.05
    tire.rotation.z = t * 0.35
    tire2.rotation.z = -t * 0.28
    tireMid.rotation.z = t * 0.22
    group.position.y = Math.sin(t * 0.35) * 0.04
    sparkle.rotation.y = t * 0.04
    renderer.render(scene, camera)
  }
  tick()
})()
