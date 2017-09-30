class Utils {}

Utils.getRandomSprite = function (sprites) {
  return (Math.random() > 0.5) ? (sprites[0]) : (sprites[1])
}

