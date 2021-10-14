import { Component } from '../../../lib/Component';
import { PoseAnimation } from "../../../lib/PoseAnimation.js";

export default class PreviewAnimation extends Component {
  constructor() {
    super()
  }

  render() {
    return `
      <div class="card">
        <div class='preview-btn button disabled-btn'>Preview Model Animation</div>
        <canvas class="preview-canvas hidden" style="display: block; width:128px; height:128px"></canvas>
      </div>
    `
  }

  didMount() {
    let component = this;
    component.getElementsByClassName('preview-btn')[0].onclick = function(event) {
      if (this.classList.contains("disabled-btn")) {
        return;
      } else {
        component.getElementsByClassName('preview-canvas')[0].classList.toggle('hidden');
        component.showAnimation();
      }
    }
    this.setProps({ poses: [] })
    return Promise.resolve();
  }

  enablePreview() {
    let classList = this.getElementsByClassName('preview-btn')[0].classList;
    if (this.props.poses.length >= 2 && classList.contains('disabled-btn')) {
      classList.toggle('disabled-btn');
    }
  }

  showAnimation() {
    let canvas = this.getElementsByClassName('preview-canvas')[0];
    let animation = new PoseAnimation(this.props.poses, canvas)
    animation.play();
  }
}

PreviewAnimation.tag = 'preview-animation';
