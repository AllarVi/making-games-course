var sources = {
  taustSprite: 'images/taust.png',
  robotSprite: 'images/robot.png',
  heroSprite: 'images/mario36x60.png',
  coinSprites: 'images/coins_sprite.png'
}
window['onload'] = function () {
  loadImages(sources, initGame)
}

function loadImages (sources, _0xae82x3) {
  var _0xae82x4 = {}
  var _0xae82x5 = 0
  var _0xae82x6 = 0
  for (var _0xae82x7 in sources) {
    _0xae82x6++
  }

  for (var _0xae82x7 in sources) {
    _0xae82x4[_0xae82x7] = new Image()
    _0xae82x4[_0xae82x7]['onload'] = function () {
      if (++_0xae82x5 >= _0xae82x6) {
        _0xae82x3(_0xae82x4)
      }
    }
    _0xae82x4[_0xae82x7]['src'] = sources[_0xae82x7]
  }
}

var mynte_vaja = 1000,
  punkte = 0,
  soundDelta = 0.1,
  music, coinSnd
var w, h, taust, taustX = 0,
  taustImage, taustW, gameH, deltaW, ctx, hero, robot, g, collected, keysDown = {},
  gameOn, n = 0,
  then, myndiSpriidid = [{
    x0: 140,
    x1: 512,
    y0: 24
  }, {
    x0: 120,
    x1: 524,
    y0: 98
  }, {
    x0: 116,
    x1: 536,
    y0: 186
  }, {
    x0: 116,
    x1: 536,
    y0: 268
  }, {
    x0: 94,
    x1: 552,
    y0: 362
  }, {
    x0: 10,
    x1: 712,
    y0: 462
  }],
  mynte = 8,
  myndid = [],
  objs = []
var startTime = Date['now']()

function initGame (_0xae82x4) {
  taust = document['getElementById']('taustcanvas')
  var _0xae82x24 = document['getElementById']('gamecanvas')
  _0xae82x24['focus']()
  ctx = _0xae82x24['getContext']('2d')
  w = window['innerWidth']
  taust['width'] = w
  _0xae82x24['width'] = w
  h = _0xae82x24['height']
  taustX = 0
  gameH = 390
  deltaW = Math['floor'](w / 5)
  taustImage = _0xae82x4['taustSprite']
  taustX = 0
  taustW = taustImage['width']
  hero = new animated(_0xae82x4['heroSprite'], 36, 60, {
    '\x76\x61\x73\x61\x6B\x75\x6C\x65': [0, 0],
    '\x70\x61\x72\x65\x6D\x61\x6C\x65': [144, 0],
    '\x68\x79\x70\x65': [288, 0]
  }, 4, 'paremale', 0, 4, 4)
  hero['x'] = Math['floor'](w / 4)
  hero['y'] = gameH - hero['height']
  hero['y0'] = hero['y']
  hero['H'] = hero['y']
  hero['jumpSpeed'] = 2
  hero['upSpeed'] = 0
  hero['vx'] = 0
  hero['jumpTime'] = 0
  hero['maxJumpTime'] = 9
  g = 0.8
  hero['maxH'] = hero['maxJumpTime'] * (hero['jumpSpeed'] - g)
  robot = new animated(_0xae82x4['robotSprite'], 75, 60, {
    '\x72\x6F\x74\x61\x74\x69\x6E\x67': [0, 0]
  }, 4, 'rotating', 0, -4, 6)
  robot['x0'] = w
  robot['x'] = robot['x0']
  robot['y'] = hero['y0'] - 10
  robot['tyyp'] = 'paha'
  objs['push'](robot)
  myndid = createMyndid(_0xae82x4['coinSprites'], myndiSpriidid, mynte, hero['y0'], w)
  drawMyndid(myndid)
  collected = 0
  addEventListener('keydown', function (_0xae82x25) {
    keysDown[_0xae82x25['keyCode']] = true
  }, false)
  addEventListener('keyup', function (_0xae82x25) {
    delete keysDown[_0xae82x25['keyCode']]
  }, false)
  then = Date['now']()
  gameOn = true
  music = document['getElementById']('music')
  music['play']()
  coinSnd = document['getElementById']('coin')
  coinSnd['addEventListener']('ended', function () {
    if (!music['paused']) {
      music['volume'] += soundDelta
    }
  })
  robotSnd = document['getElementById']('robot')
  game()
}

function animated (_0xae82x27, _0xae82x28, _0xae82x29, _0xae82x2a, _0xae82x2b, _0xae82x2c, _0xae82x2d, _0xae82x2e, _0xae82x2f) {
  this['image'] = _0xae82x27
  this['width'] = _0xae82x28
  this['height'] = _0xae82x29
  this['states'] = _0xae82x2a
  this['dx'] = _0xae82x28
  this['dy'] = _0xae82x29
  this['n_frames'] = _0xae82x2b
  this['actualFrame'] = 0
  this['jumping'] = 0
  this['speed'] = _0xae82x2e
  this['aniSpeed'] = _0xae82x2f
  this['step'] = 0
  this['y'] = 0
  this['x'] = 0
  this['state'] = _0xae82x2c
  this['pos'] = _0xae82x2d
  this['setPosition'] = function (_0xae82x30, _0xae82x31) {
    this['x'] = _0xae82x30
    this['y'] = _0xae82x31
  }
  this['draw'] = function () {
    if (this['pos'] == 0 && !(this['jumping'])) {
      ctx['drawImage'](this['image'], this['states'][this['state']][0], this['states'][this['state']][1], this['dx'], this['dy'], this['x'], this['y'], this['dx'], this['dy'])
    } else {
      ctx['drawImage'](this['image'], this['states'][this['state']][0] + this['dx'] * this['actualFrame'], this['states'][this['state']][1], this['dx'], this['dy'], this['x'], this['y'], this['dx'], this['dy'])
      this['step']++
      if (this['step'] > this['aniSpeed']) {
        this['actualFrame']++
        if (this['actualFrame'] == this['n_frames']) {
          this['actualFrame'] = 0
        }

        this['step'] = 0
      }
    }
  }
}

function createMyndid (_0xae82x27, _0xae82x33, _0xae82x34, _0xae82x35, w) {
  var _0xae82x36 = []
  var _0xae82x37 = _0xae82x33['length']
  for (var _0xae82x38 = 0; _0xae82x38 < _0xae82x34; _0xae82x38++) {
    var n = Math['floor'](_0xae82x37 * Math['random']())
    var _0xae82x28 = (_0xae82x33[n]['x1'] - _0xae82x33[n]['x0']) / 6
    var _0xae82x29 = _0xae82x28
    var _0xae82x39 = new animated(_0xae82x27, _0xae82x28, _0xae82x29, {
      '\x72\x6F\x74\x61\x74\x69\x6E\x67': [_0xae82x33[n]['x0'], _0xae82x33[n]['y0']]
    }, 6, 'rotating', 1, 0, 2)
    _0xae82x39['actualFrame'] = Math['floor'](_0xae82x39['n_frames'] * Math['random']())

    var _0xae82x3a = Math['floor'](w * Math['random']())
    var _0xae82x3b = Math['floor']((_0xae82x35 - 1.5 * _0xae82x29) * Math['random']())
    _0xae82x39['x'] = _0xae82x3a
    _0xae82x39['y'] = _0xae82x3b
    _0xae82x39['tyyp'] = 'hea'
    _0xae82x36['push'](_0xae82x39)
    objs['push'](_0xae82x39)
  }

  return _0xae82x36
}

function drawMyndid (_0xae82x36) {
  var n = _0xae82x36['length']
  for (var _0xae82x38 = 0; _0xae82x38 < n; _0xae82x38++) {
    _0xae82x36[_0xae82x38]['draw']()
  }
}

function drawTaust () {
  if (w - hero['x'] < deltaW) {
    taustX -= hero['speed']
    moveCoins(-hero['speed'])
    if (taustX + taustW < 0) {
      taustX += taustW
    }

    hero['x'] -= hero['speed']
  }

  if (hero['x'] < deltaW) {
    taustX += hero['speed']
    moveCoins(hero['speed'])
    if (taustX > w) {
      taustX - taustW
    }

    hero['x'] += hero['speed']
  }

  taust['style']['backgroundPositionX'] = String(taustX) + 'px'
}

function moveCoins (_0xae82x3f) {
  for (var _0xae82x38 = 0; _0xae82x38 < myndid['length']; _0xae82x38++) {
    myndid[_0xae82x38]['x'] += _0xae82x3f
    if (_0xae82x3f < 0 && myndid[_0xae82x38]['x'] < -myndid[_0xae82x38]['width']) {
      myndid[_0xae82x38]['x'] = w
    }

    if (_0xae82x3f > 0 && myndid[_0xae82x38]['x'] > w) {
      myndid[_0xae82x38]['x'] = -myndid[_0xae82x38]['width']
    }
  }
}

function update () {
  if (hero['jumping']) {
    if ((38 in keysDown || 87 in keysDown) && hero['jumpTime'] < hero['maxJumpTime']) {
      hero['upSpeed'] += hero['jumpSpeed']
      hero['y'] -= hero['upSpeed']
      hero['jumpTime']++
    } else {
      if (!(hero['upSpeed'] == 0)) {
        hero['upSpeed'] -= g
        hero['y'] -= hero['upSpeed']
        if (hero['y'] > hero['y0']) {
          hero['y'] = hero['y0']
          hero['upSpeed'] = 0
          hero['jumpTime'] = 0
          hero['jumping'] = 0
        }
      }
    }
  } else {
    if (37 in keysDown || 65 in keysDown) {
      if (hero['x'] > 0) {
        hero['state'] = 'vasakule'
        hero['pos'] = 1
        hero['x'] -= hero['speed']
      }
    } else {
      if (39 in keysDown || 68 in keysDown) {
        if (hero['x'] < w - hero['width']) {
          hero['state'] = 'paremale'
          hero['pos'] = 1
          hero['x'] += hero['speed']
        }
      } else {
        if (38 in keysDown || 87 in keysDown) {
          hero['upSpeed'] += hero['jumpSpeed']
          hero['y'] -= hero['upSpeed']
          hero['jumpTime']++
          hero['jumping'] = 1
        } else {
          hero['pos'] = 0
        }
      }
    }
  }

  if (80 in keysDown) {
    if (music['paused']) {
      music['play']()
    } else {
      music['pause']()
    }
  }

  if ((84 in keysDown) && (music['volume'] < soundDelta)) {
    music['volume'] += soundDelta
  }

  if ((86 in keysDown) && (music['volume'] > soundDelta)) {
    music['volume'] += -soundDelta
  }

  if ((robot['pos'] == 0) && (Math['random']() < 0.002)) {
    console['log']('robot! ', robot['x'], robot['speed'])
    robot['pos'] = 1
    robot['x'] += robot['speed']
    if (music['volume'] > soundDelta) {
      music['volume'] += -soundDelta
    }

    robotSnd['play']()
  }

  if (robot['pos'] == 1) {
    if (robot['x'] > -robot['width'] && robot['x'] < w) {
      robot['x'] += robot['speed']
    } else {
      robot['pos'] = 0
      robotSnd['pause']()
      robot['speed'] *= -1
      if (music['volume'] < soundDelta) {
        music['volume'] += soundDelta
      }
    }
  }

  collisions(hero, objs)
}

function collision (_0xae82x42, _0xae82x43) {
  return _0xae82x43['x'] <= (_0xae82x42['x'] + _0xae82x42['width']) && _0xae82x42['x'] <= (_0xae82x43['x'] + _0xae82x43['width']) && _0xae82x43['y'] <= (_0xae82x42['y'] + _0xae82x42['height']) && _0xae82x42['y'] <= (_0xae82x43['y'] + _0xae82x43['height'])
}

function collisions (_0xae82x45, _0xae82x46) {
  for (var _0xae82x38 = 0; _0xae82x38 < _0xae82x46['length']; _0xae82x38++) {
    if (collision(_0xae82x45, _0xae82x46[_0xae82x38])) {
      if (_0xae82x46[_0xae82x38]['tyyp'] == 'hea') {
        punkte += 100
        _0xae82x46[_0xae82x38]['x'] = 1.5 * w * Math['random']()
        if (music['volume'] > soundDelta) {
          music['volume'] += -soundDelta
        }

        coinSnd['play']()
      } else {
        punkte += -500
      }
    }
  }
}

function render () {
  ctx['clearRect'](0, 0, w, h)
  drawTaust()
  drawMyndid(myndid)
  if (robot['pos'] == 1) {
    robot['draw']()
  }

  hero['draw']()
}

function showText (_0xae82x49, _0xae82x3a, _0xae82x3b) {
  ctx['fillStyle'] = 'rgb(240, 210, 200)'
  ctx['font'] = '16px Arial'
  ctx['textAlign'] = 'left'
  ctx['textBaseline'] = 'top'
  ctx['fillText'](_0xae82x49, _0xae82x3a, _0xae82x3b)
  ctx['stroke']
}

function game () {
  if (gameOn && (collected < mynte_vaja)) {
    update()
    render()
    showText('punkte: ' + punkte, 20, 20)
    showText('Liikumine: a/\u2192 - d/\u2190  h\xFCpe: w/\u2191', 20, 400)
    showText('Muusika paus/j\xE4tka: \'p\'', 20, 430)
    showText('Muusika vaiksemaks: \'v\' tugevamaks: \'t\'', 20, 460)
    requestAnimationFrame(game)
  } else {
    var _0xae82x4b = Math['round'](((Date['now']() - startTime) / 1000))
    render()
    showText('mynte: ' + collected, 20, 20)
  }
}