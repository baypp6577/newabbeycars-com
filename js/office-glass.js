/**
 * Three.js glass cab behind the "I need" switcher.
 * Car-shaped glass body with glowing glass tyres under the chassis.
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
  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40)
  camera.position.set(0, 0.55, 5.8)

  var car = new THREE.Group()
  scene.add(car)

  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  var key = new THREE.DirectionalLight(0xfff4dd, 0.95)
  key.position.set(2.2, 3.2, 4)
  scene.add(key)
  var rimLight = new THREE.DirectionalLight(0xc5a059, 0.4)
  rimLight.position.set(-3, 2, -1)
  scene.add(rimLight)
  var fill = new THREE.DirectionalLight(0x6b8ec4, 0.4)
  fill.position.set(-2, -0.5, 3)
  scene.add(fill)

  var glassBody = new THREE.MeshPhysicalMaterial({
    color: 0x1a3358,
    metalness: 0.25,
    roughness: 0.12,
    transmission: 0.55,
    thickness: 0.5,
    transparent: true,
    opacity: 0.9,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  })
  var glassCabin = new THREE.MeshPhysicalMaterial({
    color: 0xc5d8f2,
    metalness: 0.02,
    roughness: 0.04,
    transmission: 0.88,
    thickness: 0.35,
    transparent: true,
    opacity: 0.85,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
  })
  var goldMat = new THREE.MeshStandardMaterial({
    color: 0xc5a059,
    metalness: 0.85,
    roughness: 0.2,
    emissive: 0xc5a059,
    emissiveIntensity: 0.2,
  })
  var hatMat = new THREE.MeshStandardMaterial({
    color: 0xe11d48,
    metalness: 0.3,
    roughness: 0.3,
    emissive: 0xbe123c,
    emissiveIntensity: 0.35,
  })
  var glassTireMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0c37a,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.75,
    thickness: 0.35,
    transparent: true,
    opacity: 0.92,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    emissive: 0xc5a059,
    emissiveIntensity: 0.35,
    side: THREE.DoubleSide,
  })
  var glassRimMat = new THREE.MeshPhysicalMaterial({
    color: 0xeef4ff,
    metalness: 0.05,
    roughness: 0.03,
    transmission: 0.9,
    thickness: 0.2,
    transparent: true,
    opacity: 0.8,
    emissive: 0x93c5fd,
    emissiveIntensity: 0.25,
  })

  // Chassis / body — car silhouette
  var lower = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.38, 1.05), glassBody)
  lower.position.set(0, 0.05, 0)
  car.add(lower)
  // Hood / nose taper feel
  var nose = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.28, 0.95), glassBody)
  nose.position.set(1.35, 0.0, 0)
  car.add(nose)
  // Cabin / greenhouse
  var cabin = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.48, 0.92), glassCabin)
  cabin.position.set(-0.15, 0.42, 0)
  car.add(cabin)
  // Boot
  var boot = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.3, 0.92), glassBody)
  boot.position.set(-1.15, 0.18, 0)
  car.add(boot)
  // Side skirts / gold trim
  var trim = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.06, 1.08), goldMat)
  trim.position.set(0, -0.12, 0)
  car.add(trim)

  // Cab roof light (hat)
  var hatStem = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.16), hatMat)
  hatStem.position.set(0.05, 0.72, 0)
  car.add(hatStem)
  var hat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.26), hatMat)
  hat.position.set(0.05, 0.88, 0)
  car.add(hat)
  var hatGlow = new THREE.PointLight(0xfb7185, 0.7, 4)
  hatGlow.position.set(0.05, 1.0, 0.35)
  car.add(hatGlow)

  function makeWheel() {
    var g = new THREE.Group()
    var tread = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.1, 16, 48), glassTireMat)
    tread.rotation.y = Math.PI / 2
    var rim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 12, 32), glassRimMat)
    rim.rotation.y = Math.PI / 2
    var hub = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), goldMat)
    var glow = new THREE.PointLight(0xe0c37a, 0.55, 2.2)
    glow.position.set(0, 0, 0.15)
    g.add(tread)
    g.add(rim)
    g.add(hub)
    g.add(glow)
    g.userData.tread = tread
    return g
  }

  // Wheels sit under the body like real tyres
  var wheelFL = makeWheel()
  wheelFL.position.set(0.85, -0.38, 0.55)
  car.add(wheelFL)
  var wheelFR = makeWheel()
  wheelFR.position.set(0.85, -0.38, -0.55)
  car.add(wheelFR)
  var wheelRL = makeWheel()
  wheelRL.position.set(-0.95, -0.38, 0.55)
  car.add(wheelRL)
  var wheelRR = makeWheel()
  wheelRR.position.set(-0.95, -0.38, -0.55)
  car.add(wheelRR)

  var wheels = [wheelFL, wheelFR, wheelRL, wheelRR]

  car.position.set(0, 0.15, 0)
  car.scale.set(1.05, 1.05, 1.05)

  var count = 120
  var positions = new Float32Array(count * 3)
  for (var i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 6
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1.6 + 0.4
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2 - 0.5
  }
  var pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  var sparkle = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: 0xe0c37a,
      size: 0.025,
      transparent: true,
      opacity: 0.4,
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
    car.rotation.y = Math.sin(t * 0.35) * 0.18
    car.position.y = 0.15 + Math.sin(t * 0.85) * 0.03
    for (var w = 0; w < wheels.length; w++) {
      var tread = wheels[w].userData.tread
      if (tread) tread.rotation.z = t * (w % 2 === 0 ? 1.4 : -1.4)
    }
    sparkle.rotation.y = t * 0.03
    renderer.render(scene, camera)
  }
  tick()
})()
