"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"
import type { FocusPart, ModelId } from "@/lib/catalog"
type SceneApi = {
  focus: (part: FocusPart) => void
  update: (ids: string[]) => void
}
export default function MachineScene({
  model,
  focus,
  selected,
  resetKey,
  onError,
  label,
}: {
  model: ModelId
  focus: FocusPart
  selected: string[]
  resetKey: number
  onError: () => void
  label: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const api = useRef<SceneApi | null>(null)
  const latest = useRef({ focus, selected })
  useEffect(() => {
    latest.current = { focus, selected }
    api.current?.focus(focus)
    api.current?.update(selected)
  }, [focus, selected])
  useEffect(() => {
    api.current?.focus(focus)
  }, [resetKey, focus])
  useEffect(() => {
    const element = host.current
    if (!element) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      })
    } catch {
      onError()
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearColor(0xeeeeea, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.9
    element.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80)
    camera.position.set(-7.3, 4.9, 8.4)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.07
    controls.minDistance = 2.5
    controls.maxDistance = 16
    controls.maxPolarAngle = Math.PI / 2.08
    controls.minPolarAngle = 0.18
    controls.enablePan = false
    controls.target.set(0, 1.1, 0)
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    const environment = pmrem.fromScene(room, 0.04)
    scene.environment = environment.texture
    room.dispose()
    pmrem.dispose()
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a9182, 2.2))
    const sun = new THREE.DirectionalLight(0xfff8ef, 3.8)
    sun.position.set(-3, 8, 5)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.left = -5
    sun.shadow.camera.right = 5
    sun.shadow.camera.top = 5
    sun.shadow.camera.bottom = -5
    sun.shadow.normalBias = 0.03
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0xe4ebf1, 1.8)
    fill.position.set(4, 4, -6)
    scene.add(fill)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.15 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0.015
    ground.receiveShadow = true
    scene.add(ground)
    const vehicle = new THREE.Group()
    scene.add(vehicle)
    const original = model === "logbullet"
    const scale = model === "megamax" ? 1.1 : 1
    vehicle.scale.setScalar(scale)
    const paint = new THREE.MeshStandardMaterial({
      color: original ? 0xf17b3f : 0x434b48,
      roughness: 0.42,
      metalness: 0.5,
    })
    const dark = new THREE.MeshStandardMaterial({
      color: 0x252b29,
      roughness: 0.53,
      metalness: 0.65,
    })
    const rubber = new THREE.MeshStandardMaterial({
      color: 0x171b19,
      roughness: 0.91,
      metalness: 0,
    })
    const treadMat = new THREE.MeshStandardMaterial({
      color: 0x202521,
      roughness: 0.94,
      metalness: 0,
    })
    const steel = new THREE.MeshStandardMaterial({
      color: 0xaeb5ae,
      roughness: 0.35,
      metalness: 0.8,
    })
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x577370,
      metalness: 0.1,
      roughness: 0.08,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
    })
    const orange = new THREE.MeshStandardMaterial({
      color: 0xf17b3f,
      roughness: 0.45,
      metalness: 0.35,
    })
    const bark = new THREE.MeshStandardMaterial({
      color: 0x74634a,
      roughness: 1,
    })
    const cutWood = new THREE.MeshStandardMaterial({
      color: 0xc9b994,
      roughness: 0.94,
    })
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0xffffe9,
      emissive: 0xfff4cc,
      emissiveIntensity: 2,
    })
    function mesh(
      geometry: THREE.BufferGeometry,
      material: THREE.Material | THREE.Material[],
      position: [number, number, number],
      parent: THREE.Group = vehicle
    ) {
      const m = new THREE.Mesh(geometry, material)
      m.position.set(...position)
      m.castShadow = true
      m.receiveShadow = true
      parent.add(m)
      return m
    }
    function box(
      size: [number, number, number],
      position: [number, number, number],
      material: THREE.Material = dark,
      parent = vehicle
    ) {
      return mesh(new THREE.BoxGeometry(...size), material, position, parent)
    }
    function beam(
      a: [number, number, number],
      b: [number, number, number],
      width: number,
      depth: number,
      material: THREE.Material = dark,
      parent = vehicle
    ) {
      const start = new THREE.Vector3(...a),
        end = new THREE.Vector3(...b)
      const mid = start.clone().add(end).multiplyScalar(0.5)
      const m = box(
        [width, start.distanceTo(end), depth],
        [mid.x, mid.y, mid.z],
        material,
        parent
      )
      m.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        end.sub(start).normalize()
      )
      return m
    }
    function rod(
      a: [number, number, number],
      b: [number, number, number],
      radius: number,
      material: THREE.Material = steel,
      parent = vehicle
    ) {
      const start = new THREE.Vector3(...a),
        end = new THREE.Vector3(...b)
      const mid = start.clone().add(end).multiplyScalar(0.5)
      const m = mesh(
        new THREE.CylinderGeometry(radius, radius, start.distanceTo(end), 10),
        material,
        [mid.x, mid.y, mid.z],
        parent
      )
      m.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        end.sub(start).normalize()
      )
      return m
    }
    box([2.35, 0.24, 0.68], [-1.42, 0.72, 0])
    box([2.65, 0.2, 0.55], [1.35, 0.74, 0])
    rod([-0.35, 0.69, 0], [0.2, 0.69, 0], 0.16)
    // Four bogie axles and eight individually treaded tyres.
    ;[-2.15, -1.28, 0.85, 1.76].forEach((x) => {
      rod([x, 0.49, -0.7], [x, 0.49, 0.7], 0.1, dark)
      ;[-0.72, 0.72].forEach((z) => {
        const wheel = new THREE.Group()
        wheel.position.set(x, 0.47, z)
        vehicle.add(wheel)
        const tyre = mesh(
          new THREE.CylinderGeometry(0.46, 0.46, 0.34, 32),
          rubber,
          [0, 0, 0],
          wheel
        )
        tyre.rotation.x = Math.PI / 2
        const side = z > 0 ? 1 : -1
        const rim = mesh(
          new THREE.CylinderGeometry(0.255, 0.255, 0.027, 32),
          steel,
          [0, 0, side * 0.18],
          wheel
        )
        rim.rotation.x = Math.PI / 2
        const hub = mesh(
          new THREE.CylinderGeometry(0.105, 0.105, 0.06, 20),
          dark,
          [0, 0, side * 0.2],
          wheel
        )
        hub.rotation.x = Math.PI / 2
        for (let n = 0; n < 6; n++) {
          const angle = (n * Math.PI) / 3
          const bolt = mesh(
            new THREE.CylinderGeometry(0.017, 0.017, 0.028, 6),
            steel,
            [Math.sin(angle) * 0.15, Math.cos(angle) * 0.15, side * 0.209],
            wheel
          )
          bolt.rotation.x = Math.PI / 2
        }
        for (let n = 0; n < 22; n++) {
          const angle = (n * Math.PI * 2) / 22
          for (const t of [-1, 1]) {
            const tread = box(
              [0.11, 0.045, 0.21],
              [Math.sin(angle) * 0.456, Math.cos(angle) * 0.456, t * 0.09],
              treadMat,
              wheel
            )
            tread.rotation.z = -angle
            tread.rotation.y = t * 0.4
          }
        }
      })
    })
    box([1.12, 0.88, 0.91], [-2.03, 1.24, 0], paint)
    box([1.17, 0.045, 0.96], [-2.04, 1.705, 0], paint)
    for (const z of [-0.46, 0.46])
      for (let n = 0; n < 5; n++)
        box([0.52, 0.045, 0.009], [-2.17, 1.17 + n * 0.087, z], dark)
    box([0.3, 0.07, 0.52], [-2.5, 0.88, 0], dark)
    box([0.77, 0.065, 1.5], [-1.36, 1.02, 0], paint)
    // Operator platform, seat, controls and protective cabin frame.
    box([0.92, 0.12, 1.02], [-0.95, 1.12, 0], dark)
    box([0.43, 0.13, 0.47], [-1.07, 1.54, 0], rubber)
    box([0.12, 0.53, 0.48], [-1.24, 1.8, 0], rubber)
    rod([-1.03, 1.19, 0], [-1.03, 1.49, 0], 0.11, dark)
    for (const z of [-0.48, 0.48]) {
      beam([-1.54, 1.15, z], [-1.58, 2.65, z], 0.05, 0.06)
      beam([-0.48, 1.15, z], [-0.53, 2.65, z], 0.05, 0.06)
      box([1.1, 0.08, 0.05], [-1.03, 2.15, z], dark)
      rod([-0.92, 1.66, z * 0.68], [-0.88, 1.87, z * 0.68], 0.025, dark)
      mesh(new THREE.SphereGeometry(0.05, 12, 8), rubber, [
        -0.88,
        1.88,
        z * 0.68,
      ])
    }
    box([1.28, 0.085, 1.19], [-1.04, 2.68, 0], paint)
    if (!original) {
      box([1.03, 1.45, 0.015], [-1.03, 1.91, -0.48], glass)
      box([1.03, 1.45, 0.015], [-1.03, 1.91, 0.48], glass)
      box([0.015, 1.43, 0.94], [-1.55, 1.91, 0], glass)
      box([0.015, 1.43, 0.94], [-0.52, 1.91, 0], glass)
      box([0.56, 0.05, 0.025], [-0.96, 2, 0.515], steel)
    }
    box([0.27, 0.04, 0.31], [-0.91, 0.88, 0.67], steel)
    box([0.27, 0.04, 0.31], [-0.91, 0.63, 0.74], steel)
    // Steel timber bunks and headboard.
    ;[0.55, 1.83].forEach((x) => {
      box([0.1, 0.15, 1.53], [x, 0.91, 0], steel)
      for (const z of [-0.77, 0.77]) {
        rod([x, 0.9, z], [x, 1.76, z * 0.9], 0.039)
        rod([x, 1.76, z * 0.9], [x, 1.88, z * 0.73], 0.039)
      }
    })
    for (const z of [-0.64, -0.32, 0, 0.32, 0.64])
      rod([0.31, 0.91, z], [0.31, 1.9, z], 0.021, steel)
    rod([0.31, 1.9, -0.68], [0.31, 1.9, 0.68], 0.045, steel)
    // Articulated folded forestry crane with hydraulic rams and hoses.
    const crane = new THREE.Group()
    vehicle.add(crane)
    rod([-0.03, 0.81, 0], [-0.03, 1.5, 0], 0.15, dark, crane)
    beam([-0.03, 1.33, 0], [0.18, 3.28, 0], 0.23, 0.25, dark, crane)
    beam([0.18, 3.28, 0], [1.62, 2.5, 0], 0.19, 0.21, dark, crane)
    beam([1.38, 2.62, 0], [2.13, 2.18, 0], 0.12, 0.14, steel, crane)
    rod([0.1, 1.6, 0.16], [0.25, 2.96, 0.16], 0.055, steel, crane)
    rod([0.22, 2.78, 0.17], [1.27, 2.57, 0.17], 0.05, steel, crane)
    ;[
      [0.18, 3.28, 0],
      [1.62, 2.5, 0],
      [-0.03, 1.4, 0],
    ].forEach(([x, y, z]) => {
      const pin = mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.29, 20),
        paint,
        [x, y, z],
        crane
      )
      pin.rotation.x = Math.PI / 2
    })
    const hoseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.17, 1.15, 0.18),
      new THREE.Vector3(-0.02, 2.4, 0.18),
      new THREE.Vector3(0.1, 3.43, 0.17),
      new THREE.Vector3(0.83, 3.05, 0.17),
      new THREE.Vector3(1.62, 2.6, 0.17),
    ])
    mesh(
      new THREE.TubeGeometry(hoseCurve, 32, 0.024, 7, false),
      rubber,
      [0, 0, 0],
      crane
    )
    rod([2.13, 2.18, 0], [2.13, 1.93, 0], 0.065, dark, crane)
    box([0.23, 0.18, 0.23], [2.13, 1.91, 0], orange, crane)
    for (const z of [-0.14, 0.14]) {
      beam([2.09, 1.83, z], [1.82, 1.55, z], 0.065, 0.065, dark, crane)
      beam([1.82, 1.55, z], [2.11, 1.47, z], 0.06, 0.06, dark, crane)
      beam([2.19, 1.83, z], [2.45, 1.55, z], 0.065, 0.065, dark, crane)
      beam([2.45, 1.55, z], [2.16, 1.47, z], 0.06, 0.06, dark, crane)
    }
    const timber = new THREE.Group()
    vehicle.add(timber)
    for (let n = 0; n < 5; n++) {
      const y = 1.1 + (n > 2 ? 0.23 : 0),
        z = n > 2 ? (n - 3.5) * 0.29 : (n - 1) * 0.3
      const log = mesh(
        new THREE.CylinderGeometry(0.13, 0.15, 2.36, 14),
        [bark, cutWood, cutWood],
        [1.35, y, z],
        timber
      )
      log.rotation.z = Math.PI / 2
    }
    const extension = new THREE.Group()
    vehicle.add(extension)
    box([0.86, 0.12, 0.52], [2.62, 0.78, 0], dark, extension)
    box([0.1, 0.13, 1.4], [2.81, 0.92, 0], steel, extension)
    for (const z of [-0.7, 0.7])
      rod([2.81, 0.94, z], [2.81, 1.71, z * 0.85], 0.035, steel, extension)
    const lights = new THREE.Group()
    vehicle.add(lights)
    for (const z of [-0.4, 0.4]) {
      box([0.09, 0.11, 0.19], [-1.67, 2.63, z], dark, lights)
      box([0.01, 0.07, 0.14], [-1.72, 2.64, z], lightMat, lights)
    }
    const ac = new THREE.Group()
    vehicle.add(ac)
    box([0.54, 0.18, 0.7], [-1.04, 2.81, 0], paint, ac)
    for (let n = 0; n < 5; n++)
      box([0.36, 0.007, 0.022], [-1.04, 2.905, -0.19 + n * 0.09], dark, ac)
    const storage = new THREE.Group()
    vehicle.add(storage)
    box([0.42, 0.3, 0.25], [-0.73, 1.3, 0.65], steel, storage)
    const winch = new THREE.Group()
    vehicle.add(winch)
    const spool = mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.28, 20),
      steel,
      [0.02, 1.47, 0.34],
      winch
    )
    spool.rotation.x = Math.PI / 2
    box([0.38, 0.34, 0.07], [0.02, 1.47, 0.51], dark, winch)
    const spare = new THREE.Group()
    vehicle.add(spare)
    const tyre = mesh(
      new THREE.CylinderGeometry(0.44, 0.44, 0.25, 30),
      rubber,
      [2.58, 1.17, 0],
      spare
    )
    tyre.rotation.x = Math.PI / 2
    let dirty = true
    let animating = true
    const targetPosition = camera.position.clone()
    const targetLook = controls.target.clone()
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const views: Record<
      FocusPart,
      { position: [number, number, number]; look: [number, number, number] }
    > = {
      all: { position: [-7.3, 4.9, 8.4], look: [0, 1.2, 0] },
      cabin: { position: [-4.5, 3.1, 4.5], look: [-1.12, 1.75, 0] },
      crane: { position: [3.9, 4.1, 5.5], look: [0.7, 2.1, 0] },
      wheels: { position: [-4, 1.65, 4.6], look: [-1.2, 0.7, 0] },
      load: { position: [5, 3.5, 4.5], look: [1.4, 1.1, 0] },
    }
    api.current = {
      focus(part) {
        dirty = true
        const view = views[part]
        targetPosition.set(...view.position).multiplyScalar(scale)
        targetLook.set(...view.look).multiplyScalar(scale)
        if (reduced) {
          camera.position.copy(targetPosition)
          controls.target.copy(targetLook)
        }
        animating = true
      },
      update(ids) {
        dirty = true
        extension.visible = ids.includes("extension")
        lights.visible = ids.includes("lights")
        ac.visible = !original && ids.includes("ac")
        storage.visible = ids.includes("storage")
        winch.visible = ids.includes("winch")
        spare.visible = ids.includes("spare")
        crane.scale.x = ids.includes("crane42") ? 1.1 : 1
        timber.scale.x = ids.includes("extension") ? 1.2 : 1
      },
    }
    api.current.update(latest.current.selected)
    api.current.focus(latest.current.focus)
    const stopAnimation = () => {
      animating = false
    }
    controls.addEventListener("start", stopAnimation)
    const resize = () => {
      const { width, height } = element.getBoundingClientRect()
      if (width < 1 || height < 1) return
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      dirty = true
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    resize()
    const contextLost = (event: Event) => {
      event.preventDefault()
      onError()
    }
    renderer.domElement.addEventListener("webglcontextlost", contextLost)
    let frame = 0
    let previous = 0
    function animate(time: number) {
      frame = requestAnimationFrame(animate)
      if (document.hidden) return
      const delta = Math.min((time - previous) / 1000, 0.05)
      previous = time
      if (animating) {
        const ease = reduced ? 1 : 1 - Math.exp(-5 * delta)
        camera.position.lerp(targetPosition, ease)
        controls.target.lerp(targetLook, ease)
        if (camera.position.distanceTo(targetPosition) < 0.008)
          animating = false
      }
      const changed = controls.update()
      if (animating || changed || dirty) {
        renderer.render(scene, camera)
        dirty = false
      }
    }
    frame = requestAnimationFrame(animate)
    return () => {
      api.current = null
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.removeEventListener("start", stopAnimation)
      controls.dispose()
      renderer.domElement.removeEventListener("webglcontextlost", contextLost)
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          const materials = Array.isArray(obj.material)
            ? obj.material
            : [obj.material]
          materials.forEach((mat) => mat.dispose())
        }
      })
      environment.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [model, onError])
  return (
    <div ref={host} className="machine-canvas" role="img" aria-label={label} />
  )
}
