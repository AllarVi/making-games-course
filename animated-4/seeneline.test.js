const game = require('./seeneline')
const collision = game.collision

let canvasWidth = 500
let canvasHeight = 600

beforeAll(() => {
})

describe('collision tests', () => {
  test('should collide center hero and seen', () => {
    let hero = {
      sprite: {
        width: 32,
        height: 32
      },
      x: Math.floor(canvasWidth / 2),
      y: Math.floor(canvasHeight / 2),
      speed: 2 // movement in pixels
    }

    let seen = {
      sprite: {
        width: 32,
        height: 32
      },
      x: Math.floor(canvasWidth / 2),
      y: Math.floor(canvasHeight / 2)
    }

    expect(collision(hero, seen)).toBeTruthy()
  })

  test('should collide', () => {
    let hero = {
      sprite: {
        width: 32,
        height: 32
      },
      x: Math.floor(canvasWidth / 2),
      y: Math.floor(canvasHeight / 2),
      speed: 2 // movement in pixels
    }

    let seen = {
      sprite: {
        width: 32,
        height: 32
      },
      x: Math.floor(canvasWidth / 2) + hero.sprite.width / 2,
      y: Math.floor(canvasHeight / 2) + hero.sprite.height / 2
    }

    expect(collision(hero, seen)).toBeTruthy()
  })

  test('should not collide', () => {
    let hero = {
      sprite: {
        width: 32,
        height: 32
      },
      x: Math.floor(canvasWidth / 2),
      y: Math.floor(canvasHeight / 2),
      speed: 2 // movement in pixels
    }

    let seen = {
      sprite: {
        width: 32,
        height: 32
      },
      x: Math.floor(canvasWidth / 2) + hero.sprite.width / 2 + 2,
      y: Math.floor(canvasHeight / 2) + hero.sprite.height / 2 + 2
    }

    expect(collision(hero, seen)).toBeFalsy()
  })

  test('should not collide', () => {
    let hero = {
      sprite: {
        width: 32,
        height: 32
      },
      x: Math.floor(canvasWidth / 2),
      y: Math.floor(canvasHeight / 2),
      speed: 2 // movement in pixels
    }

    let seen = {
      sprite: {
        width: 64,
        height: 64
      },
      x: Math.floor(canvasWidth / 2) + hero.sprite.width / 2 + 2,
      y: Math.floor(canvasHeight / 2) + hero.sprite.height / 2 + 2
    }

    expect(collision(hero, seen)).toBeFalsy()
  })
})
