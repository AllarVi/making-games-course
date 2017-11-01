import * as THREE from 'three'
import { FirstPersonControls } from './FirstPersonControls'
import Keyboard from './Keyboard'
import Hero from './Hero'
import KEYS from './constants'
import TrigoCircle from './TrigoCircle'

let keyboard

// THREEJS RELATED VARIABLES

let scene
let camera
let shadowLight
let renderer
let firstPersonControls

let globalLight

let HEIGHT
let WIDTH

// OTHER VARIABLES

let hero
let clock
let container

// INIT THREE JS, SCREEN AND MOUSE EVENTS

function initCamera() {
	const aspectRatio = WIDTH / HEIGHT
	const fieldOfView = 60
	const nearPlane = 1
	const farPlane = 2000
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane,
	)
	camera.position.x = 0
	camera.position.z = 100
	camera.position.y = 20
}

function initFirstPersonControls() {
	firstPersonControls = new FirstPersonControls(camera)

	firstPersonControls.movementSpeed = 10
	firstPersonControls.lookSpeed = 0.125
	firstPersonControls.lookVertical = true
	// firstPersonControls.lat = -50
	firstPersonControls.lat = 0
	// firstPersonControls.lon = 270
	firstPersonControls.lon = 270
}

function initRenderer() {
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true,
	})
	renderer.setSize(WIDTH, HEIGHT)
	renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
	renderer.shadowMap.enabled = true

	container.appendChild(renderer.domElement)
}

function initScene() {
	scene = new THREE.Scene()
	scene.fog = new THREE.Fog(0xd6eae6, 150, 300)
}

function handleWindowResize() {
	HEIGHT = container.offsetHeight
	WIDTH = container.offsetWidth
	renderer.setSize(WIDTH, HEIGHT)
	camera.aspect = WIDTH / HEIGHT
	camera.updateProjectionMatrix()

	firstPersonControls.handleResize()
}

function initScreenAnd3D() {
	container = document.getElementById('world')
	HEIGHT = container.offsetHeight
	WIDTH = container.width

	initScene()
	initCamera()
	initFirstPersonControls()
	initRenderer()

	window.addEventListener('resize', handleWindowResize, false)

	clock = new THREE.Clock()

	handleWindowResize()
}

function createLights() {
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
	shadowLight.shadow.mapSize.height = 2048
	shadowLight.shadow.mapSize.width = 2048
	scene.add(globalLight)
	scene.add(shadowLight)
}

function createHero() {
	hero = new Hero()
	hero.mesh.position.y = -15
	scene.add(hero.mesh)
}

function render() {
	renderer.render(scene, camera)
}

function animate() {
	TrigoCircle.updateTrigoCircle(hero.runningDistance)

	if (keyboard.keysDown.anyKeyDown) {
		requestAnimationFrame(render)
	}

	keyboard.handleKeyboardEvents(hero, KEYS)
	firstPersonControls.update(clock.getDelta())
	requestAnimationFrame(animate)
}

function init() {
	TrigoCircle.initTrigoCircle()

	keyboard = new Keyboard()
	keyboard.initKeyboardEvents()

	initScreenAnd3D()
	createLights()
	createHero()
	animate()
	render()
}

// Entry point
window.addEventListener('load', init, false)

