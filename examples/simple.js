document.addEventListener('readystatechange', () => {
  if ( document.readyState !== 'complete' ) {
    return;
  }

  // modules
  const vmath = window.vmath;
  const ddraw = window.ddraw;
  const sg = window.sg;

  // init global
  let canvasEL = document.getElementById('canvas');
  let shell = new ddraw.Shell(canvasEL);
  let renderer = shell._renderer;

  // init scene
  let root = new sg.Node('root');
  let n0 = new sg.Node('n0');
  n0.lpos = vmath.vec3.new(5, 5, 5);

  let n1 = new sg.Node('n1');
  n1.lpos = vmath.vec3.new(-5, 5, -5);

  root.append(n0);
  root.append(n1);
  let list = sg.utils.flat(root);

  // frame
  shell.frame(() => {
    vmath.quat.rotateY(root.lrot, root.lrot, vmath.toRadian(1));
    vmath.quat.rotateX(n0.lrot, n0.lrot, vmath.toRadian(5));

    list.forEach(node => {
      renderer.drawNode(node);
    });
  });
});