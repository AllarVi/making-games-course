import spawnTower from './main'

export default class Keyboard {
	constructor() {
		this.keysDown = {}
		this.initKeyboardEvents()
	}

	initKeyboardEvents() {
		addEventListener('keydown', (e) => {
			// e.preventDefault()
			this.keysDown[e.keyCode] = true
			this.keysDown.anyKeyDown = true
		}, false)

		addEventListener('keyup', (e) => {
			e.preventDefault()
			delete this.keysDown[e.keyCode]

			// Stop animation if only "anyKeyDown" is left
			if (Object.keys(this.keysDown).length < 2) {
				this.keysDown.anyKeyDown = false
			}
		}, false)
	}

	handleKeyboardEvents(hero, keys) {
		if (keys.W in this.keysDown) {
			hero.run()
			if (hero.mesh.position.z < -470) {
				return
			}
			hero.mesh.position.z -= 1
			hero.mesh.rotation.y = Math.PI / 2
		}
		if (keys.S in this.keysDown) {
			hero.run()
			if (hero.mesh.position.z > 40) {
				return
			}
			hero.mesh.position.z += 1
			hero.mesh.rotation.y = Math.PI + (Math.PI / 2)
		}
		if (keys.A in this.keysDown) {
			hero.run()
			if (hero.mesh.position.x < -250) {
				return
			}
			hero.mesh.position.x -= 1
			hero.mesh.rotation.y = Math.PI
		}
		if (keys.D in this.keysDown) {
			hero.run()
			if (hero.mesh.position.x > 285) {
				return
			}
			hero.mesh.position.x += 1
			hero.mesh.rotation.y = 0
		}

		if (keys.SPACE in this.keysDown) {
			hero.jump()
		}
	}

	handleSpawnTowerKey(hero, keys) {
		if (keys.T in this.keysDown) {
			spawnTower()
			return true // Tower spawned
		}
		return false
	}
}
