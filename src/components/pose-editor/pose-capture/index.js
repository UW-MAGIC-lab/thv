import { Component } from '../../../lib/Component';
import { DrawingArea, selectedPose, bodyTooClose, drawProximityWarning, colWiseAverage } from "../../../lib/editor_utils.js";
import { Pose } from "../../../lib/Pose.js";

const RED = "#FF0000";
const SMOOTHING = false;

const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

export default class PoseCapture extends Component {

  constructor() {
    super();
    this.samples = [];
    this.open = false;
    this.recording = false;
    this.recordingFinished = false;

    this.props = {
      rawSamples: [],
    };
  }

  renderPose = () => {
    let targets = this.getElementsByClassName('canvas-target')
    let pose = new Pose(this._props.currentPose);
    this.toggleLandmarksWarning(pose);
    if (pose) {
      if (this.recording) {
        let newSample = document.createElement('pose-sample');
        newSample.setProps({ pose: pose })
        this.props.rawSamples.push(pose)
        this.getElementsByTagName('ol')[0].appendChild(newSample)
      }
      targets.forEach(canvas => {
        let context = canvas.getContext('2d');
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        pose.drawFullBody(context, { color: RED, lineWidth: 3 }, new DrawingArea(canvas, 1, 1, 0, 0));
        context.restore();
      });
    }
  }

  toggleCollectionWindow = () => {
    this.open = !this.open;
    let openContainer = this.getElementsByClassName('open-container')[0];
    let closedContainer = this.getElementsByClassName('closed-samples-label-row')[0];
    closedContainer.style = this.open ? "display: none;" : "display: flex;";
    openContainer.style = this.open ? "display: block;" : "display: none;";
    const event = new Event('collect-samples');
    openContainer.classList.toggle('show')
    openContainer.classList.toggle('closed')
    this.dispatchEvent(event);
  }

  toggleLandmarksWarning(pose) {
    let warningContainer = this.getElementsByClassName('landmarks-error')[0];
    // hide warning when both hands and pose landmarks are in the frame
    if (pose.results.leftHandLandmarks && pose.results.rightHandLandmarks && pose.results.poseLandmarks) {
      if (!warningContainer.classList.contains("hidden")) {
        warningContainer.classList.toggle("hidden")
      }
    } else {
      // otherwise, show the warning if it's hidden
      if (warningContainer.classList.contains("hidden")) {
        warningContainer.classList.toggle("hidden")
      }
    }
  }

  setName = (name) => {
    this.getElementsByClassName('pose-label')[0].innerHTML = name;
  }

  getName = () => {
    return this.getElementsByClassName('pose-label')[0].innerHTML;
  }

  triggerCountdown = () => {
    let timedButton = this.getElementsByClassName('timed-button')[0];
    timedButton.style["pointer-events"] = 'none';
    let countDownValue = 3;
    let countUpValue = 0;
    let timer;
    this.toggleRecordingBadge(false);
    // reset the raw samples
    [...$_(this).closest('ol').collection[0].children].map((element) => element.remove());
    this.setProps({ rawSamples: [] });
    //
    let updateButtonText = () => {
      if (countDownValue > 0 && countUpValue === 0) {
        timedButton.innerText = `Recording in: ${countDownValue}`;
        --countDownValue;
      } else if (countUpValue < 5) {
        this.recording = true;
        timedButton.innerText = `Recording: ${countUpValue}`;
        ++countUpValue;
      } else {
        timedButton.innerText = `Click to record`;
        timedButton.style["pointer-events"] = 'auto';
        this.toggleRecordingBadge(true);
        this.recording = false;
        clearInterval(timer);
      }
    }
    updateButtonText();
    timer = setInterval(updateButtonText, 1000);
  }

  toggleRecordingBadge(updateValue) {
    // don't toggle the badge if there are no pose samples
    this.recordingFinished = updateValue
    if (this.props.rawSamples.length > 0) {
      let classes = this.getElementsByClassName('finished-badge')[0].classList;
      classes.contains('hidden') ? classes.remove('hidden') : classes.add('hidden');
      this.dispatchEvent(new Event('toggle-finished'));
    }
  }

  getSamplePose() {
    median(this.props.rawSamples[24]);
  }

  didMount() {
    this.getElementsByClassName('sample-source-btn')[0].onclick = this.toggleCollectionWindow
    this.getElementsByClassName('exit-button')[0].onclick = this.toggleCollectionWindow
    this.getElementsByClassName('timed-button')[0].onclick = this.triggerCountdown
    this.getElementsByClassName('remove-pose-capture')[0].onclick = this.remove.bind(this)
    return Promise.resolve();
  }

  render() {
    return `
      <div class="card long" >
        <header class="section header">
          <div class="pose-label" contenteditable>
            hello
          </div>
          <svg class="remove-pose-capture" style="cursor: pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#185ABC"></path>
          </svg>
        </header>

      <div class="section closed-samples-label-row">
        <div>
          <div class="samples-label">Add Pose Samples:</div>
          <button class="sample-source-btn" title="Add sample: Webcam">
            <svg class="sample-source-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#1967D2" fill-rule="evenodd" clip-rule="evenodd" d="M18 6V10.48L22 6.5V17.5L18 13.52V14.52V18C18 19.1 17.1 20 16 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4H16C17.1 4 18 4.9 18 6ZM16 14.52V9.69V6H4V18H16V14.52Z"></path>
            </svg>
            <span class="sample-source-label">Webcam</span>
          </button>
        </div>
        <div class="hidden finished-badge">Finished</div>
      </div>
      <div class="open-container ${this.open ? "show" : "closed"}" style="position: relative; ${this.open ? "display: block;" : "display: none;"}" >
        <div id="slot-container " class='section' style="display: inline-block;">
          <div id="slot-label">
              <h4>Webcam</h4>
              <span class="exit-button">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#185ABC"></path>
                </svg>
              </span>
            </div>
            <slot>
              <div id="webcam-container">
                <canvas class="canvas-target" width="265" height="265"></canvas>
                <span class='timed-button'>
                  Click to record
                </span>
              </div>
              <div id="webcam-error" style="display: none;" aria-hidden="true">
                <span id="webcam-error-text">
                  There was an error opening your webcam. Make sure permissions are enabled or switch to image uploading.
                </span>
              </div>
            </slot>
            <a href="#popup" class="landmarks-error" style="
                padding: 6px 0;
                color: #d5385a;
                margin: 6px 0;
                display: flex;
                justify-content: space-around;
                align-items: center;
                font-size: 1.2em;
                max-width: 100%;">
                <i class="fas fa-exclamation-triangle"></i>
                <div style="overflow-wrap: break-word;inline-size: 200px;">
                Warning: Click here for calibration instructions.
                </div>
            </a>
          </div>
          <div id="samples-container" class="section sample-section">
            <div id="open-samples-label" class="samples-label">Add Pose Samples:</div>
            <div id="inner-samples-container">
              <ol id="samples" style="width: auto;">
              </ol>
            </div>
          </div>
      </div>
    </div>
    `
  }
}


PoseCapture.tag = 'pose-capture';
