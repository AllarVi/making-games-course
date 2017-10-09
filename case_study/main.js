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

  /*
  You may want to use the same principle on the rotation property of an object, uncomment the next line to see what happens
  */

  //cube.rotation.z = cos(angle) * PI/4;

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
let PI = Math.PI
let angle = 0
let radius = 10
let cube
let cos = Math.cos
let sin = Math.sin

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
  let geom = new THREE.CubeGeometry(16, 8, 8, 1)
  let material = new THREE.MeshStandardMaterial({
    color: 0x401A07
  })
  cube = new THREE.Mesh(geom, material)
  // add the cube to the scene
  scene.add(cube)
  // create and add a light source
  let globalLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(globalLight)
  // listen to the window resize
  window.addEventListener('resize', handleWindowResize, false)
  // start a loop that will render the animation in each frame
  loop()
}

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

// initialize the demo when the page is loaded
window.addEventListener('load', init, false)

