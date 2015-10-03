(function () {
	window.PhonePhong.UI.Pad = function (board) {
		var self = this;
		var svgElementID = 'soundControls';

		this.board = board;
		
		$(".dial").knob({
				'stopper': true,
				'height': 90,
				'change': function (v) {
					for (var i = 0; i < logicBoard.fongs.length; i++)
					{
						_filterResonance = v;
						logicBoard.fongs[i].setOscFilterResonance(v*10);
					}
				}
			});
	}
})