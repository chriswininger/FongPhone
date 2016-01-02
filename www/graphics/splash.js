function setSplashSize(width, height) {
	document.getElementById("splash").style.width = width;
	document.getElementById("splash").style.height = height;
}

function writeSplashScreensForiOS() {

	for (var i = 0; i < iOSsplashScreens.length; i++) {
		setSplashSize(iOSsplashScreens[i].width, iOSsplashScreens[i].height);
		saveSvgAsPng(document.getElementById("splash"), iOSsplashScreens[i].splashName + ".png", {
			scale: 1
		});
	}
}

var iOSsplashScreens = [
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