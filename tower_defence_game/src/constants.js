import {
	DoubleSide,
	FlatShading,
	MeshPhongMaterial,
	MeshStandardMaterial,
	SmoothShading,
} from 'three'

const KEYS = {
	W: 87,
	S: 83,
	A: 65,
	D: 68,
	T: 84,
	SPACE: 32,
}

export const CAMERA_TYPE = {
	PERSPECTIVE: 'PERSPECTIVE',
	ORTHOGRAPHIC: 'ORTHOGRAPHIC',
}

export const MATERIAL_COLORS = {
	BLUE: 'BLUE',
	BROWN: 'BROWN',
	RED: 'RED',
}

export default KEYS

export const brownMat = new MeshStandardMaterial({
	color: 0x401A07,
	side: DoubleSide,
	flatShading: SmoothShading,
	roughness: 1,
})

export const blueMat = new MeshPhongMaterial({
	color: 0x5b9696,
	flatShading: FlatShading,
})


export const greenMat = new MeshPhongMaterial({
	color: 0x2eb82e,
	flatShading: FlatShading,
})

export const redMat = new MeshPhongMaterial({
	color: 0xf44250,
	flatShading: FlatShading,
})
