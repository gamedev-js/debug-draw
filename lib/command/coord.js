import { mat4 } from 'vmath';

export default function coord (regl) {
  let drawLines = regl({
    vert: `
      precision mediump float;
      uniform mat4 model, view, projection;

      attribute vec3 a_pos;
      attribute vec3 a_color;

      varying vec3 color;

      void main() {
        vec4 pos = projection * view * model * vec4(a_pos, 1);

        gl_Position = pos;
        color = a_color;
      }
    `,

    frag: `
      precision mediump float;
      varying vec3 color;

      void main () {
        gl_FragColor = vec4(color, 1.0);
      }
    `,

    primitive: 'lines',

    attributes: {
      a_pos: regl.prop('lines'),
      a_color: regl.prop('colors'),
    },

    uniforms: {
      model: regl.prop('transform'),
    },

    count: regl.prop('count'),
  });

  const identity = mat4.array(new Float32Array(16), mat4.create());

  return function (transform) {
    transform = transform || identity;
    drawLines({
      transform,
      lines: [
        [0, 0, 0], [0.5, 0, 0], // x
        [0, 0, 0], [0, 0.5, 0], // y
        [0, 0, 0], [0, 0, 0.5], // z
      ],
      colors: [
        [1, 0, 0], [0.5, 0, 0], // x (red)
        [0, 1, 0], [0, 0.5, 0], // y (blue)
        [0, 0, 1], [0, 0, 0.5], // z (green)
      ],
      count: 6,
    });
  };
}
