import * as THREE from 'three'
import Keyboard from './Keyboard'
import Hero from './Hero'
import KEYS, { CAMERA_TYPE, MATERIAL_COLORS } from './constants'
import TrigoCircle from './TrigoCircle'
import cameraFactory from './CameraFactory'
import ShadowLight from './ShadowLight'

let keyboard

let scene
let camera
let renderer

let hero
let villain
let container

function initRenderer() {
	container = document.getElementById('world')

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true,
	})
	renderer.setSize(container.width, container.offsetHeight)
	renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
	renderer.shadowMap.enabled = true

	container.appendChild(renderer.domElement)
}

function initScene() {
	scene = new THREE.Scene()
	// scene.fog = new THREE.Fog(0xd6eae6, 150, 300)
}

function handleWindowResize() {
	const containerOffsetHeight = container.offsetHeight
	const containerOffsetWidth = container.offsetWidth

	renderer.setSize(containerOffsetWidth, containerOffsetHeight)
	camera.aspect = containerOffsetWidth / containerOffsetHeight
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
	const globalLight = new THREE.AmbientLight(0xffffff, 1)
	const shadowLight = new ShadowLight()

	scene.add(globalLight)
	scene.add(shadowLight)
}

function createHero() {
	hero = new Hero(MATERIAL_COLORS.BLUE)
	hero.mesh.position.y = -15
	scene.add(hero.mesh)
}

function createVillain() {
	villain = new Hero(MATERIAL_COLORS.RED)
	villain.mesh.position.y = -15
	villain.mesh.position.x = -150
	villain.mesh.position.z = -250
	scene.add(villain.mesh)
}

function render() {
	renderer.render(scene, camera)
}

function villainScript() {
	const script = [
		{ activity: villain.moveDown, time: 50 },
		{ activity: villain.moveRight, time: 100 },
		{ activity: villain.moveDown, time: 50 },
	]

	villain.activityManager(script)
}

function animate() {
	requestAnimationFrame(animate)

	TrigoCircle.updateTrigoCircle(hero.runningDistance)

	villainScript()

	keyboard.handleKeyboardEvents(hero, KEYS)

	camera.update()
	render()
}

function initFloor() {
	const geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1)
	const material = new THREE.MeshBasicMaterial({ color: 0xD9EEFC })
	const floor = new THREE.Mesh(geometry, material)
	floor.material.side = THREE.DoubleSide
	floor.rotation.x = Math.PI / 2
	floor.position.y = -20
	scene.add(floor)
}

function init() {
	TrigoCircle.initTrigoCircle()
	keyboard = new Keyboard()

	initScreenAnd3D()
	initFloor()
	createLights()
	createHero()
	createVillain()
	animate()
	render()
}

// Entry point
window.addEventListener('load', init, false)
