function setIconSize(size) {
	document.getElementById("icon").style.width = size;
	document.getElementById("icon").style.height = size;
}

function writeIcons() {

	for (var i = 0; i < icons.length; i++) {
		setIconSize(icons[i].size);
		saveSvgAsPng(document.getElementById("icon"), icons[i].iconName + ".png", {
			scale: 1
		});
	}
}

var icons = [
	{
		iconName: "iTunesArtwork@2x",
		size: 1024
	},
	{
		iconName: "iTunesArtwork",
		size: 512
	},
	{
		iconName: "Icon-60@2x",
		size: 120
	},
	{
		iconName: "Icon-60@3x",
		size: 180
	},
	{
		iconName: "Icon-76",
		size: 76
	},
	{
		iconName: "Icon-76@2x",
		size: 152
	},
	{
		iconName: "Icon-Small-40",
		size: 40
	},
	{
		iconName: "Icon-Small-40@2x",
		size: 80
	},
	{
		iconName: "Icon-Small-40@3x",
		size: 120
	},
	{
		iconName: "Icon-Small",
		size: 29
	},
	{
		iconName: "Icon-Small@2x",
		size: 58
	},
	{
		iconName: "Icon-Small@3x",
		size: 87
	}
	];