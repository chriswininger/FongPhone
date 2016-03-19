(function() {
	FongPhone.Utils.Mixins.GalleryPad = {
		startRemoteEvents: function() {
			var self = this;
			this._socket = io();
			this._socket.on('fong:event:pass', function(data){
				//console.log('!!! by role: ' + JSON.stringify(self.fongDotsByRole[data.fongRole], null, 4));
				self.fongDotsByRole[data.fongRole].x =
					self.map(data.x, 0, data.winWidth, 0, self.winWidth);
				self.fongDotsByRole[data.fongRole].y =
					self.map(data.y, 0, data.winHeight, 0, self.winHeight);
			});
		}
	};
})();