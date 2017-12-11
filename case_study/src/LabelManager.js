export function createLabel(fromTop) {
	const text2 = document.createElement('div')
	text2.style.position = 'absolute'
	// text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	text2.style.width = 100
	text2.style.height = 100
	text2.style.backgroundColor = 'white'
	text2.style.top = `${fromTop}px`
	text2.style.right = `${200}px`
	return text2
}

export function updateLabelText(label, text) {
	label.innerHTML = text
	document.body.appendChild(label)
}
