(function() {
	window.FongPhone.UI.Defaults = {
		"padSettings": {
			"fongDots": [
				{
					"x": 60,
					"y": 60,
					"radius": 60,
					"color": "#ded6d6",
					"fadeOffset": 0,
					"selectedClassType": true,
					"selectedState": "sine",
					"domCtxID": "phongUIGrid",
					"elementID": "oscTouch1",
					"fadeElementID": "oscTouch1Fade",
					"boardInputIndex": 0,
					"dur": "18000ms",
					"gradient": "grad1",
					"states": [
						"sine",
						"square",
						"triangle",
						"sawtooth"
					],
					"classes": [
						true,
						false
					],
					"fongRole": "primary"
				},
				{
					"x": 200,
					"y": 200,
					"radius": 60,
					"color": "#ded6d6",
					"fadeOffset": 0,
					"selectedClassType": true,
					"selectedState": "sine",
					"domCtxID": "phongUIGrid",
					"elementID": "oscTouch2",
					"fadeElementID": "oscTouch2Fade",
					"boardInputIndex": 1,
					"dur": "9529ms",
					"gradient": "grad2",
					"states": [
						"sine",
						"square",
						"triangle",
						"sawtooth"
					],
					"classes": [
						true,
						false
					],
					"fongRole": "secondary"
				}
			],
		},
		"soundSettings": {
			"osc1EnvType": "square",
			"osc2EnvType": "square",
			"osc1Type": "sine",
			"osc2Type": "sine",
			"delayFeedbackControl": 8,
			"delayTimeControl": 500,
			"delayVolumeControl": 100,
			"filterPortamento": 0,
			"portamentoControl": 0,
			"env1Control": 2,
			"filterResonance": 5,
			"filterOn": true,
			"filterType": "lowpass",
			"env2Control": 3
		},
		"soundBoardSettings": {
			"osc1EnvType": "square",
			"osc2EnvType": "square",
			"osc1Type": "sine",
			"osc2Type": "sine",
			"delayFeedbackControl": 8,
			"delayTimeControl": 500,
			"delayVolumeControl": 100,
			"filterPortamento": 0,
			"portamentoControl": 0,
			"env1Control": 2,
			"filterResonance": 5,
			"filterOn": true,
			"filterType": "lowpass",
			"env2Control": 3
		},
		"noteMapSettings": {
			"selectedFongIndex": 0,
			"fongs": [
				{
					"x": 60,
					"y": 60,
					"NoteMapInfo": {
						"SelectedScale": "ionian",
						"baseNote": "a",
						"octave": 3,
						"availableNotes": [
							{
								"label": "a3",
								"freq": 220,
								"on": true
							},
							{
								"label": "b3",
								"freq": 246.94165062806206,
								"on": true
							},
							{
								"label": "c#4",
								"freq": 277.1826309768721,
								"on": true
							},
							{
								"label": "d4",
								"freq": 293.6647679174076,
								"on": true
							},
							{
								"label": "e4",
								"freq": 329.6275569128699,
								"on": true
							},
							{
								"label": "f#4",
								"freq": 369.9944227116344,
								"on": true
							},
							{
								"label": "g#4",
								"freq": 415.3046975799451,
								"on": true
							}
						],
						"NoteMapOn": true,
						"FilterNoteMapOn": false,
						"NoteMap": [
							{
								"label": "a3",
								"freq": 220,
								"on": true
							},
							{
								"label": "b3",
								"freq": 246.94165062806206,
								"on": true
							},
							{
								"label": "c#4",
								"freq": 277.1826309768721,
								"on": true
							},
							{
								"label": "d4",
								"freq": 293.6647679174076,
								"on": true
							},
							{
								"label": "e4",
								"freq": 329.6275569128699,
								"on": true
							},
							{
								"label": "f#4",
								"freq": 369.9944227116344,
								"on": true
							},
							{
								"label": "g#4",
								"freq": 415.3046975799451,
								"on": true
							}
						],
						"LoopDuration": 15000,
						"loopChunkinessFactor": 0.5,
						"pullChunkiness": 0.5
					},
					"waves": [
						"sine",
						"square",
						"triangle",
						"sawtooth"
					],
					"waveIntOsc": 0,
					"oscTouchFadeVal": 0,
					"oscPulseOn": true,
					"radius": 60,
					"oscsCount": 0,
					"oscsIncrement": 2,
					"oscFreq": 246.94165062806206,
					"dur": "18000ms"
				},
				{
					"x": 200,
					"y": 200,
					"NoteMapInfo": {
						"SelectedScale": "ionian",
						"baseNote": "a",
						"octave": 4,
						"availableNotes": [
							{
								"label": "a4",
								"freq": 440,
								"on": true
							},
							{
								"label": "b4",
								"freq": 493.8833012561241,
								"on": true
							},
							{
								"label": "c#5",
								"freq": 554.3652619537442,
								"on": true
							},
							{
								"label": "d5",
								"freq": 587.3295358348151,
								"on": true
							},
							{
								"label": "e5",
								"freq": 659.2551138257398,
								"on": true
							},
							{
								"label": "f#5",
								"freq": 739.9888454232688,
								"on": true
							},
							{
								"label": "g#5",
								"freq": 830.6093951598903,
								"on": true
							}
						],
						"NoteMapOn": true,
						"FilterNoteMapOn": false,
						"NoteMap": [
							{
								"label": "a4",
								"freq": 440,
								"on": true
							},
							{
								"label": "b4",
								"freq": 493.8833012561241,
								"on": true
							},
							{
								"label": "c#5",
								"freq": 554.3652619537442,
								"on": true
							},
							{
								"label": "d5",
								"freq": 587.3295358348151,
								"on": true
							},
							{
								"label": "e5",
								"freq": 659.2551138257398,
								"on": true
							},
							{
								"label": "f#5",
								"freq": 739.9888454232688,
								"on": true
							},
							{
								"label": "g#5",
								"freq": 830.6093951598903,
								"on": true
							}
						],
						"LoopDuration": 15000,
						"loopChunkinessFactor": 0.5,
						"pullChunkiness": 0.5
					},
					"waves": [
						"sine",
						"square",
						"triangle",
						"sawtooth"
					],
					"waveIntOsc": 0,
					"oscTouchFadeVal": 0,
					"oscPulseOn": true,
					"radius": 60,
					"oscsCount": 0,
					"oscsIncrement": 2,
					"oscFreq": 554.3652619537442,
					"dur": "9529ms"
				}
			],
			"loopDuration": 15000,
			"loopChunkinessFactor": 0.5,
			"loopPullChunkiness": 0.5
		}
	}
})();
