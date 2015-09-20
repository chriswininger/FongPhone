var _availableNotes
(function () {
    try {
        _availableNotes = [
            {
//                label: 'c',
//                freq: '4186.01',
//                on: false
            }];
        
        var a4 = teoria.note('a4');
        var scale = a4.scale('ionian').simple();
        
        for (var i = 0; i < scale.length; i++)
        {
            var n = {
                    'label': scale[i],
                    'freq': teoria.note(scale[i] + '4').fq(),
                    'on': true
                };
            
            _availableNotes.push(n);
        }

        var rowSize = 1;

        window.PhonePhong.UI.NoteMap = function ($scope, $window) {
            //$scope.NoteMap = _availableNotes;
            $scope.windowHeight = $window.innerHeight;
            $scope.Math = {};
            $scope.Math.floor = Math.floor;
            $scope.NoteMapOn = window.PhonePhong.NoteMapOn;
            $scope.noteClick = function (row, col) {
                $scope.availableNotesByRow[row][col].on = !$scope.availableNotesByRow[row][col].on;
                // update mapped notes
                window.PhonePhong.NoteMap = buildMap(_availableNotes);
            };
            $scope.toggleClick = function () {
                window.PhonePhong.NoteMapOn = $scope.NoteMapOn = !window.PhonePhong.NoteMapOn;
            };
            $scope.availableNotesByRow = [];

            var currentRow = [];
            for (var i = 0; i < _availableNotes.length; i++) {
                if (currentRow.length < rowSize) {
                    currentRow.push(_availableNotes[i]);
                } else {
                    $scope.availableNotesByRow.push(currentRow);
                    currentRow = [_availableNotes[i]];
                }

                // take care of partially filled row at end
                if (i === (_availableNotes.length - 1) && currentRow.length > 0) {
                    $scope.availableNotesByRow.push(currentRow);
                }
            }

            // position swipe pad for page switching
            var mapPadSwipeDown = document.getElementById('mapPadSwipeDown');
            mapPadSwipeDown.style.top = (window.innerHeight - mapPadSwipeDown.getClientRects()[0].height) + 'px';
            var hammeruiPadSwipeDown = new Hammer(mapPadSwipeDown, {
                direction: Hammer.DIRECTION_VERTICAL
            });
            hammeruiPadSwipeDown.get('swipe').set({
                direction: Hammer.DIRECTION_VERTICAL
            });
            hammeruiPadSwipeDown.on('pan', function (ev) {
                if (ev.isFinal) {
                    window.location = '#/';
                }
            });
        };

        function buildMap(notes) {
            var rtn = [];
            notes.forEach(function (note) {
                if (note.on) rtn.push(note);
            });
            return rtn;
        }

        window.PhonePhong.NoteMap = buildMap(_availableNotes);
    } catch (err) {
        alert(err.message);
    }
})();


/*var windowHeight = 400;
for (var $index = 0; $index < windowHeight*2; $index++) {
    var y = ($index*20+5) - windowHeight*Math.floor(($index*20+5)/windowHeight);
    console.log(y);
}*/