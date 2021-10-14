import { Component } from '../../lib/Component';

class ModelLoader extends Component {
  constructor() {
    super()
  }

  render() {
    return `
      <h2>
        Loading...<br>
        Allow the browser to <br>
        use your webcam...
      </h2>
      <div class="mosaic-loader">
        <div class="cell d-0"></div>
        <div class="cell d-1"></div>
        <div class="cell d-2"></div>
        <div class="cell d-3"></div>
        <div class="cell d-1"></div>
        <div class="cell d-2"></div>
        <div class="cell d-3"></div>
        <div class="cell d-4"></div>
        <div class="cell d-2"></div>
        <div class="cell d-3"></div>
        <div class="cell d-4"></div>
        <div class="cell d-5"></div>
        <div class="cell d-3"></div>
        <div class="cell d-4"></div>
        <div class="cell d-5"></div>
        <div class="cell d-6"></div>
      </div>
    `;
  }
}

ModelLoader.tag = 'model-loader';

export default ModelLoader;
