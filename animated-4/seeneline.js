let sources = {
  treeSprite: 'images/tree.png',
  heroSprite: 'images/tydruk_ani.png',
  seen0Sprite: 'images/seen0.png',
  seen1Sprite: 'images/seen1.png',
  seen2Sprite: 'images/seen2.png',
  stumpSprite: 'images/kand32.png',
  pebbleSprite: 'images/kivi32.png',
}

// NB! The function is "onload" and not "onLoad"
window.onload = function () {
  loadImages(sources, initGame)  // calls initGame after *all* images have finished loading
}

function loadImages (sources, callback) {
  let images = {}
  let loadedImages = 0
  let numOfImages = 0

  for (let src in sources) {
//          console.log("Img loaded: " + src);
    numOfImages++
  }

  for (let src in sources) {
    if (sources.hasOwnProperty(src)) {
      images[src] = new Image()
      images[src].onload = function () {
        if (++loadedImages >= numOfImages) {
          // Call initGame when all images loaded
          callback(images)
        }
      }
      images[src].src = sources[src]
    } else {
      console.log('Error iterating sources: ', sources)
    }
  }
}

let mushroomsToCollect = 10  //kui palju on tarvis korjata
let canvasWidth, canvasHeight, treeImageWidth, treeImageHeight, verticalTrees, horizontalTrees, ctx,
  treeImage, hero, collected, then
let startTime = Date.now() //seente korjamise aja leidmiseks

const MUSHROOMS_MAX = 5
let mushrooms = []
let mushroomsOnScreen = 0

const OBSTACLES_MAX = 50
let obstacles = []
let keysDown = {}

let generateObstacles = function (images) {
  let sprite, x, y, obstacle
  for (let i = 0; i < OBSTACLES_MAX; i++) {
    sprite = Utils.getRandomSprite([images.pebbleSprite, images.stumpSprite])
    x = images.pebbleSprite.width + (Math.random() * (canvasWidth - 2 * images.pebbleSprite.width))
    y = images.pebbleSprite.height + (Math.random() * (canvasHeight - 2 * images.pebbleSprite.height))
    obstacle = new Obstacle(sprite, x, y)

    obstacles.push(obstacle)
  }
}

let generateMushrooms = function (images) {
  let sprite, x, y, mushroom, good
  for (let i = 0; i < MUSHROOMS_MAX; i++) {

    if (Math.random() < 0.3) {
      sprite = images.seen0Sprite  //kärbseseen !
      good = false
    }
    else {
      sprite = Utils.getRandomSprite([images.seen1Sprite, images.seen2Sprite])
      good = true
    }

    x = sprite.width + (Math.random() * (canvasWidth - 2 * sprite.width))
    y = sprite.height + (Math.random() * (canvasHeight - 2 * sprite.height))

    mushroom = new Mushroom(sprite, x, y, good)

    mushrooms.push(mushroom)
  }
}

function initGame (images) {
  // Initialize the canvas
  let canvas = document.getElementById('gamecanvas')
  ctx = canvas.getContext('2d')
  canvas.width = innerWidth
  canvas.height = innerHeight
  canvasWidth = canvas.width
  canvasHeight = canvas.height

  // Trees
  treeImage = images.treeSprite
  treeImageWidth = treeImage.width
  treeImageHeight = treeImage.height
  horizontalTrees = Math.floor(canvasWidth / treeImageWidth)
  verticalTrees = Math.floor(canvasHeight / treeImageHeight)

  hero = new AnimatedCharacter(images.heroSprite, 50, 72, 4, 'front_still', 12, canvasWidth, canvasHeight)

  generateMushrooms(images)
  // Generate obstacles
  generateObstacles(images)

  collected = 0

  // Handle keyboard controls
  addEventListener('keydown', function (e) {
    e.preventDefault()
    keysDown[e.keyCode] = true
  }, false)

  addEventListener('keyup', function (e) {
    e.preventDefault()
    delete keysDown[e.keyCode]
  }, false)

  then = Date.now()
  game()
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

  obstacles.forEach(obstacle => {
    ctx.drawImage(obstacle.sprite, obstacle.x, obstacle.y)
  })

}

// Update game objects
function update (modifier) {
  if (!hero.poisoned) {
    if (keys.W in keysDown) {
      if (hero.y > 0) {
        hero.y -= hero.speed * modifier
        hero.face_direction = 'back'
        hero.state = hero.face_direction + hero_mvmt.WALKING
      }
      if (hero.y < treeImageHeight) //can not go through trees!
      {
        hero.y = treeImageHeight
        hero.state = 'front_still'
      }
    }
    if (keys.S in keysDown) {
      if (hero.y < canvasHeight - treeImageHeight - hero.height) {
        hero.y += hero.speed * modifier
        hero.face_direction = 'front'
        hero.state = hero.face_direction + hero_mvmt.WALKING
      }
      if (hero.y > canvasHeight - treeImageHeight - hero.height) {
        hero.y = canvasHeight - treeImageHeight - hero.height
        hero.state = 'front_still'
      }
    }
    if (keys.A in keysDown) {
      if (hero.x > 0) {
        hero.x -= hero.speed * modifier
        hero.face_direction = 'left'
        hero.state = hero.face_direction + hero_mvmt.WALKING
      }
      if (hero.x < treeImageWidth) {
        hero.x = treeImageWidth
        hero.state = 'left_still'
      }
    }
    if (keys.D in keysDown) {
      if (hero.x < canvasWidth - treeImageHeight - hero.width) {
        hero.x += hero.speed * modifier
        hero.face_direction = 'right'
        hero.state = hero.face_direction + hero_mvmt.WALKING
      }
      if (hero.x > canvasWidth - treeImageHeight - hero.width) {
        hero.x = canvasWidth - treeImageHeight - hero.width
        hero.state = 'front_still'
      }
    }
  } else {
    hero.state = 'left' + '_still'
  }

  if (!(keys.S in keysDown) && !(keys.A in keysDown) && !(keys.D in keysDown) && !(keys.W in keysDown))
    hero.state = hero.face_direction + '_still'

  // Mushroom collision
  mushrooms.forEach(seen => {
    if (collision(hero, seen)) {
      ++collected
      if (!seen.good) {
        hero.poisoned = true
        hero.pikali = 1
      }
      resetMushroom(seen)
    }
  })

  // Obstacle collision
  obstacles.forEach(tree => {
    if (collision(hero, tree)) {
      if (hero.face_direction === 'left') {
        hero.x += hero.speed * modifier
      } else if (hero.face_direction === 'right') {
        hero.x -= hero.speed * modifier
      } else if (hero.face_direction === 'front') {
        hero.y -= hero.speed * modifier
      } else if (hero.face_direction === 'back') {
        hero.y += hero.speed * modifier
      }
    }
  })
}

function collision (heroObject, obj2) {
  return obj2.x <= (heroObject.x + heroObject.width) &&
    heroObject.x <= (obj2.x + obj2.sprite.width) &&
    obj2.y <= (heroObject.y + heroObject.height) &&
    heroObject.y <= (obj2.y + obj2.sprite.height)

}

// Draw everything
function render () {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  drawTrees()
  if (!hero.poisoned) {
    hero.draw()
  }
  else {
    hero.pikali += 1
    if (hero.pikali < hero.healing) {  //hero on pikali
      let x0 = hero.x
      let y0 = hero.y
      ctx.translate(x0, y0)
      ctx.rotate(Math.PI / 2)
      hero.setPosition(0, 0)
      hero.draw()
      ctx.rotate(-Math.PI / 2)
      ctx.translate(-x0, -y0)
      hero.setPosition(x0, y0)
    }
    else {
      hero.poisoned = false
    }
  }
  drawMushrooms()
  // seened.forEach(seen => {
  //   // ctx.drawImage(seen.sprite, seen.x, seen.y)
  //   seen.draw()
  // })
  showScore('Seeni: ' + collected)
}

function showScore (txt) {
  ctx.fillStyle = 'rgb(30, 10, 0)'
  ctx.font = '14px Arial'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.strokeText(txt, treeImageWidth, treeImageWidth) //text, x,y
}

function drawMushrooms () {
  let i

  console.log('MushroomsOnScreen ', mushroomsOnScreen)
  if ((mushroomsOnScreen < mushroomsToCollect) && (Math.random() < 0.01)) {
    i = Math.floor(Math.random() * mushrooms.length)
    if (mushrooms[i].vanus > 0) {
      // Seen juba kasvab
    } else {
      mushrooms[i].vanus = 1

      mushroomsOnScreen = 0
      mushrooms.forEach(mushroom => {
        if (mushroom.vanus > 0) {
          mushroomsOnScreen += 1
        }
      })
    }
  }

  mushrooms.forEach(mushroom => {
    mushroom.draw()
  })
}

let resetMushroom = function (seen) {
  let mushroomsOnScreen = 0

  // Throw the mushroom somewhere on the screen randomly
  if (seen) {
    do {
      seen.x = seen.sprite.width + (Math.random() * (canvasWidth - 2 * seen.sprite.width))
      seen.y = seen.sprite.height + (Math.random() * (canvasHeight - 2 * seen.sprite.height))
      seen.suurus = 0
    } while (collision(hero, seen) && mushroomsOnScreen <= MUSHROOMS_MAX)
  }
}

// The main game loop
let game = function () {
  let now = Date.now()
  let delta = now - then
  if (collected < mushroomsToCollect) {
    update(delta / 100)
    render()
    then = now
    requestAnimationFrame(game)
  }
  else {
    let time = Math.round(((Date.now() - startTime) / 1000))
    showScore('Said ' + time + ' sekundiga ' + collected + ' seent!')
  }
}

// Export multiple modules for tests
module.exports = {
  collision
}
