(function() {
  window.FongPhone = window.FongPhone || {};
  window.FongPhone.UI = window.FongPhone.UI || {};
  window.FongPhone.UI.Defaults = {
	fongDots: [{
	  x: 60,
	  y: 60,
	  radius: 60,
	  color: "#ded6d6",
	  fadeOffset: 0,
	  selectedClassType: true,
	  selectedState: "sine",
	  gradient: 'grad1',
	  domCtxID: "phongUIGrid",
	  elementID: "oscTouch1",
	  fadeElementID: "oscTouch1Fade",
	  boardInputIndex: 0,
	  fongRole: 'primary',
	  states: [
		"sine",
		"square",
		"triangle",
		"sawtooth"
	  ],
	  classes: [
		true,
		false
	  ]
	},
	{
	  x: 200,
	  y: 200,
	  radius: 60,
	  color: "#ded6d6",
	  fadeOffset: 0,
	  selectedClassType: true,
	  selectedState: "sine",
	  gradient: 'grad2',
	  domCtxID: "phongUIGrid",
	  elementID: "oscTouch2",
	  fadeElementID: "oscTouch2Fade",
	  boardInputIndex: 1,
	  fongRole: 'secondary',
	  states: [
		"sine",
		"square",
		"triangle",
		"sawtooth"
	  ],
	  classes: [
		true,
		false
	  ]
	}],
	soundBoardSettings: {
	  osc1EnvType: 'square',
	  osc2EnvType: 'square',
	  osc1Type: 'sine',
	  osc2Type: 'sine',
	  delayFeedbackControl: 8,
	  delayTimeControl: 500,
	  delayVolumeControl: 100,
	  filterPortamento: 0,
	  portamentoControl: 0,
	  env1Control: 10,
	  filterResonance: 5,
	  filterOn: true,
	  filterType: 'lowpass',
	  env2Control: 8
	},
	noteMapSettings: {
		selectedFongIndex: 0,
		fongs: [
			{
				"NoteMapInfo": {
					"SelectedScale": "ionian",
					"baseNote": "a",
					"octave": 4,
					"availableNotes": [
						{
							"label": "a",
							"freq": 440,
							"on": true,
						},
						{
							"label": "b",
							"freq": 493.8833012561241,
							"on": true,
						},
						{
							"label": "c#",
							"freq": 277.1826309768721,
							"on": true,
						},
						{
							"label": "d",
							"freq": 293.6647679174076,
							"on": true
						},
						{
							"label": "e",
							"freq": 329.6275569128699,
							"on": true
						},
						{
							"label": "f#",
							"freq": 369.9944227116344,
							"on": true
						},
						{
							"label": "g#",
							"freq": 415.3046975799451,
							"on": true
						}
					],
					"NoteMapOn": false,
					"FilterNoteMapOn": false,
					"NoteMap": [
						{
							"label": "a",
							"freq": 440,
							"on": true
						},
						{
							"label": "b",
							"freq": 493.8833012561241,
							"on": true
						},
						{
							"label": "c#",
							"freq": 277.1826309768721,
							"on": true
						},
						{
							"label": "d",
							"freq": 293.6647679174076,
							"on": true
						},
						{
							"label": "e",
							"freq": 329.6275569128699,
							"on": true
						},
						{
							"label": "f#",
							"freq": 369.9944227116344,
							"on": true
						},
						{
							"label": "g#",
							"freq": 415.3046975799451,
							"on": true
						}
					]
				}
			},
			{
				NoteMapInfo: {
					"SelectedScale": "ionian",
					"baseNote": "a",
					"octave": 4,
					"availableNotes": [
						{
							"label": "a",
							"freq": 440,
							"on": true
						},
						{
							"label": "b",
							"freq": 493.8833012561241,
							"on": true
						},
						{
							"label": "c#",
							"freq": 277.1826309768721,
							"on": true
						},
						{
							"label": "d",
							"freq": 293.6647679174076,
							"on": true
						},
						{
							"label": "e",
							"freq": 329.6275569128699,
							"on": true
						},
						{
							"label": "f#",
							"freq": 369.9944227116344,
							"on": true
						},
						{
							"label": "g#",
							"freq": 415.3046975799451,
							"on": true
						}
					],
					"NoteMapOn": false,
					"FilterNoteMapOn": false,
					"NoteMap": [
						{
							"label": "a",
							"freq": 440,
							"on": true
						},
						{
							"label": "b",
							"freq": 493.8833012561241,
							"on": true
						},
						{
							"label": "c#",
							"freq": 277.1826309768721,
							"on": true
						},
						{
							"label": "d",
							"freq": 293.6647679174076,
							"on": true
						},
						{
							"label": "e",
							"freq": 329.6275569128699,
							"on": true
						},
						{
							"label": "f#",
							"freq": 369.9944227116344,
							"on": true
						},
						{
							"label": "g#",
							"freq": 415.3046975799451,
							"on": true
						}
					]
				}
			}
		]
	}
  };
})();