import * as THREE from 'three'
import Keyboard from './Keyboard'
import Hero from './Hero'
import KEYS, { CAMERA_TYPE } from './constants'
import TrigoCircle from './TrigoCircle'
import cameraFactory from './CameraFactory'

let keyboard

let scene
let camera
let shadowLight
let renderer

let globalLight

let HEIGHT
let WIDTH

let hero
let container

function initRenderer() {
	container = document.getElementById('world')
	HEIGHT = container.offsetHeight
	WIDTH = container.width

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
	// scene.fog = new THREE.Fog(0xd6eae6, 150, 300)
}

function handleWindowResize() {
	HEIGHT = container.offsetHeight
	WIDTH = container.offsetWidth
	renderer.setSize(WIDTH, HEIGHT)
	camera.aspect = WIDTH / HEIGHT
	camera.updateProjectionMatrix()
	camera.handleResize()
}

function initScreenAnd3D() {
	initScene()
	camera = cameraFactory(CAMERA_TYPE.ORTHOGRAPHIC)
	initRenderer()

	window.addEventListener('resize', handleWindowResize, false)
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

	camera.update()
	requestAnimationFrame(animate)
}

function init() {
	TrigoCircle.initTrigoCircle()
	keyboard = new Keyboard()

	initScreenAnd3D()
	createLights()
	createHero()
	animate()
	render()
}

// Entry point
window.addEventListener('load', init, false)
