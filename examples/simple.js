document.addEventListener('readystatechange', () => {
  if ( document.readyState !== 'complete' ) {
    return;
  }

  // modules
  const Input = window.Input;
  const vmath = window.vmath;
  const ddraw = window.ddraw;

  // init global
  let canvasEL = document.getElementById('canvas');
  const regl = window.createREGL({
    canvas: document.getElementById('canvas'),
    extensions: [
      'webgl_depth_texture',
      'OES_texture_float',
      'OES_texture_float_linear',
      'OES_standard_derivatives'
    ]
  });
  let input = new Input(canvasEL, {
    lock: true
  });
  let last = 0;

  // init darw commands
  let common = ddraw.common(regl);
  let drawGrid = ddraw.grid(regl, 100, 100, 100);
  let drawCoord = ddraw.coord(regl);
  let orbit = new ddraw.Orbit(input, {
    eye: vmath.vec3.new(0, 5, 10),
    phi: vmath.toRadian(-30),
  });

  // on window-resize
  window.addEventListener('resize', () => {
    _resize();
  });

  window.requestAnimationFrame(() => {
    _resize();
  });

  function _resize () {
    let bcr = canvasEL.parentElement.getBoundingClientRect();
    canvasEL.width = bcr.width;
    canvasEL.height = bcr.height;
    input.resize();
  }

  // render
  regl.frame(({time, viewportWidth, viewportHeight}) => {
    let dt = time - last;
    last = time;
    orbit.tick(dt, viewportWidth, viewportHeight);

    //
    input.reset();

    // clear contents of the drawing buffer
    regl.clear({
      color: [0.3, 0.3, 0.3, 1],
      depth: 1
    });

    common({
      view: orbit._cache.view,
      projection: orbit._cache.proj,
    }, () => {
      drawCoord();
      drawGrid();
    });
  });
});