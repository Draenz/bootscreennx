// The preview canvas
const drawCanvas = document.querySelector("#bootPreview");
// The context of the preview canvas
const drawCanvasCtx = drawCanvas.getContext("2d");

// The scaled canvas
const scaledCanvas = document.querySelector("#scaledCanvas");
// The context of the scaled canvas
const scaledCanvasCtx = scaledCanvas.getContext("2d");

// Width of the Nintendo Switch screen, and by extension, the canvas
const CANVAS_WIDTH = 1280;
// Height of the Nintendo Switch screen, and by extension, the canvas
const CANVAS_HEIGHT = 720;

// Load the symbols spritesheet, containing the energy logos
var symbolSheet = new Image();
var symbolSheetNX = new Image();
symbolSheet.src = "assets/img/symbols.png";
symbolSheetNX.src = "assets/img/symbolsNX.png";

// Disable image smoothing, results in a blurry output otherwise
drawCanvasCtx.imageSmoothingEnabled = false;
scaledCanvasCtx.imageSmoothingEnabled = false;

drawCanvasCtx.font = "32px PerfectDOSVGA437Win";

/**
 * Draws a string of text, with accurate character spacing
 * @param {string} text The text to write to the screen
 * @param {number} x The x co-ordinate of the text
 * @param {number} y The y co-ordinate of the text
 * @param {string} color The color in which to write the text
 */
function drawText(text, x, y, color = 'gray'){
    drawCanvasCtx.fillStyle = color;
    drawCanvasCtx.textBaseline = "top"; 

    var backspace = 0;
    for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) == '_'){
            if (drawCanvasCtx.fillStyle == "#ffffff")
                drawCanvasCtx.fillStyle = color
            else
                drawCanvasCtx.fillStyle = "white"
            backspace++;
            continue;
        }
        drawCanvasCtx.fillText(text.charAt(i), x + (i * 16) - (backspace * 16), y);
    }
}

/**
 * Resets and redraws all elements on the canvas
 */
function redrawCanvas(){
    // The type of firmware the user is running
    var cfwType = $('select[name=type] option:selected', "#settings");
    // The firmware version selected by the user
    var firmwareVersion = $('select[name=firmware] option:selected', "#settings");
    // The size of the internal eMMC
    var emmcSize = $('select[name=emmc] option:selected', "#settings");
    // The size of the external SD
    var sdSize = $('select[name=sd] option:selected', "#settings");
    // Copyright information, at the bottom of the screen
    var copyrightLine = "Copyright (C) 2020, ";
    // The chosen region device to display
    var region = $('select[name=regionOptions] option:selected', "#settings");
    // The chosen top-right logo to display
    var sideLogo = $('select[name=logoOptions] option:selected', "#settings");
    // Whether or not to display the bootloader message at the bottom of the screen
	var shouldDrawCustomBootString = $('input[name=hold]', "#settings").is(':checked');
	// The key to be held when entering the bootloader
	var bootloaderKey = $('select[name=onboot] option:selected', "#settings");
	// The bootloader to enter when the user presses the boot key
    var bootloader = $('input[name=boottool]', "#settings");
    // Time at which to hold the boot key
    var bootTime = $('select[name=firstTime] option:selected');

    // Whether to draw the custom bootloader given by the user
	var useCustomBootInput = false;
	// Whether to draw the custom CFW, and Copyright info, given by the user
	var useCustomCfw = false;

    // Changes selection box in input for custom bootloader
	if ($('select[name=boottool] option:selected', "#settings").val() == 'custom') {
		$('input[name=boottool]', "#settings").show();
		$('select[name=boottool]', "#settings").hide();
		useCustomBootInput = true;
    }
    
    // Changes selection box in input for custom CFW
	if ($('select[name=type] option:selected', "#settings").val() == 'custom') {
		$('input[name=type]', "#settings").show();
		$('input[name=typecopyright]', "#settings").show();
		$('select[name=type]', "#settings").hide();
		useCustomCfw = true;
    }
    
    // Set the copyright information
    if(!useCustomCfw){
		switch(cfwType.val()) {
			case 'atmosphere':
				copyrightLine += 'SciresM, TuxSH, hexkyz and fincs';
				break;
			case 'reinx':
				copyrightLine += 'Reisyukaku';
				break;
			case 'lakka':
				copyrightLine += 'Natinusala and libretro';
				break;
			case 'lineageos':
				copyrightLine += 'Switchroot';
				break;
			case 'sxos':
				copyrightLine += 'Team Xecuter';
				break;
		}
	}else{
		copyrightLine += $('input[name=typecopyright]', "#settings").val();
	}

    // Reset the canvas and draw the black background
    drawCanvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawCanvasCtx.fillStyle = "black";
    drawCanvasCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw the 'little blue man'
    drawCanvasCtx.drawImage(symbolSheet, 40, 10, 21, 29, 8, 16, 42, 58);

    // Draw logos at the top right of the screen
    switch (sideLogo.val()) {
        case 'energyStar':
            drawCanvasCtx.drawImage(symbolSheet, 0, 0, 133, 84, 966, 16, 266, 168);
            // Cover the 'little blue man' present in the energy star logo
            drawCanvasCtx.fillStyle = "black";
            drawCanvasCtx.fillRect(1040, 36, 50, 60);
            break;
        case 'energyStarAtmosphere':
            drawCanvasCtx.drawImage(symbolSheet, 0, 84, 133, 84, 966, 16, 266, 168);
			break;
        case 'atmosphere':
            drawCanvasCtx.drawImage(symbolSheet, 30, 168, 101, 84, 1100, 16, 151, 134);
			break;
	case 'reinx':
	    drawCanvasCtx.drawImage(symbolSheetNX, 0, 84, 133, 84, 966, 16, 266, 168);
			break;
	case 'lakka':
	    drawCanvasCtx.drawImage(symbolSheetNX, 30, 168, 101, 84, 1100, 16, 151, 134);
			break;
        case 'lineageos':
            drawCanvasCtx.drawImage(symbolSheetNX, 30, 168, 101, 84, 1100, 16, 151, 134);
			break;
	case 'sxos':
	    drawCanvasCtx.drawImage(symbolSheetNX, 39, 252, 101, 84, 1100, 16, 139, 126);
			break;
	case 'switchlogo':
            drawCanvasCtx.drawImage(symbolSheet, 39, 252, 93, 84, 1128, 16, 139, 126);
			break;
    }
    
    // Set the custom bootloader input box to the users last selection
	if (!useCustomBootInput)
        $('input[name=boottool]', "#settings").val($('select[name=boottool] option:selected', "#settings").text());

    // Set the custom cfw input box to the users last selection
	if (!useCustomCfw)
        $('input[name=type]', "#settings").val($('select[name=type] option:selected', "#settings").text());

    // Draw any text the user requests
    drawText($('input[name=type]', "#settings").val(), 64, 16);
    drawText(copyrightLine, 64, 48);

    if (firmwareVersion.val() == "8.1.1")
    	drawText("Nintendo Switch Lite (ver " + firmwareVersion.val() + ") (" + region.val() + ")", 32, 160);
    else
	drawText("Nintendo Switch (ver " + firmwareVersion.val() + ") (" + region.val() + ")", 32, 160);

    drawText("Main Processor    :   Nvidia Tegra X1 SoC", 32, 224);
    drawText("Memory Test       :   4194304K OK", 32, 256);

    drawText("Plug and Play BIOS Extension, v1.0A", 32, 320);
    drawText("Detecting Primary Master      ... " + emmcSize.val() + " Internal Memory", 64, 352);
    drawText("Detecting Primary Slave       ... " + sdSize.val() + " microSD Card", 64, 384);
    drawText("Detecting Secondary Master    ... None", 64, 416);
    drawText("Detecting Secondary Slave     ... None", 64, 448);

    if (cfwType.val() == "lakka")
    	drawText("Booting GNU/Linux...", 32, 512);
    else if (cfwType.val() == "lineageos")
	drawText("Booting Android Oreo...", 32, 512);
    else
	drawText("Booting Horizon OS...", 32, 512);

    if(shouldDrawCustomBootString)
        drawText("Hold _" + bootloaderKey.val() + "_ " + bootTime.text() + " to enter _" + bootloader.val() + "_.", 16, CANVAS_HEIGHT - 40);

    // Redraw the scaled canvas
    scaleCanvas();
}

/**
 * Creates a scaled copy of the drawcanvas that adapts to screen sizes
 */
function scaleCanvas(){
    scaledCanvasCtx.drawImage(drawCanvas, 0, 0, 1280, 720, 0, 0, scaledCanvas.width, scaledCanvas.height);
}

// Every time an input is changed, modify the preview
$("#settings input, #settings select").on('change', function() {
    redrawCanvas();
});

$("#downloadPNG").click(function() {
    $("#downloadPNG")[0].download = "bootlogo.png";
    $("#downloadPNG")[0].href = drawCanvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
});


$("#downloadBMP").click(function() {
    var rotatedCanvas = document.createElement("canvas");
    rotatedCanvas.setAttribute("width", 720);
    rotatedCanvas.setAttribute("height", 1280);

    var link = document.createElement("a");

    var rotatedCanvasCtx = rotatedCanvas.getContext("2d");
    var oldCanvasImg = new Image();
    // oldCanvasImg.src = drawCanvas.toDataURL();
    oldCanvasImg.src = CanvasToBMP.toDataURL(drawCanvas);

    oldCanvasImg.onload = function(){
        // reset the canvas with new dimensions

        rotatedCanvasCtx.save();
        // translate and rotate
        rotatedCanvasCtx.translate(0, 1280);
        rotatedCanvasCtx.rotate(-(Math.PI / 2));
        // draw the previows image, now rotated
        rotatedCanvasCtx.drawImage(oldCanvasImg, 0, 0);               
        rotatedCanvasCtx.restore();
    
        // $("#downloadBMP")[0].download = "bootlogo.bmp";
        // link.download = "btlgo.bmp"
        // $("#downloadBMP")[0].href = rotatedCanvas.toDataURL("image/bmp");
        // link.href = rotatedCanvas.toDataURL("image/bmp");
        // console.log(CanvasToBMP.toDataURL(rotatedCanvas));
        // link.href = CanvasToBMP.toDataURL(rotatedCanvas);
        download(CanvasToBMP.toDataURL(rotatedCanvas), "download.bmp", "image/bmp");
        // link.href = rotatedCanvas.toDataURL("image/bmp");
        // $("#downloadBMP")[0].click();
        // link.click();
        console.log("stinkee");
    }

});

// Draw the canvas once the window has loaded
window.onload = function() {
    redrawCanvas();
};

// Handle window resizes
$( window ).resize(function() {
    scaleCanvas();
});
