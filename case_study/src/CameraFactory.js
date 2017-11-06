import OrthographicCamera from './OrthographicCamera'
import PerspectiveCamera from './PerspectiveCamera'
import { CAMERA_TYPE } from './constants'

export default function cameraFactory(cameraType) {
	if (cameraType === CAMERA_TYPE.PERSPECTIVE) {
		return new PerspectiveCamera()
	} else if (cameraType === CAMERA_TYPE.ORTHOGRAPHIC) {
		return new OrthographicCamera()
	}
	return undefined
}
