class Mushroom {

  constructor (sprite, x, y, good) {
    this.sprite = sprite
    this.size = sprite.width //maksimaalne suurus, milleni kasvab
    this.suurus = 0  //pole veel hakanud kasvama
    this.vanus = 0 //pole veel maa peal
    this.speed = 0.05  //kui palju igas kaadris suureneb
    this.iga = 500 //frames!
    this.vana = false  //kui vanaks saab, siis kaob!
    this.width = sprite.width
    this.height = sprite.height
    this.x = x
    this.y = y
    this.good = good
  }

  draw () {
    if (this.vanus > 0) { //on hakanud kasvama
      if (this.suurus < this.size) {
        this.suurus += this.speed
        ctx.drawImage(this.sprite, this.x, this.y, this.suurus, this.suurus)
        this.vanus++
      }
      else {
        if (this.vanus < this.iga) {
          ctx.drawImage(this.sprite, this.x, this.y)
          this.vanus++
        }
        else {
          this.vana = true
          this.suurus = 0 //sureb !
          this.vanus = 0
        }
      }
    }
  }
}