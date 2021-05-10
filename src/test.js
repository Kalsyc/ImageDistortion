var ring;
var displace;
var displace2;
var bg2;
var container2;
var container;
var viewport;

function initialize() {
  const app = new PIXI.Application();
  document.body.appendChild(app.view);
  app.stage.interactive = true;
  container = new PIXI.Container();
  container2 = new PIXI.Container();
  viewport = new pixi_viewport.Viewport({
    screenWidth: 200,
    screenHeight: 200,
    worldWidth: 200,
    worldHeight: 200,
    interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  });

  viewport.clampZoom({
    minWidth: 200,
    minHeight: 200,
    maxWidth: 200,
    maxHeight: 200,
    minScale: 0.5,
    minScale: 0.5
  });

  app.stage.addChild(container);
  
  app.stage.addChild(container2);
  //container2.addChild(viewport);
  //app.stage.addChild(viewport);
  
  const padding = 100;

  app.loader.add([{
    name: 'bg',
    url: 'images/img_midground_good.png',
    crossOrigin: ''
  },
  {
    name: 'ring',
    url: 'images/ring.png',
    crossOrigin: ''
  },
  {
    name: 'filter',
    url: 'images/displace.png',
    crossOrigin: ''
  }
  ]).load(() => {
    const bg = new PIXI.Sprite(app.loader.resources.bg.texture);
    bg2 = new PIXI.Sprite(app.loader.resources.bg.texture);
    bg.width = app.screen.width/2;
    bg.height = app.screen.height/2;
    bg2.width = app.screen.width/2;
    bg2.height = app.screen.height/2;
    container.addChild(bg);
    
    //viewport.addChild(bg2);
    //viewport.position.y = bg.height;
    container2.addChild(bg2);
    container2.position.y = bg.height;

    ring = new PIXI.Sprite(app.loader.resources.ring.texture);
    ring.anchor.set(0.5);
    ring.visible = false;
    container.addChild(ring);

    displace = new PIXI.Sprite(app.loader.resources.filter.texture)
    displace2 = new PIXI.Sprite(app.loader.resources.filter.texture)
    const displacementFilter = new PIXI.filters.DisplacementFilter(displace);
    const displacementFilter2 = new PIXI.filters.DisplacementFilter(displace2);
    container.addChild(displace);
    container.filters = [displacementFilter];
    container2.addChild(displace2);
    container2.filters = [displacementFilter2];
    displacementFilter.scale.x = 110;
    displacementFilter.scale.y = 110;
    displace.anchor.set(0.5);
    viewport.drag().pinch();

    app.stage
    .on('mousemove', onPointerMove)
    .on('touchmove', onPointerMove);
  });
}

function onPointerMove(eventData) {
  ring.visible = true;
  displace.position.set(eventData.data.global.x, eventData.data.global.y);
  ring.position.copyFrom(displace.position);
  var offset = document.documentElement.clientHeight / 2;
  var radius = 170;
  var zoom = offset / radius /  1.3  * 0.9;
  displace2.position.set(eventData.data.global.x, eventData.data.global.y);
  var mat = new PIXI.Matrix();
  mat.scale(2,2);
  mat.translate(0.5, 0.5);
  bg2.scale = new PIXI.Point(2,2);
  bg2.position.copyFrom(displace2.position);

  //viewport.drag();
  //viewport.fit(false, 200, 200);
  //bg2.setTransform(zoom, 0, 0, zoom, 0, 0, 0, eventData.data.global.x, eventData.data.global.y);
  /*
  viewport.setTransform(
    (container.width / 2 - eventData.data.global.x) * zoom - container.width / 2 * (zoom - 1), 
    (1 / 1.3 * container.height / 2 - eventData.data.global.y + offset) * zoom - 1 / 1.3 * container.height / 2 * (zoom - 1) - (0.3/ 1.3 * container.height / 2 - 80)* zoom,
    zoom,
    zoom,
    0,
    0,
    0,
    0.5,
    0.5
  )
  */
}

window.onload = () => {
  initialize();
}