# ubii-web-physical-embodiment-evaluation
Data collection module for receiving data in the object3DList format in Ubi-Interact. This can be used to compare values from two topics, such as in physical embodiment scenarios.

## Usage
Ubii-web-physical-embodiment-evaluation can be used either as a standalone demo or as a node module in Your own applications.

## Prerequisites
This project communicates with a [Ubi-Interact master node](https://github.com/SandroWeber/ubii-node-master). Even though some of the functionality can be tested without it, it is recommended to have one.

Another Ubi-Interact application is required that sends the data to the master node. This module and the demo are designed to be used with [ubii-vr-physics-embodiment-babylonjs](https://github.com/SandroWeber/ubii-vr-physics-embodiment-babylonjs) and [ubii-vr-physics-embodiment-unity](https://github.com/SandroWeber/ubii-vr-physics-embodiment-unity).

### Online Demo
The demo in this project is available at https://goldst.dev/ubii-web-evaluation.

### Running the demo locally
After cloning, install, and run the project:
```bash
npm install
npm start
```
Your terminal will contain the demo URL, e.g. http://localhost:8080. Note that the command starts a development server which is not suitable for production environments.

### Using this project as a node module
To your existing node project, add the module:
```bash
npm i ubii-web-physical-embodiment-evaluation
```

You can either initialize the evaluator in HTML using the bundled version:
```html
<script src=".node_modules/ubii-web-physical-embodiment-evaluation/dist/bundle.js"></script>

<script>
    new UbiiPEEvaluation.Evaluator(options);
</script>
```

Or you can import it directly in your JavaScript/TypeScript project:
```js
import { Evaluator } from 'ubii-web-physical-embodiment-evaluation';

new Evaluator(options);
```

For available options, see [EvaluatorOptions.ts](./src/EvaluatorOptions.ts).

That's it! Other than supplying the options, no further configuration is necessary. If You want to stop the evaluator, just call `stop()` on the evaluator object.

## License
[MIT](LICENSE)
