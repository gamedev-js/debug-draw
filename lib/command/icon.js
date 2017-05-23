export default function icon (regl) {
  return regl({
    vert: `
      precision mediump float;
      uniform mat4 model, view, projection;

      attribute vec3 a_pos;
      attribute vec2 a_uv;

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
      a_pos: regl.prop('pos'),
      a_uv: regl.prop('uv'),
    },

    count: 2,
  });
}
