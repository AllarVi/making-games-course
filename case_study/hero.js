import * as THREE from 'three'

class Hero {

  constructor () {
    this.runningCycle = 0
    this.mesh = new THREE.Group()
    this.body = new THREE.Group()
    this.mesh.add(this.body)

    let torsoGeom = new THREE.CubeGeometry(8, 8, 8, 1)//
    this.torso = new THREE.Mesh(torsoGeom, blueMat)
    this.torso.position.y = 8
    this.torso.castShadow = true
    this.body.add(this.torso)

    let handGeom = new THREE.CubeGeometry(3, 3, 3, 1)
    this.handR = new THREE.Mesh(handGeom, brownMat)
    this.handR.position.z = 7
    this.handR.position.y = 8
    this.body.add(this.handR)

    this.handL = this.handR.clone()
    this.handL.position.z = -this.handR.position.z
    this.body.add(this.handL)

    let headGeom = new THREE.CubeGeometry(16, 16, 16, 1)//
    this.head = new THREE.Mesh(headGeom, blueMat)
    this.head.position.y = 21
    this.head.castShadow = true
    this.body.add(this.head)

    let legGeom = new THREE.CubeGeometry(8, 3, 5, 1)

    this.legR = new THREE.Mesh(legGeom, brownMat)
    this.legR.position.x = 0
    this.legR.position.z = 7
    this.legR.position.y = 0
    this.legR.castShadow = true
    this.body.add(this.legR)

    this.legL = this.legR.clone()
    this.legL.position.z = -this.legR.position.z
    this.legL.castShadow = true
    this.body.add(this.legL)

    this.body.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }

  run () {
    let s = .2
    let t = this.runningCycle

    t = t % (2 * Math.PI)

    let amp = 4

    this.runningCycle += s
    this.legR.position.x = Math.cos(t) * amp
    this.legR.position.y = -Math.sin(t) * amp
    this.legL.position.x = Math.cos(t + Math.PI) * amp
    this.legL.position.y = -Math.sin(t + Math.PI) * amp
    this.legL.position.y = Math.max(0, this.legL.position.y)
    this.legR.position.y = Math.max(0, this.legR.position.y)
    this.torso.position.y = 8 - Math.cos(t * 2) * amp * .2
    this.head.position.y = 21 - Math.cos(t * 2) * amp * .3
    this.torso.rotation.y = -Math.cos(t + Math.PI) * amp * .05
    this.handR.position.x = -Math.cos(t) * amp
    this.handR.rotation.z = -Math.cos(t) * Math.PI / 8
    this.handL.position.x = -Math.cos(t + Math.PI) * amp
    this.handL.rotation.z = -Math.cos(t + Math.PI) * Math.PI / 8
    this.head.rotation.x = Math.cos(t) * amp * .02
    this.head.rotation.y = Math.cos(t) * amp * .01
    if (t > Math.PI) {
      this.legR.rotation.z = Math.cos(t * 2 + Math.PI / 2) * Math.PI / 4
      this.legL.rotation.z = 0
    } else {
      this.legR.rotation.z = 0
      this.legL.rotation.z = Math.cos(t * 2 + Math.PI / 2) * Math.PI / 4
    }
  }
}

// MATERIALS

let brownMat = new THREE.MeshStandardMaterial({
  color: 0x401A07,
  side: THREE.DoubleSide,
  shading: THREE.SmoothShading,
  roughness: 1,
})

let blueMat = new THREE.MeshPhongMaterial({
  color: 0x5b9696,
  shading: THREE.FlatShading,
})

module.exports = Hero
