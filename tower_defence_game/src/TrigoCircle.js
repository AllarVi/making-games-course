let trigoArc
let trigoLine
let trigoPoint
let cosPoint
let sinPoint
let cosLine
let sinLine
let projSinLine
let projCosLine

let tp

export default {

	initTrigoCircle() {
		trigoArc = document.getElementById('trigoArc')
		trigoLine = document.getElementById('trigoLine')
		trigoPoint = document.getElementById('trigoPoint')
		cosPoint = document.getElementById('cosPoint')
		sinPoint = document.getElementById('sinPoint')
		cosLine = document.getElementById('cosLine')
		sinLine = document.getElementById('sinLine')
		projSinLine = document.getElementById('projSinLine')
		projCosLine = document.getElementById('projCosLine')

		tp = {
			radiusArc: 10,
			centerX: 60,
			centerY: 60,
			radiusLines: 50,
		}
	},

	updateTrigoCircle(angle) {
		angle %= Math.PI * 2
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		const start = {
			x: tp.centerX + tp.radiusArc * cos,
			y: tp.centerY + tp.radiusArc * sin,
		}
		let end = {
			x: tp.centerX + tp.radiusArc,
			y: tp.centerY,
		}

		let arcSweep = angle >= Math.PI ? 1 : 0
		let d = ['M', tp.centerX, tp.centerY,
			'L', start.x, start.y,
			'A', tp.radiusArc, tp.radiusArc, 0, arcSweep, 0, end.x, end.y,
			'L', tp.centerX, tp.centerY,
		].join(' ')

		trigoArc.setAttribute('d', d)
		trigoLine.setAttribute('x2', tp.centerX + (cos * tp.radiusLines))
		trigoLine.setAttribute('y2', tp.centerY + sin * tp.radiusLines)
		trigoPoint.setAttribute('cx', tp.centerX + cos * tp.radiusLines)
		trigoPoint.setAttribute('cy', tp.centerY + sin * tp.radiusLines)
		cosPoint.setAttribute('cx', tp.centerX + cos * tp.radiusLines)
		sinPoint.setAttribute('cy', tp.centerY + sin * tp.radiusLines)
		cosLine.setAttribute('x2', tp.centerX + cos * tp.radiusLines)
		sinLine.setAttribute('y2', tp.centerY + sin * tp.radiusLines)
		projSinLine.setAttribute('x2', tp.centerX + cos * tp.radiusLines)
		projSinLine.setAttribute('y2', tp.centerY + sin * tp.radiusLines)
		projSinLine.setAttribute('y1', tp.centerY + sin * tp.radiusLines)
		projCosLine.setAttribute('x2', tp.centerX + cos * tp.radiusLines)
		projCosLine.setAttribute('x1', tp.centerX + cos * tp.radiusLines)
		projCosLine.setAttribute('y2', tp.centerY + sin * tp.radiusLines)
	},
}