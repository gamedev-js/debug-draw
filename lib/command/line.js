import { mat4 } from 'vmath';

export default function line (regl) {
  let identity = mat4.array(new Float32Array(16), mat4.create());

  return regl({
    vert: `
      precision mediump float;
      uniform mat4 model, view, projection;

      attribute vec3 a_pos;

      void main() {
        vec4 pos = projection * view * vec4(a_pos, 1);

        gl_Position = pos;
      }
    `,

    frag: `
      precision mediump float;

      void main () {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
      }
    `,

    primitive: 'lines',

    attributes: {
      a_pos: regl.prop('line'),
    },

    count: 2,
  });
}
