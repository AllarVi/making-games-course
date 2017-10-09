import * as THREE from 'three'

function update () {
  /*
  the angle is incremented by 0.1 every frame, try higher values for a faster animation
  */

  angle += .1

  /*
  Try modifying the angle and/or the radius for a different movement
  */

  cube.position.x = cos(angle) * radius
  cube.position.y = sin(angle) * radius

  let newAngle = angle * 0.5
  cube2.position.x = cos(newAngle * 4) * sin(newAngle) * radius
  cube2.position.y = sin(newAngle * 4) * sin(newAngle) * radius

  let newAngle2 = angle * 0.5
  cube3.position.x = cos(newAngle2) * radius * 2
  cube3.position.y = sin(newAngle * 2) * radius * 2

  let newAngle3 = angle * 0.2
  realCube.position.x = cos(newAngle3) * sin(newAngle3 * 2) * radius * 6
  realCube.position.y = sin(newAngle3) * sin(newAngle3 * 2) * radius * 4

  /*
  You may want to use the same principle on the rotation property of an object, uncomment the next line to see what happens
  */

  cube.rotation.z = cos(angle) * PI / 4

  /*
  Or act on the scale, note that 1 is added as an offset to avoid a negative scale value.
  */

  //cube.scale.y = 1 + cos(angle) * .5;

  /*
  Your turn, you may want to:
  - comment or uncomment the lines above to try new combinations,
  - replace cos by sin and vice versa,
  - replace radius with an other cyclic function
  example :
  cube.position.x = cos(angle) * (sin(angle) *radius);
  ...

  */
}

/*-------------------------------------------
The code below initializes the needed variables
and A Threejs scene. Though setting up a threejs scene is out of the scope of this article I added a few comments to understand what's happening there.
-------------------------------------------*/

// initializing variables :
let scene, camera, renderer, WIDTH, HEIGHT
const PI = Math.PI
let angle = 0
const radius = 10
let cube
let cube2
let cube3
let realCube
let hero
const cos = Math.cos
const sin = Math.sin

function init (event) {
  // get the container that will hold the animation
  let container = document.getElementById('world')
  // get window size
  HEIGHT = window.innerHeight
  WIDTH = window.innerWidth
  // create a threejs Scene, set up the camera and the renderer
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 2000)
  camera.position.z = 100
  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
  renderer.setSize(WIDTH, HEIGHT)
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
  container.appendChild(renderer.domElement)
  // create the cubecube
  let geom = new THREE.CubeGeometry(32, 4, 8, 1)
  let geom2 = new THREE.CubeGeometry(64, 2, 8, 1)
  let geom3 = new THREE.CubeGeometry(4, 16, 8, 1)
  let geomRealCube = new THREE.CubeGeometry(8, 8, 8, 1)
  let material = new THREE.MeshStandardMaterial({
    color: 0x401A07
  })

  let materialPink = new THREE.MeshStandardMaterial({
    color: '#EED2EE'
  })

  let materialRed = new THREE.MeshStandardMaterial({
    color: 'red'
  })

  cube = new THREE.Mesh(geom, material)
  cube2 = new THREE.Mesh(geom2, material)
  cube3 = new THREE.Mesh(geom3, materialPink)
  realCube = new THREE.Mesh(geomRealCube, materialRed)
  // add the cube to the scene
  scene.add(cube)
  scene.add(cube2)
  scene.add(cube3)
  scene.add(realCube)

  createHero()
  // create and add a light source
  let globalLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(globalLight)
  // listen to the window resize
  window.addEventListener('resize', handleWindowResize, false)
  // start a loop that will render the animation in each frame
  loop()
}

// MATERIALS

var brownMat = new THREE.MeshStandardMaterial({
    color: 0x401A07,
    side:THREE.DoubleSide,
    shading:THREE.SmoothShading,
    roughness:1,
  });

var blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
    shading:THREE.FlatShading,
  });

var redMat = new THREE.MeshPhongMaterial({
    color: 0xAA5757,
    shading:THREE.FlatShading,
  });

var blueMat = new THREE.MeshPhongMaterial({
    color: 0x5b9696,
    shading:THREE.FlatShading,
  });

var whiteMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading:THREE.FlatShading,
  });

var currentMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shading:THREE.FlatShading,
  });

function handleWindowResize () {
  // If the window is resized, we have to update the camera aspect ratio
  HEIGHT = window.innerHeight
  WIDTH = window.innerWidth
  renderer.setSize(WIDTH, HEIGHT)
  camera.aspect = WIDTH / HEIGHT
  camera.updateProjectionMatrix()
}

function loop () {
  // call the update function in each frame to update the cube position
  update()
  // render the scene in each frame
  renderer.render(scene, camera)
  // call the loop function in next frame
  requestAnimationFrame(loop)
}

const Hero = function () {
  // This will be incremented later at each frame and will be used as the rotation angle of the cycle.
  this.runningCycle = 0

  // Create a mesh that will hold the body.
  this.mesh = new THREE.Group()
  this.body = new THREE.Group()
  this.mesh.add(this.body)

  // Create the different parts and add them to the body.
  var torsoGeom = new THREE.CubeGeometry(8, 8, 8, 1)//
  this.torso = new THREE.Mesh(torsoGeom, blueMat)
  this.torso.position.y = 8
  this.torso.castShadow = true
  this.body.add(this.torso)

  var handGeom = new THREE.CubeGeometry(3, 3, 3, 1)
  this.handR = new THREE.Mesh(handGeom, brownMat)
  this.handR.position.z = 7
  this.handR.position.y = 8
  this.body.add(this.handR)

  this.handL = this.handR.clone()
  this.handL.position.z = -this.handR.position.z
  this.body.add(this.handL)

  var headGeom = new THREE.CubeGeometry(16, 16, 16, 1)//
  this.head = new THREE.Mesh(headGeom, blueMat)
  this.head.position.y = 21
  this.head.castShadow = true
  this.body.add(this.head)

  var legGeom = new THREE.CubeGeometry(8, 3, 5, 1)

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

  // Ensure that every part of the body casts and receives shadows.
  this.body.traverse(function (object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true
      object.receiveShadow = true
    }
  })
}

function createHero () {
  hero = new Hero()
  scene.add(hero.mesh)
}
// initialize the demo when the page is loaded
window.addEventListener('load', init, false)

