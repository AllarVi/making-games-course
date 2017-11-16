export default class ActivityManager {
	constructor() {
		this.activityIndex = 0
		this.elapsed = 0
	}

	play(script, object) {
		if (!script[this.activityIndex]) {
			return
		}

		const activity = script[this.activityIndex]

		const action = activity.activity
		action.call(object)

		if (this.elapsed > activity.time) {
			this.elapsed = 0
			this.activityIndex += 1
		}

		this.elapsed += 0.2
	}
}
