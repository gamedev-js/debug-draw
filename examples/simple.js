document.addEventListener('readystatechange', () => {
  if ( document.readyState !== 'complete' ) {
    return;
  }

  // modules
  const vmath = window.vmath;
  const ddraw = window.ddraw;
  const sgraph = window.sgraph;

  let stats = new window.LStats(document.body);
  let glStats = new window.GLStats(document.body);

  // init global
  let canvasEL = document.getElementById('canvas');
  let shell = new ddraw.Shell(canvasEL);
  let renderer = shell._renderer;

  glStats.inspect(renderer._regl._gl);

  // init scene
  let root = new sgraph.Node('root');
  let n0 = new sgraph.Node('n0');
  n0.lpos = vmath.vec3.new(5, 0.5, 0);

  let n1 = new sgraph.Node('n1');
  n1.lpos = vmath.vec3.new(2, 0, 0);

  root.append(n0);
  n0.append(n1);
  let list = sgraph.utils.flat(root);

  let nn = new sgraph.Node('nn');
  nn.lpos = vmath.vec3.new(3, 2, 0);
  list.push(nn);

  let wpos = vmath.vec3.create();
  let rot = vmath.quat.create();

  // frame
  shell.frame(() => {
    glStats.reset();

    vmath.quat.rotateY(root.lrot, root.lrot, vmath.toRadian(1));
    vmath.quat.rotateX(n0.lrot, n0.lrot, vmath.toRadian(5));

    n1.setWorldRot(rot);
    nn.lookAt(n0.getWorldPos(wpos));

    list.forEach(node => {
      renderer.drawNode(node);
    });

    stats.tick();
  });
});