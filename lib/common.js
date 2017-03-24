'use strict';

export default function common(regl) {
  return regl({
    uniforms: {
      view: regl.prop('view'),
      projection: regl.prop('projection')
    }
  });
}