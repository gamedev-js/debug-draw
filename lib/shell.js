import Input from 'input';
import {vec3, toRadian} from 'vmath';
import Orbit from './camera/orbit';
import Renderer from './renderer';

export default class Shell {
  constructor ( canvasEL ) {
    this._renderer = new Renderer(canvasEL);
    this._input = new Input(canvasEL, {
      lock: true
    });
    this._orbit = new Orbit(this._input, {
      eye: vec3.new(0, 5, 10),
      phi: toRadian(-30),
    });
    this._last = 0;
    this._dt = 0;
    this._time = 0;

    // on window-resize
    window.addEventListener('resize', () => {
      this.resize();
    });

    window.requestAnimationFrame(() => {
      this.resize();
    });
  }

  frame (cb) {
    this._renderer.frame(({time, viewportWidth, viewportHeight}) => {
      let dt = time - this._last;
      this._last = time;
      this._dt = dt;
      this._time = time;

      if (cb) {
        cb();
      }

      this._orbit.tick(dt, viewportWidth, viewportHeight);
      this._renderer.setUniform('view', this._orbit._cache.view);
      this._renderer.setUniform('projection', this._orbit._cache.proj);

      this._input.reset();
    });
  }

  resize () {
    this._renderer.resize();
    this._input.resize();
  }
}