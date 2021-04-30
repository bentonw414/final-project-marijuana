var handleItemFocus = function(event, item) {
	var step = item.data.step
	graphic.update(step)
}	

var handleContainerScroll = function(event) {
	var bottom = false
	var fixed = false

	var bb = $graphicEl[0].getBoundingClientRect()
	var bottomFromTop = bb.bottom - viewportHeight

	if (bb.top < 0 && bottomFromTop > 0) {
		bottom = false
		fixed = true
	} else if (bb.top < 0 && bottomFromTop < 0) {
		bottom = true
		fixed = false
	}

	toggle(fixed, bottom)
}

svgDoc.scrollStory({
	contentSelector: '.trigger',
	triggerOffset: halfViewportHeight,
	itemfocus: handleItemFocus,
	containerscroll: handleContainerScroll,
})