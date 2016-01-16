function setSplashSize(width, height) {
	document.getElementById("splash").style.width = width;
	document.getElementById("splash").style.height = height;
}

function writeSplashScreens(splashes) {

	for (var i = 0; i < splashes.length; i++) {
		setSplashSize(splashes[i].w, splashes[i].h);
		saveSvgAsPng(document.getElementById("splash"), splashes[i].splashName + ".png", {
			scale: 1
		});
	}
}


var splashesAndroid = [
	{
		splashName: 'android-ldpi-splash',
		w: 426,
		h: 320
	},
	{
		splashName: 'android-mdpi-splash',
		w: 470,
		h: 320
	},
	{
		splashName: 'android-hdpi-splash',
		w: 640,
		h: 480
	},
	{
		splashName: 'android-xhdpi-splash',
		w: 960,
		h: 720
	},
	{
		splashName: 'android-ldpi-splash-tablet',
		w: 200,
		h: 320
	},
	{
		splashName: 'android-mdpi-splash-tablet',
		w: 320,
		h: 480
	},
	{
		splashName: 'android-hdpi-splash-tablet',
		w: 480,
		h: 800
	},
	{
		splashName: 'android-xhdpi-splash-tablet',
		w: 720,
		h: 1280
	}
];

var iosSplashes = [
	{
		splashName: "Default",
		w: 320,
		h: 480
	},
	{
		splashName: "Default@2x",
		w: 640,
		h: 960
	},
	{
		splashName: "Default@2x~iphone",
		w: 640,
		h: 960
	},
	{
		splashName: "Default~iphone",
		w: 320,
		h: 480
	},
	{
		splashName: "Default-568h@2x",
		w: 640,
		h: 1136
	},
	{
		splashName: "Default-667h@2x",
		w: 750,
		h: 1334
	},
	{
		splashName: "Default-667h",
		w: 750,
		h: 1334
	},
	{
		splashName: "Default-736h@3x",
		w: 1242,
		h: 2208
	},
	{
		splashName: "Default-736h",
		w: 1242,
		h: 2208
	},
	{
		splashName: "Default-Portrait",
		w: 768,
		h: 1024
	},
	{
		splashName: "Default-Portrait@2x",
		w: 1536,
		h: 2048
	},
	{
		splashName: "Default-Portrait@2x~ipad",
		w: 1536,
		h: 2048
	},
	{
		splashName: "Default-Portrait~ipad",
		w: 768,
		h: 1024
	},
	{
		splashName: "Default-568h@2x~iphone",
		w: 640,
		h: 1136
	},
	{
		splashName: "Default-568h@2x~iphone",
		w: 640,
		h: 1136
	}
	
	
	
	
	];