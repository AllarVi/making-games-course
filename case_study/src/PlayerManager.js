import Keyboard from './Keyboard'

export default class PlayerManager {
	constructor() {
		this.keyboard = new Keyboard()
		this.availableTowers = 0
	}
}
