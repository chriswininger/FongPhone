(function(window) {
	// declare these outside render function so we don't waste cycles on declaration
	var i;
	var j;
	var fd;
	var lp;

	FongPhone.render = function(time) {
		for (i = 0; i < uiPad.fongDots.length; i++) {
			if (uiPad.fongDots[i].boardInput.NoteMapInfo.LoopOn) {
				fd = uiPad.fongDots[i];
				for (j = 0; j < fd.loopPositions.length; j++) {
					lp = fd.loopPositions[j];
					if (time - lp.time > fd.boardInput.NoteMapInfo.LoopDuration) {
						fd.offsetX = 0;
						fd.offsetY = 0;

						if (!fd.boardInput.NoteMapInfo.pullLoopChunky || Math.random() < fd.boardInput.NoteMapInfo.pullChunkiness) {
							//console.log("updating fong...");

							// hacky fix for iOS
							if (lp.targetTouches.length == 1) {
								lp.targetTouches = [];
								lp.targetTouches.push({
									pageX: lp.x,
									pageY: lp.y
								});
							} else {
								// todo
							}

							fd.handleTouchMoveHelper(lp.targetTouches, lp.targetFong, false);

							lp.targetFong.setAttribute("cx", fd.x);
							lp.targetFong.setAttribute("cy", fd.y)

						}
						else
						{
							//console.log("skipping this iteration...");
						}
						lp.time += fd.boardInput.NoteMapInfo.LoopDuration;

						break;
					}
				}
			}
		}

		window.requestAnimationFrame(FongPhone.render);
	}
})(window);