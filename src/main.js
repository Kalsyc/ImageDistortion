//Images
var mainImg = new Image();
var badMainImg = new Image();
var displacementImg = new Image();
var displaceContext;
var displaceData;
mainImg.src = "https://test-video-bucket-darren.s3-ap-southeast-1.amazonaws.com/img_midground_good.png";
badMainImg.src = "https://test-video-bucket-darren.s3-ap-southeast-1.amazonaws.com/img_midground_bad.jpg";
displacementImg.src = "https://test-video-bucket-darren.s3-ap-southeast-1.amazonaws.com/displace.png";

//Global Variables
var touchInput;
var mainCanvas;
var zoomCanvas;
var displaceCanvas;
var offset = document.documentElement.clientHeight / 2;
var radius = 170;
var zoom = offset / radius /  1.3  * 0.9;

function initialize() {
  mainCanvas = document.getElementById("main-canvas");
  zoomCanvas = document.getElementById("zoom-canvas");
  displaceCanvas = document.getElementById("displace-canvas");
  displaceContext = displaceCanvas.getContext('2d');
  displaceData = displaceContext.getImageData(0, 0, displacementImg.width, displacementImg.height);
  resizeCanvas(mainCanvas);
  resizeCanvas(zoomCanvas);
  scaleToFillImage(mainCanvas, mainImg);
  scaleToFillImage(zoomCanvas, badMainImg);
  const zoomContext = zoomCanvas.getContext('2d');
  zoomContext.filter = "url(#noise)";
}

function resizeCanvas(canvas) {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight / 2 * 1.3;
}

function scaleToFillImage(canvas, img) {
  const context = canvas.getContext('2d');
  const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const x = (canvas.width / 2) - (img.width / 2) * scale;
  const y = (canvas.height / 2) - (img.height / 2) * scale;
  
  context.drawImage(img, x, y, img.width * scale, img.height * scale);
}

function getGesturePosition(event) {
  if (event.targetTouches) {
    touchInput = simulateTouch(event.targetTouches);
    return true;
  } else if (event.clientX) {
    touchInput = simulateTouch([{
      clientX: event.clientX,
      clientY: event.clientY
    }])
    return true;
  }
  return false;
}

function simulateTouch(touch) {
  return {
    center: {
      x: touch[0].clientX,
      y: touch[0].clientY
    },
    radius: 50
  }
}

function handleGestureStart(event) {
  if (getGesturePosition(event)) {
    drawCircle();
    return;
  }
}

function handleGestureMove(event) {
  event.preventDefault();
  if (getGesturePosition(event)) {
    drawCircle(true);
  }
}

function drawCircle(bool) {
  if (touchInput !== null && typeof(touchInput) !== "undefined") {
    const zoomContext = zoomCanvas.getContext('2d');
    const mainContext = mainCanvas.getContext('2d');
    zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    zoomContext.setTransform(zoom, 
      0, 
      0, 
      zoom,
      (zoomCanvas.width / 2 - touchInput.center.x) * zoom - zoomCanvas.width / 2 * (zoom - 1), 
      (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - (0.3/ 1.3 * zoomCanvas.height / 2 - 80)* zoom);
      //zoomContext.filter = "url(#noise)";
      //mainContext.filter = "url(#noise)";
      scaleToFillImage(zoomCanvas, mainImg);
      zoomContext.filter = "url(#noise)";
      //mainContext.filter = "url(#noise)";
    
    //const imageData = zoomContext.getImageData(0, 0, mainImg.width, mainImg.height);
    //var filtered = ImageFilters.DisplacementMapFilter(imageData, displaceData);
    //var filtered = ImageFilters.GrayScale(imageData);
    //zoomContext.putImageData(filtered, 0, 0);
    
    //const filteredImg = new Image();
    //filteredImg.src = zoomCanvas.toDataURL();
    //console.log(filteredImg);
    
  }
}

window.onload = () => {
  initialize();
  mainCanvas.addEventListener('touchstart', this.handleGestureStart, true);
  mainCanvas.addEventListener('touchmove', this.handleGestureMove, true);
  mainCanvas.addEventListener('mousedown', this.handleGestureStart, true);
  mainCanvas.addEventListener('mousemove', this.handleGestureMove, true);
}