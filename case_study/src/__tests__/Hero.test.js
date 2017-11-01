const Hero = require('../Hero.js')

describe('Hero', () => {
  it('should create new Hero with attributes', () => {
    let hero = new Hero()

    // attributes
    expect(hero.runningDistance).toBe(0)
    expect(hero.mesh.type).toBe('Group')
    expect(hero.body.type).toBe('Group')

    expect(hero.mesh.children.includes(hero.body)).toBeTruthy()

    expect(hero.body.children.includes(hero.torso)).toBeTruthy()
    expect(hero.body.children.includes(hero.handR)).toBeTruthy()
    expect(hero.body.children.includes(hero.handL)).toBeTruthy()
    expect(hero.body.children.includes(hero.legR)).toBeTruthy()
    expect(hero.body.children.includes(hero.legL)).toBeTruthy()
    expect(hero.body.children.includes(hero.head)).toBeTruthy()

    expect(hero.torso.type).toBe('Mesh')
  })
})
