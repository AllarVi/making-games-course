var sources = {
  trees: 'images/trees.png',
  hero: 'images/hero_ani.png',
  seened: 'images/seened.png'
}
window.onload = function () {
  loadImages(sources, initGame)  // calls initGame after *all* images have finished loading
}

function loadImages (sources, callback) {
  var images = {}
  var loadedImages = 0
  var numImages = 0
  for (var src in sources) {
    //console.log(src);
    numImages++
  }
  for (var src in sources) {
    images[src] = new Image()
    images[src].onload = function () {
      if (++loadedImages >= numImages) {
        callback(images)
      }
    }
    images[src].src = sources[src]
  }
}
var seeni = 10
var w, h, d0, h0, r, v, ctx, pFill, treeImage, hero, seen, collected, keysdown, then
var startTime = Date.now()

function initGame (images) {

// Initialize the canvas
  canvas = document.getElementById('gamecanvas')
  ctx = canvas.getContext('2d')
  w = canvas.width
  h = canvas.height
  canvas1 = document.getElementById('gamecanvas1')

  ctx1 = canvas1.getContext('2d')
  canvas_demo = document.getElementById('demo')

  ctx_demo = canvas_demo.getContext('2d')
  //Trees
  tree = new spriteSheet(images.trees, [[0, 0, 32, 32], [33, 0, 32, 32], [0, 33, 32, 32], [33, 33, 32, 32]])
  seen = new spriteSheet(images.seened, [[0, 0, 32, 32], [33, 0, 32, 32], [0, 33, 32, 32], [33, 33, 32, 32]])

  d0 = tree.width //  width of the first tree
  h0 = tree.height // height of the first tree
  v = Math.floor(w / d0)
  r = Math.floor(h / d0)
  currentseen = Math.floor(Math.random() * seen.nr)
  hero = new animated(images.hero, d0, d0, 2, 'still', 36)
  hero.width = 30
  hero.height = 30
  hero.x = w / 2
  hero.y = h / 2
  hero = new animated(images.hero, d0, d0, 2, 'walking', 36)//to show in tutorial
  hero.width = 30
  hero.height = 30

  collected = 0

// Handle keyboard controls
  keysDown = {}

  addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true
  }, false)

  addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode]
  }, false)

// Reset the game when the player catches a mushroom

// Let's play this game!
  drawtrees()

  reset()

//render();

  then = Date.now()
  setTimeout(main, 30)
}
function spriteSheet (img, coords) {
  this.coords = coords
  //coords = [[x0,y0,w0,h0],...[xn,yn,wn,hn]]
  this.sheet = img
  this.x = 0
  this.y = 0
  this.width = this.coords[0][2] //width of the first image
  this.height = this.coords[0][3] //height of the first image
  this.nr = this.coords.length //how many images?
  this.draw = function (nr, x, y) {
    ctx.drawImage(img, this.coords[nr][0], this.coords[nr][1], this.width, this.height, x, y, this.width, this.height)
  }
  this.draw1 = function (nr, x, y) {
    ctx1.drawImage(img, this.coords[nr][0], this.coords[nr][1], this.width, this.height, x, y, this.width, this.height)
  }
}

function animated (img, dx, dy, n_fr, state, sp) {
  this.image = img
  this.width = dx
  this.height = dy
  this.dx = dx //this.width;
  this.dy = dy //this.height/3; //32
  this.n_frames = n_fr //number of frames
  this.actualFrame = 0
  this.speed = sp  //how many *game* frames a frame is shown
  this.step = 0
  this.y = 0
  this.x = 0
  this.state = state

  this.setPosition = function (X, Y) {
    this.x = X
    this.y = Y
  }
  this.draw = function () {

    if (this.state == 'still')
      ctx.drawImage(this.image, 0, this.dy * 2, this.dx, this.dy, this.x, this.y, this.dx, this.dy)
    else {   //state == "walking"
      ctx.drawImage(this.image, 0, this.dy * this.actualFrame, this.dx, this.dy, this.x, this.y, this.dx, this.dy)
      this.step++
      if (this.step == this.speed) {
        this.actualFrame++
        this.actualFrame = this.actualFrame % this.n_frames
        this.step = 0
      }
    }
  }
  this.draw_demo = function () {

    if (this.state == 'still')
      ctx_demo.drawImage(this.image, 0, this.dy * 2, this.dx, this.dy, this.x, this.y, this.dx, this.dy)
    else {   //state == "walking"
      ctx_demo.drawImage(this.image, 0, this.dy * this.actualFrame, this.dx, this.dy, this.x, this.y, this.dx, this.dy)
      this.step++
      if (this.step == this.speed) {
        this.actualFrame++
        this.actualFrame = this.actualFrame % this.n_frames
        this.step = 0
      }
    }
  }
}

function drawtrees () {
  var n = tree.nr //how many trees
  console.log(n)
  for (var i = 0; i < v; i++) {
    tree.draw1(Math.floor(Math.random() * n), i * d0, 0)
    tree.draw1(Math.floor(Math.random() * n), i * d0, h - d0)
  }
  for (var j = 1; j < r; j++) {
    tree.draw1(Math.floor(Math.random() * n), 0, j * d0)
    tree.draw1(Math.floor(Math.random() * n), w - d0, j * d0)
  }
}
// Update game objects
function update (modifier) {
  if (38 in keysDown || 87 in keysDown) { // Player holding up
    if (hero.y > 0) {
      hero.y -= hero.speed * modifier
      hero.state = 'walking'
    }
    if (hero.y < d0) //can not go through trees!
    {
      hero.y = d0
      hero.state = 'still'
    }
  }
  if (40 in keysDown || 83 in keysDown) { // Player holding down
    if (hero.y < h - d0 - hero.height) {
      hero.y += hero.speed * modifier
      hero.state = 'walking'
    }
    if (hero.y > h - d0 - hero.height) {
      hero.y = h - d0 - hero.height
      hero.state = 'still'
    }
  }
  if ((37 in keysDown) || (65 in keysDown)) { // Player holding left
    if (hero.x > 0) {
      hero.x -= hero.speed * modifier
      hero.state = 'walking'
    }
    if (hero.x < d0) {
      hero.x = d0
      hero.state = 'still'
    }
  }
  if ((39 in keysDown) || (68 in keysDown)) { // Player holding right
    if (hero.x < w - d0 - hero.width) {
      hero.x += hero.speed * modifier
      hero.state = 'walking'
    }
    if (hero.x > w - d0 - hero.width) {
      hero.x = w - d0 - hero.width
      hero.state = 'still'
    }
  }

  if (!(37 in keysDown) && !(38 in keysDown) && !(39 in keysDown) && !(40 in keysDown) && !(83 in keysDown) && !(65 in keysDown) && !(68 in keysDown) && !(87 in keysDown))
    hero.state = 'still'

  // Are they touching?
  if (collision(hero, seen)) {
    ++collected
    reset()
  }
}
function collision (obj1, obj2) {
  return obj2.x <= (obj1.x + obj1.width) &&
    obj1.x <= (obj2.x + obj2.width) &&
    obj2.y <= (obj1.y + obj1.height) &&
    obj1.y <= (obj2.y + obj2.height)
}
// Draw everything
function render () {
  ctx.clearRect(0, 0, w, h)
  //drawtrees();
  //ctx.drawImage(hero.sprite, hero.x, hero.y);
  hero.draw()
  seen.draw(currentseen, seen.x, seen.y)
  showScore('Seeni: ' + collected)
  hero.draw_demo(0, 0) //eraldiseisev kujuke
}
function showScore (txt) {
  // Score
  ctx.fillStyle = 'rgb(250, 250, 250)'
  ctx.font = '10px Arial'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(txt, d0, h0) //text, x,y
}
var reset = function () {
  //Put hero to the center
  hero.x = w / 2 //kanvaa keskele
  hero.y = h / 2
  // Throw the mushroom somewhere on the screen randomly
  seen.x = tree.width + (Math.random() * (w - 2 * tree.width - seen.width))
  seen.y = tree.height + (Math.random() * (h - 2 * tree.height - seen.height))
  currentseen = Math.floor(Math.random() * seen.nr)
  console.log(w, h, seen.x, seen.y, currentseen)
}
// The main game loop
var main = function () {
  var now = Date.now()
  var delta = now - then
  if (collected < seeni) {
    update(delta / 1000)
    render()
    then = now
    setTimeout(main, 1)  //repeat
  }
  else {
    var time = Math.round(((now - startTime) / 1000))
    showScore('Said ' + time + ' sekundiga ' + collected + ' seent!')
  }
}