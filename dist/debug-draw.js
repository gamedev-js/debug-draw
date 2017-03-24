
/*
 * debug-draw v1.0.0
 * (c) 2017 @Johnny Wu
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vmath = require('vmath');

function common(regl) {
  return regl({
    uniforms: {
      view: regl.prop('view'),
      projection: regl.prop('projection')
    }
  });
}

function grid(regl, width, length, seg) {
  let vertices = [];
  let identity = vmath.mat4.array(new Float32Array(16), vmath.mat4.create());

  let hw = width * 0.5;
  let hl = length * 0.5;
  let dw = width / seg;
  let dl = length / seg;

  for (let x = -hw; x <= hw; x += dw) {
    vertices.push(x, 0, -hl);
    vertices.push(x, 0, hl);
  }

  for (let z = -hl; z <= hl; z += dl) {
    vertices.push(-hw, 0, z);
    vertices.push(hw, 0, z);
  }

  return regl({
    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 1,
        dstRGB: 'one minus src alpha',
        dstAlpha: 1
      },
      equation: {
        rgb: 'add',
        alpha: 'add'
      },
      color: [0, 0, 0, 0]
    },

    vert: `
      precision mediump float;
      uniform mat4 model, view, projection;

      attribute vec3 a_pos;

      void main() {
        vec4 pos = projection * view * model * vec4(a_pos, 1);

        gl_Position = pos;
      }
    `,

    frag: `
      precision mediump float;

      void main () {
        gl_FragColor = vec4(0.5, 0.5, 0.5, 0.5);
      }
    `,

    primitive: 'lines',

    attributes: {
      a_pos: vertices,
    },

    uniforms: {
      model: identity,
    },

    count: vertices.length / 3
  });
}

function coord (regl) {
  let drawLine = regl({
    vert: `
      precision mediump float;
      uniform mat4 model, view, projection;

      attribute vec3 a_pos;

      void main() {
        vec4 pos = projection * view * model * vec4(a_pos, 1);

        gl_Position = pos;
      }
    `,

    frag: `
      precision mediump float;
      uniform vec3 color;

      void main () {
        gl_FragColor = vec4(color, 1.0);
      }
    `,

    primitive: 'lines',

    attributes: {
      a_pos: regl.prop('line'),
    },

    uniforms: {
      model: regl.prop('transform'),
      color: regl.prop('color')
    },

    count: 2,
  });

  const identity = vmath.mat4.array(new Float32Array(16), vmath.mat4.create());
  const line_x = [ [0, 0, 0], [1, 0, 0] ];
  const line_y = [ [0, 0, 0], [0, 1, 0] ];
  const line_z = [ [0, 0, 0], [0, 0, 1] ];
  const color_r = [1, 0, 0];
  const color_g = [0, 1, 0];
  const color_b = [0, 0, 1];

  return function (transform) {
    transform = transform || identity;
    drawLine([
      { line: line_x, color: color_r, transform },
      { line: line_y, color: color_g, transform },
      { line: line_z, color: color_b, transform },
    ]);
  };
}

let damping = 10.0;
let moveSpeed = 10.0;

let v3_f = vmath.vec3.new(0,0,-1);
let v3_r = vmath.vec3.new(1,0,0);
let v3_u = vmath.vec3.new(0,1,0);

let rotq = vmath.quat.create();
let rotx = vmath.quat.create();
let roty = vmath.quat.create();
let rot = vmath.mat3.create();
let front = vmath.vec3.create();
let right = vmath.vec3.create();
let up = vmath.vec3.create();
let front2 = vmath.vec3.create();
let right2 = vmath.vec3.create();

class Orbit {
  constructor (input, props) {
    props = props || {};
    props.theta = props.theta || 0;
    props.phi = props.phi || 0;
    props.eye = props.eye || vmath.vec3.new(0,0,0);
    props.near = props.near || 0.01;
    props.far = props.far || 1000.0;
    this._props = props;
    this._cache = {
      view: new Float32Array(16),
      proj: new Float32Array(16),
    };

    this._input = input;
    this._view = vmath.mat4.create();
    this._proj = vmath.mat4.create();

    this._df = 0;
    this._dr = 0;
    this._panX = 0;
    this._panY = 0;
    this._panZ = 0;
    this._curTheta = props.theta;
    this._curPhi = props.phi;
    this._curEye = vmath.vec3.clone(props.eye);
    this._theta = props.theta;
    this._phi = props.phi;
    this._eye = vmath.vec3.clone(props.eye);
  }

  tick (dt, viewportWidth, viewportHeight) {
    this._handleInput();
    this._calcView(dt);
    this._calcProj(viewportWidth, viewportHeight);
    vmath.mat4.array(this._cache.view, this._view);
    vmath.mat4.array(this._cache.proj, this._proj);
  }

  _handleInput () {
    let input = this._input;
    this._df = 0;
    this._dr = 0;
    this._panX = 0;
    this._panY = 0;
    this._panZ = 0;

    if ( input.mousepress('left') && input.mousepress('right') ) {
      let dx = input.mouseDeltaX;
      let dy = input.mouseDeltaY;

      this._panX = dx;
      this._panY = -dy;

    } else if ( input.mousepress('left') ) {
      let dx = input.mouseDeltaX;
      let dy = input.mouseDeltaY;

      this._theta -= dx * 0.002;
      this._panZ = -dy;

    } else if ( input.mousepress('right') ) {
      let dx = input.mouseDeltaX;
      let dy = input.mouseDeltaY;

      this._theta -= dx * 0.002;
      this._phi -= dy * 0.002;
    }

    if ( input.keypress('w') ) {
      this._df += 1;
    }
    if ( input.keypress('s') ) {
      this._df -= 1;
    }
    if ( input.keypress('a') ) {
      this._dr -= 1;
    }
    if ( input.keypress('d') ) {
      this._dr += 1;
    }

    if ( input.mouseScrollY ) {
      this._df -= input.mouseScrollY * 0.05;
    }
  }

  _calcView (dt) {
    //
    this._curPhi = vmath.lerp(this._curPhi, this._phi, dt * damping);
    this._curTheta = vmath.lerp(this._curTheta, this._theta, dt * damping);

    //
    let eye = this._eye;
    let phi = this._curPhi;
    let theta = this._curTheta;

    let panX = this._panX;
    let panY = this._panY;
    let panZ = this._panZ;

    // phi == rot_x, theta == rot_y
    vmath.quat.identity(rotx);
    vmath.quat.identity(roty);

    vmath.quat.rotateX(rotx, rotx, phi);
    vmath.quat.rotateY(roty, roty, theta);
    vmath.quat.mul(rotq, roty, rotx);
    vmath.mat3.fromQuat(rot, rotq);

    vmath.vec3.transformMat3(front, v3_f, rot);
    vmath.vec3.transformMat3(up, v3_u, rot);
    vmath.vec3.transformMat3(right, v3_r, rot);

    if (this._df !== 0) {
      vmath.vec3.scaleAndAdd(eye, eye, front, this._df * dt * moveSpeed);
    }

    if (this._dr !== 0) {
      vmath.vec3.scaleAndAdd(eye, eye, right, this._dr * dt * moveSpeed);
    }

    if (panZ !== 0) {
      vmath.vec3.copy(front2, front);
      front2.y = 0.0;
      vmath.vec3.normalize(front2, front2);
      vmath.vec3.scaleAndAdd(eye, eye, front2, panZ * dt * moveSpeed);
    }

    if (panX !== 0) {
      vmath.vec3.copy(right2, right);
      right2.y = 0.0;
      vmath.vec3.normalize(right2, right2);
      vmath.vec3.scaleAndAdd(eye, eye, right2, panX * dt * moveSpeed);
    }

    if (panY !== 0) {
      vmath.vec3.scaleAndAdd(eye, eye, v3_u, panY * dt * moveSpeed);
    }

    vmath.vec3.lerp(this._curEye, this._curEye, eye, dt * damping);

    //
    vmath.mat4.lookAt(this._view,
      this._curEye,
      vmath.vec3.scaleAndAdd(front2, this._curEye, front, 1.0),
      up
    );
  }

  _calcProj(w, h) {
    vmath.mat4.perspective(this._proj,
      Math.PI / 4.0,
      w / h,
      this._props.near,
      this._props.far
    );
  }
}

exports.common = common;
exports.grid = grid;
exports.coord = coord;
exports.Orbit = Orbit;
//# sourceMappingURL=debug-draw.js.map
