import { mat4 } from 'vmath';

export default function coord (regl) {
  let drawLine = regl({
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
      a_pos: regl.prop('line'),
      a_color: regl.prop('color'),
    },

    uniforms: {
      model: regl.prop('transform'),
    },

    count: 2,
  });

  const identity = mat4.array(new Float32Array(16), mat4.create());
  const line_x = [ [0, 0, 0], [1, 0, 0] ];
  const line_y = [ [0, 0, 0], [0, 1, 0] ];
  const line_z = [ [0, 0, 0], [0, 0, 1] ];
  const color_r = [ [1, 0, 0], [0.5, 0, 0] ];
  const color_g = [ [0, 1, 0], [0, 0.5, 0] ];
  const color_b = [ [0, 0, 1], [0, 0, 0.5] ];

  return function (transform) {
    transform = transform || identity;
    drawLine([
      { line: line_x, color: color_r, transform },
      { line: line_y, color: color_g, transform },
      { line: line_z, color: color_b, transform },
    ]);
  };
}
