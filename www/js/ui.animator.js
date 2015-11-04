function render(time) {
	if (time === undefined) {
		time = window.performance.now();
	}

	for (var i = 0; i < uiPad.fongDots.length; i++) {
		if (uiPad.fongDots[i].boardInput.NoteMapInfo.LoopOn) {
			var fd = uiPad.fongDots[i];
			for (var j = 0; j < fd.loopPositions.length; j++) {
				var lp = fd.loopPositions[j];
				if (time - lp.time > fd.boardInput.NoteMapInfo.LoopDuration) {
					fd.offsetX = 0;
					fd.offsetY = 0;
					fd.handleTouchMoveHelper(lp.targetTouches, lp.targetFong, false);

					lp.targetFong.setAttribute("cx", fd.x);
					lp.targetFong.setAttribute("cy", fd.y)
					
					lp.time += fd.boardInput.NoteMapInfo.LoopDuration;
					
					break;
				}
			}
		}
	}

	window.requestAnimationFrame(render);
}