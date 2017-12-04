import * as THREE from 'three'
import Keyboard from './Keyboard'
import Hero from './Hero'
import KEYS, { CAMERA_TYPE, MATERIAL_COLORS } from './constants'
import TrigoCircle from './TrigoCircle'
import cameraFactory from './CameraFactory'
import ShadowLight from './ShadowLight'
import ActivityManager from './ActivityManager'

let keyboard

let scene
let camera
let renderer

let hero

let villain
let villainActivityManager
const villainVector3 = new THREE.Vector3()

let tower

let particleSystem

let bullet
let bulletTime = 0
const bulletAcceleration = 2
const bulletVector3 = new THREE.Vector3()

let container

function initRenderer() {
	container = document.getElementById('world')

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true,
	})
	// Previously: container.width, container.offsetHeight
	renderer.setSize(window.innerWidth, window.innerHeight)
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

	villainActivityManager = new ActivityManager()
}

function createTower() {
	// create the Cube
	tower = new THREE.Mesh(new THREE.CubeGeometry(10, 50, 10), new THREE.MeshNormalMaterial())
	tower.position.y = 10
	tower.position.z = -20
	tower.position.x = 100
	// add the object to the scene
	scene.add(tower)
}

function createBullet() {
	// create the Cube
	bullet = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshNormalMaterial())
	bullet.position.y = 10
	bullet.position.z = -30
	bullet.position.x = 100
	// add the object to the scene
	scene.add(bullet)
}

function createParticle() {
	// create the particle variables
	const particleCount = 50
	const particles = new THREE.Geometry()

	const loader = new THREE.TextureLoader()
	loader.crossOrigin = true
	const pMaterial = new THREE.PointsMaterial({
		color: 0xFFFFFF,
		size: 5,
		map: loader.load('https://aerotwist.com/static/tutorials/creating-particles-with-three-js/images/particle.png'),
		blending: THREE.AdditiveBlending,
		transparent: true,
	})
	// now create the individual particles
	for (let p = 0; p < particleCount; p += 1) {
		// create a particle with random
		// position values, -250 -> 250
		const pX = (Math.random() * 500) - 250
		const pY = (Math.random() * 500) - 250
		const pZ = (Math.random() * 500) - 250
		const particle = new THREE.Vector3(pX, pY, pZ)

		// add it to the geometry
		particles.vertices.push(particle)
	}

	// create the particle system
	particleSystem = new THREE.Points(
		particles,
		pMaterial,
	)

	particleSystem.sortParticles = true

	// add it to the scene
	scene.add(particleSystem)
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

	villainActivityManager.play(script, villain)
}

function animate() {
	requestAnimationFrame(animate)

	TrigoCircle.updateTrigoCircle(hero.runningDistance)

	villainScript()

	keyboard.handleKeyboardEvents(hero, KEYS)

	camera.update()

	// particleSystem.rotation.y += 0.01

	bulletTime += 0.1
	const bulletPosition = (1 / 2) * bulletAcceleration * (bulletTime ** 2)
	bullet.position.z -= bulletPosition

	if (bulletTime > 10) {
		bulletTime = 0
		bullet.position.z = -30
	}

	// Collision
	bulletVector3.setFromMatrixPosition(bullet.matrixWorld)
	villainVector3.setFromMatrixPosition(villain.mesh.matrixWorld)

	// Reset villain position
	if (villainVector3.distanceTo(bulletVector3) < 29) {
		villain.mesh.position.y = -15
		villain.mesh.position.x = -150
		villain.mesh.position.z = -250
	}

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
	createTower()
	createBullet()
	// createParticle()
	animate()
	// render()
}

// Entry point
window.addEventListener('load', init, false)
