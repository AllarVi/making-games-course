import * as THREE from 'three'
import { FirstPersonControls } from './FirstPersonControls'

const Hero = require('./hero.js')
const keys = require('./constants.js')

//THREEJS RELATED VARIABLES

let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, shadowLight,
  renderer
let controls

let keysDown = {}

let globalLight

let HEIGHT
let WIDTH
let windowHalfX
let windowHalfY

// OTHER VARIABLES

let PI = Math.PI
let hero
let clock
let container

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D () {
  container = document.getElementById('world')
  HEIGHT = container.offsetHeight
  WIDTH = container.width
  windowHalfX = WIDTH / 2
  windowHalfY = HEIGHT / 2

  scene = new THREE.Scene()

  scene.fog = new THREE.Fog(0xd6eae6, 150, 300)

  aspectRatio = WIDTH / HEIGHT
  fieldOfView = 60
  nearPlane = 1
  farPlane = 2000
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  )
  camera.position.x = 0
  camera.position.z = 100
  camera.position.y = 100

  controls = new FirstPersonControls(camera)

  controls.movementSpeed = 10
  controls.lookSpeed = 0.125
  controls.lookVertical = true
  controls.lat = -50
  controls.lon = 270

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })
  renderer.setSize(WIDTH, HEIGHT)
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
  renderer.shadowMap.enabled = true

  container.appendChild(renderer.domElement)

  window.addEventListener('resize', handleWindowResize, false)

  clock = new THREE.Clock()
  handleWindowResize()
}

function handleWindowResize () {
  HEIGHT = container.offsetHeight
  WIDTH = container.offsetWidth
  windowHalfX = WIDTH / 2
  windowHalfY = HEIGHT / 2
  renderer.setSize(WIDTH, HEIGHT)
  camera.aspect = WIDTH / HEIGHT
  camera.updateProjectionMatrix()

  controls.handleResize()
}

function createLights () {
  globalLight = new THREE.AmbientLight(0xffffff, 1)
  shadowLight = new THREE.DirectionalLight(0xffffff, 1)
  shadowLight.position.set(10, 8, 8)
  shadowLight.castShadow = true
  shadowLight.shadow.camera.left = -40
  shadowLight.shadow.camera.right = 40
  shadowLight.shadow.camera.top = 40
  shadowLight.shadow.camera.bottom = -40
  shadowLight.shadow.camera.near = 1
  shadowLight.shadow.camera.far = 1000
  shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048
  scene.add(globalLight)
  scene.add(shadowLight)
}

function createHero () {
  hero = new Hero()
  hero.mesh.position.y = -15
  scene.add(hero.mesh)
}

function handleKeyboardEvents () {
  if (keys.W in keysDown) {
    hero.mesh.position.z -= 1
    hero.mesh.rotation.y = PI / 2
    hero.run()
  }
  if (keys.S in keysDown) {
    hero.mesh.position.z += 1
    hero.mesh.rotation.y = PI + (PI / 2)
    hero.run()
  }
  if (keys.A in keysDown) {
    hero.mesh.position.x -= 1
    hero.mesh.rotation.y = PI
    hero.run()
  }
  if (keys.D in keysDown) {
    hero.mesh.position.x += 1
    hero.mesh.rotation.y = 0
    hero.run()
  }
}

function loop () {

  updateTrigoCircle(hero.runningDistance)
  handleKeyboardEvents()
  render()
  requestAnimationFrame(loop)
}

function render () {
  controls.update(clock.getDelta())
  renderer.render(scene, camera)
}

// Entry point
window.addEventListener('load', init, false)

function initKeyboardEvents () {
  addEventListener('keydown', function (e) {
    e.preventDefault()
    keysDown[e.keyCode] = true
  }, false)

  addEventListener('keyup', function (e) {
    e.preventDefault()
    delete keysDown[e.keyCode]
  }, false)
}

function init () {
  initKeyboardEvents()
  initScreenAnd3D()
  createLights()
  createHero()
  loop()
}

// Trigo Circle
let trigoArc = document.getElementById('trigoArc')
let trigoLine = document.getElementById('trigoLine')
let trigoPoint = document.getElementById('trigoPoint')
let cosPoint = document.getElementById('cosPoint')
let sinPoint = document.getElementById('sinPoint')
let cosLine = document.getElementById('cosLine')
let sinLine = document.getElementById('sinLine')
let projSinLine = document.getElementById('projSinLine')
let projCosLine = document.getElementById('projCosLine')

let tp = {
  radiusArc: 10,
  centerX: 60,
  centerY: 60,
  radiusLines: 50,
}

function updateTrigoCircle (angle) {
  angle %= PI * 2
  let cos = Math.cos(angle)
  let sin = Math.sin(angle)
  let start = {
    x: tp.centerX + tp.radiusArc * cos,
    y: tp.centerY + tp.radiusArc * sin,
  }
  let end = {
    x: tp.centerX + tp.radiusArc,
    y: tp.centerY,
  }

  let arcSweep = angle >= PI ? 1 : 0
  let d = ['M', tp.centerX, tp.centerY,
    'L', start.x, start.y,
    'A', tp.radiusArc, tp.radiusArc, 0, arcSweep, 0, end.x, end.y,
    'L', tp.centerX, tp.centerY,
  ].join(' ')

  trigoArc.setAttribute('d', d)
  trigoLine.setAttribute('x2', tp.centerX + cos * tp.radiusLines)
  trigoLine.setAttribute('y2', tp.centerY + sin * tp.radiusLines)
  trigoPoint.setAttribute('cx', tp.centerX + cos * tp.radiusLines)
  trigoPoint.setAttribute('cy', tp.centerY + sin * tp.radiusLines)
  cosPoint.setAttribute('cx', tp.centerX + cos * tp.radiusLines)
  sinPoint.setAttribute('cy', tp.centerY + sin * tp.radiusLines)
  cosLine.setAttribute('x2', tp.centerX + cos * tp.radiusLines)
  sinLine.setAttribute('y2', tp.centerY + sin * tp.radiusLines)
  projSinLine.setAttribute('x2', tp.centerX + cos * tp.radiusLines)
  projSinLine.setAttribute('y2', tp.centerY + sin * tp.radiusLines)
  projSinLine.setAttribute('y1', tp.centerY + sin * tp.radiusLines)
  projCosLine.setAttribute('x2', tp.centerX + cos * tp.radiusLines)
  projCosLine.setAttribute('x1', tp.centerX + cos * tp.radiusLines)
  projCosLine.setAttribute('y2', tp.centerY + sin * tp.radiusLines)
}