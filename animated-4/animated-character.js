class AnimatedCharacter {

  constructor (img, sx, sy, n_fr, state, speed, canvasWidth, canvasHeight) {
    this.image = img
    this.width = sx
    this.height = sy
    this.sx = sx //this.width;
    this.sy = sy //this.height/3; //32
    this.n_frames = n_fr //number of frames
    this.actualFrame = 0
    this.speed = speed  //how many *game* frames a frame is shown
    this.step = 0
    this.y = Math.floor(canvasWidth / 2)
    this.x = Math.floor(canvasHeight / 2)
    this.state = state
    this.face_direction = 'front'
    this.poisoned = false
    this.pikali = 0
    this.healing = 200
  }

  contextDrawImage (sx, sy) {
    ctx.drawImage(this.image, sx, sy, this.sx, this.sy, this.x, this.y, this.sx, this.sy)
  }

  setPosition (x, y) {
    this.x = x
    this.y = y
  }

  draw () {
    if (this.state === 'front_still') {
      let sy_still = this.sy * 3
      let sx_still = 0
      this.contextDrawImage(sx_still, sy_still)
    } else if (this.state === 'left_walking') {
      let sy_walking = 0
      let sx_walking = this.sx + this.sx * this.actualFrame
      this.contextDrawImage(sx_walking, sy_walking)
    } else if (this.state === 'left_still') {
      let sy_walking = 0
      let sx_walking = 0
      this.contextDrawImage(sx_walking, sy_walking)
    } else if (this.state === 'right_walking') {
      let sy_walking = this.sy
      let sx_walking = this.sx + this.sx * this.actualFrame
      this.contextDrawImage(sx_walking, sy_walking)
    } else if (this.state === 'right_still') {
      let sy_walking = this.sy
      let sx_walking = 0
      this.contextDrawImage(sx_walking, sy_walking)
    } else if (this.state === 'back_walking') {
      let sy_walking = this.sy * 2
      let sx_walking = this.sx + this.sx * this.actualFrame
      this.contextDrawImage(sx_walking, sy_walking)
    } else if (this.state === 'back_still') {
      let sy_walking = this.sy * 2
      let sx_walking = 0
      this.contextDrawImage(sx_walking, sy_walking)
    } else if (this.state === 'front_walking') {
      let sy_walking = this.sy * 3
      let sx_walking = this.sx + this.sx * this.actualFrame
      this.contextDrawImage(sx_walking, sy_walking)
    }

    // Frame switching
    // speed 12, step 0-12
    this.step += 1
    if (this.step === this.speed) {
      // actualFrame 0-1
      this.actualFrame += 1

      // actualFrame = x % 4
      this.actualFrame = this.actualFrame % this.n_frames
      this.step = 0
    }
  }
}

