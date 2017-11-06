import * as THREE from 'three'

export default class OrthographicCamera extends THREE.OrthographicCamera {
	constructor() {
		const aspect = window.innerWidth / window.innerHeight
		const d = 150

		super(
			-d * aspect,
			d * aspect,
			d,
			-d,
			1,
			4000,
		)

		this.position.x = 20
		this.position.z = 20
		this.position.y = 120

		this.rotation.y = Math.PI
		this.rotation.x = (3 / 4) * Math.PI
		this.rotation.z = Math.PI

		return this
	}

	update() {
		// Not implemented
	}

	handleResize() {
		// Not implemented
	}
}
