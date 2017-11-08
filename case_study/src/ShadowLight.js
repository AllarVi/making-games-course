import * as THREE from 'three'

export default class ShadowLight extends THREE.DirectionalLight {
	constructor() {
		super(0xffffff, 1)

		this.position.set(10, 8, 8)
		this.castShadow = true
		this.shadow.camera.left = -40
		this.shadow.camera.right = 40
		this.shadow.camera.top = 40
		this.shadow.camera.bottom = -40
		this.shadow.camera.near = 1
		this.shadow.camera.far = 1000
		this.shadow.mapSize.height = 2048
		this.shadow.mapSize.width = 2048
	}
}
