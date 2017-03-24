## Debug Renderer

A simple renderer support several debug draw.

## Install

```bash
npm install debug-draw
```

## Usage

```javascript
import drend from 'debug-draw';

function animate() {
  // do something

  drend.flush();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

## Documentation

TODO

## TODO

TODO

## License

MIT © 2017 Johnny Wu