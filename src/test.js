var ring;
var displace;

function initialize() {
  const app = new PIXI.Application();
  document.body.appendChild(app.view);
  app.stage.interactive = true;
  const container = new PIXI.Container();
  app.stage.addChild(container);
  
  const padding = 100;
  const bounds = new PIXI.Rectangle(
    -padding,
    -padding,
    app.screen.width + padding * 2,
    app.screen.height + padding * 2,
  );

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
    bg.width = app.screen.width;
    bg.height = app.screen.height;
    container.addChild(bg);

    ring = new PIXI.Sprite(app.loader.resources.ring.texture);
    ring.anchor.set(0.5);
    ring.visible = false;
    container.addChild(ring);

    displace = new PIXI.Sprite(app.loader.resources.filter.texture)
    const displacementFilter = new PIXI.filters.DisplacementFilter(displace);
    container.addChild(displace);
    container.filters = [displacementFilter];
    displacementFilter.scale.x = 110;
    displacementFilter.scale.y = 110;
    displace.anchor.set(0.5);

    app.stage
    .on('mousemove', onPointerMove)
    .on('touchmove', onPointerMove);
  });
}

function onPointerMove(eventData) {
  ring.visible = true;
  displace.position.set(eventData.data.global.x, eventData.data.global.y);
  ring.position.copyFrom(displace.position);
}

window.onload = () => {
  initialize();
}