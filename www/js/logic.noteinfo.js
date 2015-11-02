window.FongPhone = window.FongPhone || {};
window.FongPhone.Logic = window.FongPhone.Logic || {};

FongPhone.Logic.NoteMapInfo = function(state) {
	window.FongPhone.utils.createGetSet(this, 'SelectedScale',
        _.bind(this.getter, this, '_selectedScale'), _.bind(this.setter, this, '_selectedScale'));

	window.FongPhone.utils.createGetSet(this, 'baseNote',
		_.bind(this.getter, this, '_baseNote'), _.bind(this.setter, this, '_baseNote'));

	window.FongPhone.utils.createGetSet(this, 'octave',
		_.bind(this.getter, this, '_octave'), _.bind(this.setter, this, '_octave'));

	window.FongPhone.utils.createGetSet(this, 'availableNotes',
		_.bind(this.getter, this, '_availableNotes'), _.bind(this.setter, this, '_availableNotes'));

	window.FongPhone.utils.createGetSet(this, 'NoteMapOn',
		_.bind(this.getter, this, '_NoteMapOn'), _.bind(this.setter, this, '_NoteMapOn'));

	window.FongPhone.utils.createGetSet(this, 'FilterNoteMapOn',
		_.bind(this.getter, this, '_FilterNoteMapOn'), _.bind(this.setter, this, '_FilterNoteMapOn'));

    window.FongPhone.utils.createGetSet(this, 'NoteMap',
        _.bind(this.getter, this, '_NoteMap'), _.bind(this.setter, this, '_NoteMap'));
	
	window.FongPhone.utils.createGetSet(this, 'LoopDuration',
        _.bind(this.getter, this, '_LoopDuration'), _.bind(this.setter, this, '_LoopDuration'));

	_.extend(this, state);

    // wire up change event after are initial state set
	this.changed = new signals.Signal();
    // now fire one change event for bulk update
    this.changed.dispatch('initialization', this);
};
_.extend(FongPhone.Logic.NoteMapInfo.prototype, {
	setter: function(key, val) {
        this[key] = val;
        if (this.changed)
            this.changed.dispatch(key, val, this);
	},
	getter: function(key) {
        return this[key];
	}
});
FongPhone.Utils.Mixins.ToJSON.applyMixin(FongPhone.Logic.NoteMapInfo.prototype, ['changed']);
