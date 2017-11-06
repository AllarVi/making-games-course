import * as THREE from 'three'
import { FirstPersonControls } from './FirstPersonControls'

export default class PerspectiveCamera extends THREE.PerspectiveCamera {
	constructor() {
		const container = document.getElementById('world')

		const aspectRatio = container.width / container.offsetHeight
		const fieldOfView = 60
		const nearPlane = 1
		const farPlane = 2000

		super(
			fieldOfView,
			aspectRatio,
			nearPlane,
			farPlane,
		)

		this.position.x = 0
		this.position.z = 100
		this.position.y = 20

		this.initFirstPersonControls()

		this.clock = new THREE.Clock()

		return this
	}

	initFirstPersonControls() {
		this.firstPersonControls = new FirstPersonControls(this)

		this.firstPersonControls.movementSpeed = 10
		this.firstPersonControls.lookSpeed = 0.125
		this.firstPersonControls.lookVertical = true
		// firstPersonControls.lat = -50
		this.firstPersonControls.lat = 0
		// firstPersonControls.lon = 270
		this.firstPersonControls.lon = 270
	}

	update() {
		this.firstPersonControls.update(this.clock.getDelta())
	}

	handleResize() {
		this.firstPersonControls.handleResize()
	}
}
