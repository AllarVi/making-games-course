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
    this.y = canvasWidth / 2
    this.x = canvasHeight / 2
    this.state = state
  }

  draw () {
    if (this.state === 'still')
      ctx.drawImage(this.image, 0, this.sy * 2, this.sx, this.sy, this.x, this.y, this.sx, this.sy)
    else {   //state == "walking"
      console.log('actualFrame ', this.actualFrame)
      ctx.drawImage(this.image, 0, this.sy * this.actualFrame, this.sx, this.sy, this.x, this.y, this.sx, this.sy)
      this.step += 1
      if (this.step === this.speed) {
        this.actualFrame += 1
        this.actualFrame = this.actualFrame % this.n_frames
        this.step = 0
      }
    }
  }
}

