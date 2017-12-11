import * as THREE from 'three'
import Hero from './Hero'
import KEYS, { CAMERA_TYPE, MATERIAL_COLORS } from './constants'
import TrigoCircle from './TrigoCircle'
import cameraFactory from './CameraFactory'
import ShadowLight from './ShadowLight'
import ActivityManager from './ActivityManager'
import PlayerManager from './PlayerManager'
import { createLabel, updateLabelText } from './LabelManager'

const Stats = require('stats.js')

const stats = new Stats()
stats.showPanel(2) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

let playerManager

let scene
let camera
let renderer

let hero

let villain
let villainActivityManager
const villainVector3 = new THREE.Vector3()

const towerList = []

let particleSystem

let bulletTime = 0
const bulletAcceleration = 2
const bulletVector3 = new THREE.Vector3()
let bullets = []
let bulletIndex = 0

let container

const towerListLabel = createLabel(40, 200)
const availableTowersLabel = createLabel(60, 200)

const bulletsInGameLabel = createLabel(80, 200)
const healthLabel = createLabel(40, 800)

function initRenderer() {
	container = document.getElementById('world')

	renderer = new THREE.WebGLRenderer({
		alpha: false,
		antialias: false,
	})
	// Previously: container.width, container.offsetHeight
	// renderer.setSize(window.innerWidth, window.innerHeight)
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

function createBullet(positionY, positionZ, positionX) {
	const newBullet = new THREE.Mesh(
		new THREE.SphereGeometry(5),
		new THREE.MeshNormalMaterial(),
	)

	newBullet.position.y = positionY
	newBullet.position.z = positionZ
	newBullet.position.x = positionX

	scene.add(newBullet)

	return newBullet
}

function createTower(positionY, positionZ, positionX) {
	const newTower = new THREE.Mesh(
		new THREE.CubeGeometry(10, 50, 10),
		new THREE.MeshNormalMaterial(),
	)

	newTower.position.y = positionY
	newTower.position.z = positionZ
	newTower.position.x = positionX

	scene.add(newTower)

	const newBullet = createBullet(
		newTower.position.y,
		newTower.position.z - 10,
		newTower.position.x,
	)

	const bulletClass = {
		bullet: newBullet,
		initialPositionY: positionY,
		initialPositionZ: newTower.position.z - 10,
		initialPositionX: positionX,
	}
	bullets = bullets.concat(bulletClass)

	return newTower
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

function bulletLogic() {
	if (!bullets[bulletIndex]) {
		bulletIndex = 0
	}

	bulletTime += 0.1

	bullets[bulletIndex].bullet.position.z -= (1 / 2) * bulletAcceleration * (bulletTime ** 2)

	if (bulletTime > 10) {
		bulletTime = 0
		bullets[bulletIndex].bullet.position.z = bullets[bulletIndex].initialPositionZ
	}

	// Collision
	bullets.forEach((bulletClass) => {
		bulletVector3.setFromMatrixPosition(bulletClass.bullet.matrixWorld)
		villainVector3.setFromMatrixPosition(villain.mesh.matrixWorld)

		// Reset villain position and restart script
		if (villainVector3.distanceTo(bulletVector3) > 0 &&
			villainVector3.distanceTo(bulletVector3) < 29) {
			villain.mesh.position.y = -15
			villain.mesh.position.x = -150
			villain.mesh.position.z = -250

			villainActivityManager = new ActivityManager()
			villainScript()

			playerManager.availableTowers += 1
		}
	})

	bulletIndex += 1
}

function animate() {
	stats.begin()
	// requestAnimationFrame(animate)

	// TrigoCircle.updateTrigoCircle(hero.runningDistance)

	villainScript()

	playerManager.keyboard.handleKeyboardEvents(hero, KEYS)

	if (playerManager.availableTowers > 0) {
		if (playerManager.keyboard.handleSpawnTowerKey(hero, KEYS)) {
			playerManager.availableTowers -= 1
		}
	}

	// camera.update()

	// particleSystem.rotation.y += 0.01

	bulletLogic()

	updateLabelText(towerListLabel, `New towers built: ${towerList.length}`)
	updateLabelText(availableTowersLabel, `Available towers: ${playerManager.availableTowers}`)
	updateLabelText(bulletsInGameLabel, `Bullets in game: ${bullets.length}`)

	updateLabelText(healthLabel, `Health: ${playerManager.health}`)

	render()

	stats.end()
	requestAnimationFrame(animate)
}

export default function spawnTower() {
	const newTower = createTower(
		hero.mesh.position.y,
		hero.mesh.position.z,
		hero.mesh.position.x,
	)

	towerList.push(newTower)
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
	playerManager = new PlayerManager()

	initScreenAnd3D()
	initFloor()
	createLights()
	createHero()
	createVillain()
	createTower(10, -20, 100)
	// createParticle()
	animate()
}

// Entry point
window.addEventListener('load', init, false)
