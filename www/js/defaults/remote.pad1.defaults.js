(function() {
	window.FongPhone.UI.Defaults = {
		fongDots: [{
			id: 0,
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
				id: 1,
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
			}
		],
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
			env1Control: 2,
			filterResonance: 5,
			filterOn: true,
			filterType: 'lowpass',
			env2Control: 3
		},
		noteMapSettings: {
			selectedFongIndex: 0,
			fongs: [
				{
					"NoteMapInfo": {
						"SelectedScale": "blues",
						"baseNote": "a",
						"octave": 3,
						"availableNotes": [
							{
								"label": "a3",
								"freq": 220,
								"on": true,
								"$$hashKey": "object:47"
							},
							{
								"label": "c4",
								"freq": 261.6255653005986,
								"on": true,
								"$$hashKey": "object:48"
							},
							{
								"label": "d4",
								"freq": 293.6647679174076,
								"on": true,
								"$$hashKey": "object:49"
							},
							{
								"label": "d#4",
								"freq": 311.12698372208087,
								"on": true,
								"$$hashKey": "object:50"
							},
							{
								"label": "e4",
								"freq": 329.6275569128699,
								"on": true,
								"$$hashKey": "object:51"
							},
							{
								"label": "g4",
								"freq": 391.99543598174927,
								"on": true,
								"$$hashKey": "object:52"
							},
							{
								"label": "a4",
								"freq": 440,
								"on": true,
								"$$hashKey": "object:53"
							},
							{
								"label": "c5",
								"freq": 523.2511306011972,
								"on": true,
								"$$hashKey": "object:54"
							},
							{
								"label": "d5",
								"freq": 587.3295358348151,
								"on": true,
								"$$hashKey": "object:55"
							},
							{
								"label": "d#5",
								"freq": 622.2539674441618,
								"on": true,
								"$$hashKey": "object:56"
							},
							{
								"label": "e5",
								"freq": 659.2551138257398,
								"on": true,
								"$$hashKey": "object:57"
							},
							{
								"label": "g5",
								"freq": 783.9908719634985,
								"on": true,
								"$$hashKey": "object:58"
							}
						],
						"NoteMapOn": true,
						"FilterNoteMapOn": false,
						"NoteMap": [
							{
								"label": "a3",
								"freq": 220,
								"on": true,
								"$$hashKey": "object:47"
							},
							{
								"label": "c4",
								"freq": 261.6255653005986,
								"on": true,
								"$$hashKey": "object:48"
							},
							{
								"label": "d4",
								"freq": 293.6647679174076,
								"on": true,
								"$$hashKey": "object:49"
							},
							{
								"label": "d#4",
								"freq": 311.12698372208087,
								"on": true,
								"$$hashKey": "object:50"
							},
							{
								"label": "e4",
								"freq": 329.6275569128699,
								"on": true,
								"$$hashKey": "object:51"
							},
							{
								"label": "g4",
								"freq": 391.99543598174927,
								"on": true,
								"$$hashKey": "object:52"
							},
							{
								"label": "a4",
								"freq": 440,
								"on": true,
								"$$hashKey": "object:53"
							},
							{
								"label": "c5",
								"freq": 523.2511306011972,
								"on": true,
								"$$hashKey": "object:54"
							},
							{
								"label": "d5",
								"freq": 587.3295358348151,
								"on": true,
								"$$hashKey": "object:55"
							},
							{
								"label": "d#5",
								"freq": 622.2539674441618,
								"on": true,
								"$$hashKey": "object:56"
							},
							{
								"label": "e5",
								"freq": 659.2551138257398,
								"on": true,
								"$$hashKey": "object:57"
							},
							{
								"label": "g5",
								"freq": 783.9908719634985,
								"on": true,
								"$$hashKey": "object:58"
							}
						]
					}
				},
				{
					NoteMapInfo: {
						"SelectedScale": "blues",
						"baseNote": "a",
						"octave": 5,
						"availableNotes": [
							{
								"label": "a5",
								"freq": 880,
								"on": true,
								"$$hashKey": "object:120"
							},
							{
								"label": "c6",
								"freq": 1046.5022612023945,
								"on": true,
								"$$hashKey": "object:121"
							},
							{
								"label": "d6",
								"freq": 1174.6590716696303,
								"on": true,
								"$$hashKey": "object:122"
							},
							{
								"label": "d#6",
								"freq": 1244.5079348883237,
								"on": true,
								"$$hashKey": "object:123"
							},
							{
								"label": "e6",
								"freq": 1318.5102276514797,
								"on": true,
								"$$hashKey": "object:124"
							},
							{
								"label": "g6",
								"freq": 1567.981743926997,
								"on": true,
								"$$hashKey": "object:125"
							},
							{
								"label": "a5",
								"freq": 880,
								"on": true,
								"$$hashKey": "object:82"
							},
							{
								"label": "c6",
								"freq": 1046.5022612023945,
								"on": true,
								"$$hashKey": "object:83"
							},
							{
								"label": "d6",
								"freq": 1174.6590716696303,
								"on": true,
								"$$hashKey": "object:84"
							},
							{
								"label": "d#6",
								"freq": 1244.5079348883237,
								"on": true,
								"$$hashKey": "object:85"
							},
							{
								"label": "e6",
								"freq": 1318.5102276514797,
								"on": true,
								"$$hashKey": "object:86"
							},
							{
								"label": "g6",
								"freq": 1567.981743926997,
								"on": true,
								"$$hashKey": "object:87"
							}
						],
						"NoteMapOn": true,
						"FilterNoteMapOn": false,
						"NoteMap": [
							{
								"label": "a4",
								"freq": 440,
								"on": true,
								"$$hashKey": "object:76"
							},
							{
								"label": "c5",
								"freq": 523.2511306011972,
								"on": true,
								"$$hashKey": "object:77"
							},
							{
								"label": "d5",
								"freq": 587.3295358348151,
								"on": true,
								"$$hashKey": "object:78"
							},
							{
								"label": "d#5",
								"freq": 622.2539674441618,
								"on": true,
								"$$hashKey": "object:79"
							},
							{
								"label": "e5",
								"freq": 659.2551138257398,
								"on": true,
								"$$hashKey": "object:80"
							},
							{
								"label": "g5",
								"freq": 783.9908719634985,
								"on": true,
								"$$hashKey": "object:81"
							},
							{
								"label": "a5",
								"freq": 880,
								"on": true,
								"$$hashKey": "object:82"
							},
							{
								"label": "c6",
								"freq": 1046.5022612023945,
								"on": true,
								"$$hashKey": "object:83"
							},
							{
								"label": "d6",
								"freq": 1174.6590716696303,
								"on": true,
								"$$hashKey": "object:84"
							},
							{
								"label": "d#6",
								"freq": 1244.5079348883237,
								"on": true,
								"$$hashKey": "object:85"
							},
							{
								"label": "e6",
								"freq": 1318.5102276514797,
								"on": true,
								"$$hashKey": "object:86"
							},
							{
								"label": "g6",
								"freq": 1567.981743926997,
								"on": true,
								"$$hashKey": "object:87"
							}
						]
					}
				}
			]
		}
	};
})();