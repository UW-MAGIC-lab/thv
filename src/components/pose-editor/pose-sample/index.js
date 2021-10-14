import { Component } from '../../../lib/Component';
import { DrawingArea } from "../../../lib/editor_utils.js";

const RED = "#FF0000";

export default class PoseSample extends Component {
  constructor(pose) {
    super();
    this.props = {
      pose: pose
    };
  }

  render() {
    return `
      <li id="webcam-container">
        <canvas class="sample" style="display: block; width:58px; height:58px"></canvas>
      </li>
    `
  }

  didMount() {
    let canvas = this.getElementsByClassName('sample')[0];
    if (this.props.pose) {
      let context = canvas.getContext('2d');
      context.save();
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.props.pose.drawFullBody(context, { color: RED, lineWidth: 3 }, new DrawingArea(canvas, 1, 1, 0, 0));
      context.restore();
    }
    return Promise.resolve();
  }
}

PoseSample.tag = 'pose-sample';
