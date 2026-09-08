# Three.js

Vendored subset: **three 0.185.1**, MIT license; see `three-LICENSE.txt`.
Includes the official SVGRenderer and its Projector dependency. Bundled as a classic IIFE (`PulseThree`) with Rolldown 1.0.1 to keep the extracted application usable without a module server or CDN.

- [WebGLRenderer documentation](https://threejs.org/docs/pages/WebGLRenderer.html)
- [SVGRenderer documentation](https://threejs.org/docs/pages/SVGRenderer.html)
- [Resource cleanup](https://threejs.org/manual/en/cleanup.html)

The renderer is lazy-loaded only when Actions opens. Model geometry and animation live in `../network-model.js`. GPU mode uses physical materials and a generated studio environment. If WebGL2 is unavailable, the same model uses the official SVG renderer with simpler shading. Both renderers rotate real Three.js geometry; the fallback is not a spinning flat image.

No externally hosted model, texture, font or script is needed. The 3D model is decorative; it is hidden from assistive technologies, receives no pointer input, pauses while the document is hidden, respects reduced motion, and disposes resources when the slide closes. GPU mode is capped at 30 rendered frames per second and 1.5 pixel ratio; SVG mode at 20 rendered frames per second. The rotation period is approximately 42 seconds.
