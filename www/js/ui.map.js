(function (){
    var _availableNotes = [
        { label: 'c', freq: '4186.01', on: false },
        { label: 'b', freq: '3951.07', on: true },
        { label: 'a#', freq:'3729.31', on: true },
        { label: 'a', freq: '3520.00', on: false },
        { label: 'g#', freq: '3322.44', on: false },
        { label: 'g', freq: '3135.96', on: true },
        { label: 'f#', freq: '2959.96', on: false },
        { label: 'f', freq: '2793.83', on: true },
        { label: 'e', freq: '2637.02', on: false },
        { label: 'd#', freq: '2489.02', on: true },
        { label: 'd', freq: '2349.32', on: false },
        { label: 'c#', freq: '2217.46', on: true },
        { label: 'c', freq: '2093.00', on: false },
        { label: 'b', freq: '1975.53', on: true },
        { label: 'a#', freq: '1864.66', on: true },
        { label: 'a', freq: '1760.00', on: false },
        { label: 'g#', freq: '1661.22', on: true },
        { label: 'g', freq: '1567.98', on: false },
        { label: 'f#', freq: '1479.98', on: true },
        { label: 'f', freq: '1396.91', on: true },
        { label: 'e', freq: '1318.51', on: false },
        { label: 'd#', freq: '1244.51', on: true },
        { label: 'd', freq: '1174.66', on: true },
        { label: 'c#', freq: '1108.73', on: true },
        { label: 'c', freq: '1046.50', on: false },
        { label: 'b', freq: '987.767', on: true },
        { label: 'a#', freq: '932.328', on: false },
        { label: 'a', freq: '880.000', on: false },
        { label: 'g#', freq: '830.609', on: true },
        { label: 'g', freq: '783.991', on: false },
        { label: 'f#', freq: '739.989', on: true },
        { label: 'f', freq: '698.456', on: false },
        { label: 'e', freq: '659.255', on: true },
        { label: 'd#', freq: '622.254', on: false },
        { label: 'd', freq: '587.330', on: true },
        { label: 'c#', freq: '554.365', on: false },
        { label: 'c', freq: '523.251', on: true },
        { label: 'b', freq: '493.883', on: false },
        { label: 'a#', freq: '466.164', on: false },
        { label: 'a', freq: '440.000', on: true }
    ];

    var rowSize = 4;

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
        $scope.toggleClick = function() {
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
            if (i === (_availableNotes.length -1) && currentRow.length > 0) {
                $scope.availableNotesByRow.push(currentRow);
            }
        }

        // position swipe pad for page switching
        var mapPadSwipeDown = document.getElementById('mapPadSwipeDown');
        mapPadSwipeDown.style.top = (window.innerHeight - mapPadSwipeDown.getClientRects()[0].height) + 'px';
        var hammeruiPadSwipeDown = new Hammer(mapPadSwipeDown, { direction: Hammer.DIRECTION_VERTICAL });
        hammeruiPadSwipeDown.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
        hammeruiPadSwipeDown.on('pan', function(ev) {
            if (ev.isFinal) {
                window.location = '#/';
            }
        });
    };

    function buildMap (notes) {
        var rtn = [];
        notes.forEach(function (note) {
            if (note.on) rtn.push(note);
        });
        return rtn;
    }

    window.PhonePhong.NoteMap = buildMap(_availableNotes);
})();


/*var windowHeight = 400;
for (var $index = 0; $index < windowHeight*2; $index++) {
    var y = ($index*20+5) - windowHeight*Math.floor(($index*20+5)/windowHeight);
    console.log(y);
}*/