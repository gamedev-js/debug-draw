document.addEventListener('readystatechange', () => {
  if ( document.readyState !== 'complete' ) {
    return;
  }

  // modules
  const pstats = window.pstats;
  const vmath = window.vmath;
  const ddraw = window.ddraw;
  const sgraph = window.sgraph;

  let stats = pstats.new(document.body, {
    values: {
      fps: { desc: 'Framerate (FPS)', below: 30, average: 500 },
      memory: { desc: 'Memory', extension: 'memory.used', average: 1000 },
      drawcalls: { desc: 'Draw Calls', extension: 'webgl.drawcalls' },
      programs: { desc: 'Programs Used', extension: 'webgl.programs' },
    },
    extensions: [
      'memory', 'webgl'
    ],
  });

  // init global
  let canvasEL = document.getElementById('canvas');
  let shell = new ddraw.Shell(canvasEL);
  let renderer = shell._renderer;

  // init scene
  let root = new sgraph.Node('root');
  let n0 = new sgraph.Node('n0');
  n0.lpos = vmath.vec3.new(5, 0.5, 0);

  let n1 = new sgraph.Node('n1');
  n1.lpos = vmath.vec3.new(2, 0, 0);

  root.append(n0);
  n0.append(n1);
  let list = sgraph.utils.flat(root);

  let rot = vmath.quat.create();

  // frame
  shell.frame(() => {
    stats('fps').frame();

    vmath.quat.rotateY(root.lrot, root.lrot, vmath.toRadian(1));
    vmath.quat.rotateX(n0.lrot, n0.lrot, vmath.toRadian(5));

    n1.setWorldRot(rot);

    list.forEach(node => {
      renderer.drawNode(node);
    });

    stats('memory').snapshot();
    stats('drawcalls').snapshot();
    stats('programs').snapshot();
    stats().tick();
  });
});