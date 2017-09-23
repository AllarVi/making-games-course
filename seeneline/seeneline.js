let sources = {
  treeSprite: 'images/tree.png',
  heroSprite: 'images/hero.png',
  seenSprite: 'images/seen2.png'
}

//      NB! The function is "onload" and not "onLoad"
window.onload = function () {
  loadImages(sources, initGame)  // calls initGame after *all* images have finished loading
}

function loadImages (sources, callback) {
  let images = {}
  let loadedImages = 0
  let numOfImages = 0

  for (var src in sources) {
//          console.log("Img loaded: " + src);
    numOfImages++
  }

  for (var src in sources) {
    images[src] = new Image()
    images[src].onload = function () {
      if (++loadedImages >= numOfImages) {
//              Call initGame when all images loaded
        callback(images)
      }
    }
    images[src].src = sources[src]
  }

}

let seeni = 10  //kui palju on tarvis korjata
let canvasWidth, canvasHeight, treeImageWidth, treeImageHeight, verticalTrees, horizontalTrees, ctx, pFill,
  treeImage, hero, collected, keysdown, then
let startTime = Date.now() //seente korjamise aja leidmiseks

const seenedMax = 5
let seened = []

randomTrees = []

function initGame (images) {

// Initialize the canvas
  let canvas = document.getElementById('gamecanvas')
  ctx = canvas.getContext('2d')
  canvas.width = innerWidth
  canvas.height = innerHeight
  canvasWidth = canvas.width
  canvasHeight = canvas.height
  //console.log('canvasWidth,canvasHeight '+canvasWidth+canvasHeight);
//Ground
  //pFill = ctx.createPattern(images.ground, "repeat");
  //ctx.fillStyle = pFill;
  //ctx.fillRect(0,0,canvasWidth,canvasHeight);

  //Trees
  treeImage = images.treeSprite
  treeImageWidth = treeImage.width
  treeImageHeight = treeImage.height
  horizontalTrees = Math.floor(canvasWidth / treeImageWidth)
  verticalTrees = Math.floor(canvasHeight / treeImageHeight)

  hero = {
    sprite: images.heroSprite,
    x: Math.floor(canvasWidth / 2),  //to center
    y: Math.floor(canvasHeight / 2),
    speed: 5 // movement in pixels
  }

  Array.from(Array(seenedMax).keys()).forEach(() => {
    let seen = {
      sprite: images.seenSprite,
      x: images.seenSprite.width + (Math.random() * (canvasWidth - 2 * images.seenSprite.width)),
      y: images.seenSprite.height + (Math.random() * (canvasHeight - 2 * images.seenSprite.height))
    }

    seened.push(seen)
  })

  for (let i = 0; i < 50; i++) {
    let randomTree = {
      sprite: images.treeSprite,
      x: images.treeSprite.width + (Math.random() * (canvasWidth - 2 * images.treeSprite.width)),
      y: images.treeSprite.height + (Math.random() * (canvasHeight - 2 * images.treeSprite.height))
    }
    randomTrees.push(randomTree)
  }

  collected = 0

// Handle keyboard controls
  keysDown = {}

  addEventListener('keydown', function (e) {
    e.preventDefault()
    keysDown[e.keyCode] = true
  }, false)

  addEventListener('keyup', function (e) {
    e.preventDefault()
    delete keysDown[e.keyCode]
  }, false)

// Let's play this game!
//        drawTrees()
//reset();
  then = Date.now()
  game()
//setTimeout(main,30);
}

function drawTrees () {

  for (let i = 0; i < horizontalTrees; i++) {
    ctx.drawImage(treeImage, i * treeImageWidth, 0)
    ctx.drawImage(treeImage, i * treeImageWidth, canvasHeight - treeImageWidth)
  }
  for (let j = 1; j < verticalTrees; j++) {
    ctx.drawImage(treeImage, 0, j * treeImageWidth)
    ctx.drawImage(treeImage, canvasWidth - treeImageWidth, j * treeImageWidth)
  }

  for (let i in randomTrees) {
    ctx.drawImage(treeImage, randomTrees[i].x, randomTrees[i].y)
  }

}

// Update game objects
function update () {
  if (87 in keysDown) { // Player holding up
    if (hero.y > 0)
      hero.y -= hero.speed
    if (hero.y < treeImageWidth) //can not go through trees!
      hero.y = treeImageWidth
  }
  if (83 in keysDown) { // Player holding down
    if (hero.y < canvasHeight - treeImageWidth - hero.sprite.height)
      hero.y += hero.speed
    if (hero.y > canvasHeight - treeImageWidth - hero.sprite.height)
      hero.y = canvasHeight - treeImageWidth - hero.sprite.height
  }
  if (65 in keysDown) { // Player holding left
    if (hero.x > 0)
      hero.x -= hero.speed
    if (hero.x < treeImageWidth)
      hero.x = treeImageWidth
  }
  if (68 in keysDown) { // Player holding right
    if (hero.x < canvasWidth - treeImageWidth - hero.sprite.width)
      hero.x += hero.speed
    if (hero.x > canvasWidth - treeImageWidth - hero.sprite.width)
      hero.x = canvasWidth - treeImageWidth - hero.sprite.width
  }

  // Are they touching?
  seened.forEach(seen => {
    if (collision(hero, seen)) {
      ++collected
      reset(seen)
    }
  })

  randomTrees.forEach(tree => {
    if (collision(hero, tree)) {
      console.log('Tree collision')
    } else {
    }
  })
}

function collision (obj1, obj2) {

  return obj2.x <= (obj1.x + obj1.sprite.width / 2) &&
    obj1.x <= (obj2.x + obj2.sprite.width / 2) &&
    obj2.y <= (obj1.y + obj1.sprite.height / 2) &&
    obj1.y <= (obj2.y + obj2.sprite.height / 2)

}

// Draw everything
function render () {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  drawTrees()
  ctx.drawImage(hero.sprite, hero.x, hero.y)
  seened.forEach(seen => {
    ctx.drawImage(seen.sprite, seen.x, seen.y)
  })
  showScore('Seeni: ' + collected)
}

function showScore (txt) {
  // Score
  ctx.fillStyle = 'rgb(30, 10, 0)'
  ctx.font = '14px Arial'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.strokeText(txt, treeImageWidth, treeImageWidth) //text, x,y
}

let reset = function (seen) {
  //Put hero to the center
  // hero.x = canvasWidth / 2
  // hero.y = canvasHeight / 2

  // Throw the mushroom somewhere on the screen randomly
  let mushroomsOnScreen = 0

  if (seen) {
    do {
      seen.x = seen.sprite.width + (Math.random() * (canvasWidth - 2 * seen.sprite.width))
      seen.y = seen.sprite.height + (Math.random() * (canvasHeight - 2 * seen.sprite.height))
    } while (collision(hero, seen) && mushroomsOnScreen <= seenedMax)
  }
}

// The main game loop
let game = function () {
  //var now = Date.now();
  //var delta = now - then;
  if (collected < seeni) {
    update()
    render()
    //then = now;
    setTimeout(game, 1000 / 60)  //millisekundid - 60 kaadrit sekundis
  }
  else {
    //ctx.fillStyle = '#AAEECC';
    //ctx.fillRect(treeImageWidth,treeImageWidth,canvasWidth-2*treeImageWidth,treeImageWidth);
    let time = Math.round(((Date.now() - startTime) / 1000))
    showScore('Said ' + time + ' sekundiga ' + collected + ' seent!')
  }
}

// Export multiple modules for tests
module.exports = {
  collision
}