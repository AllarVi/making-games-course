import * as THREE from 'three'
import { blueMat, brownMat, MATERIAL_COLORS as MATERIALS_COLORS, redMat } from './constants'

export default class Hero {
	constructor(materialColor) {
		this.runningDistance = 0
		this.jumpingDistance = 0

		this.mesh = new THREE.Group()
		this.body = new THREE.Group()
		this.mesh.add(this.body)

		let mainMaterial
		if (materialColor === MATERIALS_COLORS.RED) {
			mainMaterial = redMat
		} else if (materialColor === MATERIALS_COLORS.BLUE) {
			mainMaterial = blueMat
		}

		const torsoGeom = new THREE.CubeGeometry(8, 8, 8, 1)
		this.torso = new THREE.Mesh(torsoGeom, mainMaterial)
		this.torso.position.y = 8
		this.torso.castShadow = true
		this.torso.receiveShadow = true
		this.body.add(this.torso)

		const handGeom = new THREE.CubeGeometry(3, 3, 3, 1)
		this.handR = new THREE.Mesh(handGeom, brownMat)
		this.handR.position.z = 7
		this.handR.position.y = 8
		this.handR.castShadow = true
		this.handR.receiveShadow = true
		this.body.add(this.handR)

		this.handL = this.handR.clone()
		this.handL.position.z = -this.handR.position.z
		this.body.add(this.handL)

		const headGeom = new THREE.CubeGeometry(16, 16, 16, 1)
		this.head = new THREE.Mesh(headGeom, mainMaterial)
		this.head.position.y = 21
		this.head.castShadow = true
		this.head.receiveShadow = true
		this.body.add(this.head)

		const legGeom = new THREE.CubeGeometry(8, 3, 5, 1)

		this.legR = new THREE.Mesh(legGeom, brownMat)
		this.legR.position.x = 0
		this.legR.position.z = 7
		this.legR.position.y = 0
		this.legR.castShadow = true
		this.legR.receiveShadow = true
		this.body.add(this.legR)

		this.legL = this.legR.clone()
		this.legL.position.z = -this.legR.position.z
		this.legL.castShadow = true
		this.legL.receiveShadow = true
		this.body.add(this.legL)
	}

	run() {
		const s = 0.2

		let radians = this.runningDistance
		radians %= (2 * Math.PI)
		this.runningDistance += s

		const amplitude = 4
		this._handleRightLegRunAnimation(radians, amplitude)
		this._handleLeftLegRunAnimation(radians, amplitude)
		this._handleTorsoRunAnimation(radians, amplitude)
		this._handleHeadRunAnimation(radians, amplitude)
		this._handleRightHandRunAnimation(radians, amplitude)
		this._handleLeftHandRunAnimation(radians, amplitude)
	}

	jump() {
		const s = 0.1

		let radians = this.jumpingDistance
		radians %= (2 * Math.PI)
		this.jumpingDistance += s

		const amplitude = 8
		this._handleRightLegJumpAnimation(radians, amplitude)
		this._handleLeftLegJumpAnimation(radians, amplitude)
		this._handleTorsoJumpAnimation(radians, amplitude)
		this._handleHeadJumpAnimation(radians, amplitude)
		this._handleRightHandJumpAnimation(radians, amplitude)
		this._handleLeftHandJumpAnimation(radians, amplitude)
	}

	// Running
	_handleLeftHandRunAnimation(radians, amplitude) {
		this.handL.position.x = -Math.cos(radians + Math.PI) * amplitude
		this.handL.rotation.z = -Math.cos(radians + Math.PI) * (Math.PI / 8)
	}

	_handleRightHandRunAnimation(radians, amplitude) {
		this.handR.position.x = -Math.cos(radians) * amplitude
		this.handR.rotation.z = -Math.cos(radians) * (Math.PI / 8)
	}

	_handleHeadRunAnimation(radians, amplitude) {
		this.head.position.y = 21 - (Math.cos(radians * 2) * amplitude * 0.3)
		this.head.rotation.x = Math.cos(radians) * amplitude * 0.02
		this.head.rotation.y = Math.cos(radians) * amplitude * 0.01
	}

	_handleTorsoRunAnimation(radians, amplitude) {
		this.torso.position.y = 8 - (Math.cos(radians * 2) * amplitude * 0.2)
		this.torso.rotation.y = -Math.cos(radians + Math.PI) * amplitude * 0.05
	}

	_handleLeftLegRunAnimation(radians, amplitude) {
		this.legL.position.x = Math.cos(radians + Math.PI) * amplitude
		this.legL.position.y = -Math.sin(radians + Math.PI) * amplitude
		this.legL.position.y = Math.max(0, this.legL.position.y)

		if (radians > Math.PI) {
			this.legL.rotation.z = 0
		} else {
			this.legL.rotation.z = Math.cos((radians * 2) + (Math.PI / 2)) *
				(Math.PI / 4)
		}
	}

	_handleRightLegRunAnimation(radians, amplitude) {
		this.legR.position.x = Math.cos(radians) * amplitude
		this.legR.position.y = -Math.sin(radians) * amplitude
		this.legR.position.y = Math.max(0, this.legR.position.y)

		if (radians > Math.PI) {
			this.legR.rotation.z = Math.cos((radians * 2) + (Math.PI / 2)) *
				(Math.PI / 4)
		} else {
			this.legR.rotation.z = 0
		}
	}

	// Jumping

	_handleLeftHandJumpAnimation(radians, amplitude) {
		this.handL.position.x = 0

		this.handL.position.y = -Math.sin(radians) * amplitude * 4
		this.handL.position.y = Math.max(8, this.handL.position.y)

		// this.handL.rotation.z = -Math.cos(radians) * Math.PI / 8
		// this.handL.rotation.z = Math.max(0, this.handL.rotation.z)
	}

	_handleRightHandJumpAnimation(radians, amplitude) {
		this.handR.position.x = 0

		this.handR.position.y = -Math.sin(radians) * amplitude * 4
		this.handR.position.y = Math.max(8, this.handR.position.y)

		// this.handR.rotation.z = -Math.cos(radians) * Math.PI / 8
		// this.handR.rotation.z = Math.max(0, this.handR.rotation.z)
	}

	_handleHeadJumpAnimation(radians, amplitude) {
		this.head.position.x = 0

		this.head.position.y = -Math.sin(radians) * amplitude * 6
		this.head.position.y = Math.max(21, this.head.position.y)

		// this.head.rotation.z = -Math.cos(radians + (Math.PI / 2))
		// * amplitude * 0.02
		// this.head.rotation.z = Math.max(0, this.head.rotation.z)
	}

	_handleTorsoJumpAnimation(radians, amplitude) {
		this.torso.position.x = 0

		this.torso.position.y = -Math.sin(radians) * amplitude * 4
		this.torso.position.y = Math.max(8, this.torso.position.y)

		// this.torso.rotation.z = -Math.cos(radians + (Math.PI / 2))
		// * amplitude * 0.05
		// this.torso.rotation.z = Math.max(0, this.torso.rotation.z)
	}

	_handleLeftLegJumpAnimation(radians, amplitude) {
		this.legL.position.x = 0

		this.legL.position.y = -Math.sin(radians) * amplitude * 2
		this.legL.position.y = Math.max(0, this.legR.position.y)

		if (radians > Math.PI) {
			this.legL.rotation.z = Math.cos((radians * 2) + (Math.PI / 2)) *
				(Math.PI / 4)
		} else {
			this.legL.rotation.z = 0
		}
	}

	_handleRightLegJumpAnimation(radians, amplitude) {
		this.legR.position.x = 0

		this.legR.position.y = -Math.sin(radians) * amplitude * 2
		this.legR.position.y = Math.max(0, this.legR.position.y)

		if (radians > Math.PI) {
			this.legR.rotation.z = Math.cos((radians * 2) + (Math.PI / 2)) *
				(Math.PI / 4)
		} else {
			this.legR.rotation.z = 0
		}
	}

	moveDown() {
		this.run()

		this.mesh.position.z += 0.5
		this.mesh.rotation.y = Math.PI + (Math.PI / 2)
	}

	moveRight() {
		this.run()

		this.mesh.position.x += 0.5
		this.mesh.rotation.y = 0
	}
}

