import { ScreenComponent } from '../../lib/ScreenComponent';
import { $_ } from '@aegis-framework/artemis';
import { Pose } from "../../lib/Pose.js";
import { PoseAnimation } from "../../lib/PoseAnimation.js";
// import { DrawingArea, selectedPose, bodyTooClose, drawProximityWarning, colWiseAverage } from "../../lib/editor_utils.js";

export class PoseEditor extends ScreenComponent {
  constructor() {
    // this.setProps({
    //   poses: []
    // });
    super();
    this.setProps({ poses: [] })
  }

  paint = (results) => {
    document.body.classList.add('loaded');
    const spinner = $_('.loading');
    spinner.ontransitionend = () => {
      spinner.style.display = 'none';
    };
    [...document.getElementsByTagName('pose-capture')].forEach(element => {
      element.setProps({ currentPose: results });
      element.renderPose();
    });
    debugger;
    [...document.getElementsByTagName('model-trainer')].forEach(element => {
      element.setProps({ currentPose: new Pose(results)});
    })
  }

  generateAnimation() {
    let firstPose = new Pose(this.engine.storage().conjectures[0].poseOne.results);
    let secondPose = new Pose(this.engine.storage().conjectures[0].poseTwo.results);
    let canvas = this.getElementsByClassName('preview-canvas')[0];
    let animation = new PoseAnimation([firstPose, secondPose], canvas)
    animation.play();
  }

  didMount() {
    this.engine.on('click', '[data-action="edit-conjecture"]', (e) => {
      let conjectureId = parseInt(e.target.dataset.conjectureId);
      let captureContainer = $_(".capture-container").collection[0];
      let connectors = document.createElement('svg-connectors');
      captureContainer.append(connectors);
      let trainer = document.createElement('model-trainer');
      let previewCanvas = document.createElement('preview-animation');
      $_('.preview-container').collection[0].append(previewCanvas);
      $_('.trainer-container').collection[0].append(trainer);
      $_('#conjecture-list').toggleClass('hidden');
      $_('[data-action="back"]').toggleClass('hidden top left');
      $_('#editor-actions').toggleClass('hidden');
      $_(`[data-action="save-poses"]`).attribute('data-conjecture-id', conjectureId)
      this.setProps({
        poses: [document.createElement('pose-capture'), document.createElement('pose-capture')]
      })
      this.props.poses.forEach((poseCapture, index) => {
        captureContainer.append(poseCapture)
        poseCapture.ready(poseCapture.setName.bind(null, `Pose ${index + 1}`))
        poseCapture.ready(connectors.addConnection.bind(connectors, poseCapture, previewCanvas))
      })
      trainer.ready(connectors.addConnection.bind(connectors, previewCanvas, trainer));
      let addPoseButton = document.createElement('add-pose');
      captureContainer.append(addPoseButton);
      this.engine.holistic.onResults(this.paint);
    });

    this.engine.on('click', '[data-action="return-to-menu"]', (e) => {
      $_(`pose-capture`).remove();
      $_(`add-pose`).remove();
      $_(`model-trainer`).remove();
      $_(`preview-animation`).remove();
      $_('svg-connectors').remove();
      $_('#conjecture-list').toggleClass('hidden');
      $_('[data-action="back"]').toggleClass('hidden top left');
      $_('#editor-actions').toggleClass('hidden');
      $_(`[data-action="save-poses"]`).attribute('data-conjecture-id', null)
    }, false);

    this.addEventListener('collect-samples', (e) => {
      let poseCaptureCards = this._props.poses.filter((pose) => pose.open);
      if (poseCaptureCards.length > 1) {
        let cardToClose = poseCaptureCards.filter((pose) => pose !== e.target)[0];
        cardToClose.toggleCollectionWindow();
      }
    }, true)

    this.addEventListener('toggle-finished', (e) => {
      if (Array.from(document.querySelectorAll('pose-capture')).every((el) => el.recordingFinished)) {
        $_('.train-model-btn').toggleClass('disabled');
        let poseProps =  {};
        $_('pose-capture').collection.forEach(element => {
          poseProps[element.getName()] = element._props.rawSamples
        });
        $_('model-trainer').collection[0].setProps({poses: poseProps});
      }
      let previewCanvas = this.getElementsByTagName('preview-animation')[0];
      previewCanvas.setProps({ poses: this.props.poses.map(pose => pose.getSamplePose()).filter(x => x != null) });
      previewCanvas.enablePreview();
    }, true);

    this.addEventListener('add-pose', (e) => {
      let newPose = document.createElement('pose-capture');
      this.props.poses.push(newPose);
      let addPoseButton = $_('add-pose').collection[0];
      addPoseButton.parentNode.insertBefore(newPose, addPoseButton);
      let position = this.props.poses.indexOf(newPose);
      let connectors = $_('svg-connectors').collection[0];

      let previewCanvas = this.getElementsByTagName('preview-animation')[0];
      newPose.ready(newPose.setName.bind(null, `Pose ${position + 1}`))
      newPose.ready(connectors.addConnection.bind(connectors, newPose, previewCanvas))
      newPose.ready(connectors.redraw.bind(connectors))

    }, true)
    return Promise.resolve();
  }



  willUnmount() {
    this.removeEventListener('add-pose')
    this.removeEventListener('collect-samples')
    return Promise.resolve();
  }

  render() {
    return `
			<button class="top left" data-action="back"><span class="fas fa-arrow-left"></span></button>
      <div class="row">
        <h2 data-string="PoseEditor">Pose Editor</h2>
      </div>

      <div class="row hidden" id="editor-actions">
        <button data-action="capture-pose">Capture Pose</button>
        <button data-action="save-poses">Save Poses</button>
        <button data-action="return-to-menu">Return To Conjectures</button>
      </div>
      <div class="hidden row" id="save-message">
        <h2>Saving...</h2>
      </div>
      <table id="conjecture-list">
        <tr>
          <th class="text--center">Conjecture Name</th>
          <th class="text--center">Action</th>
        </tr>
        ${this.engine.storage().conjectures.map(conjecture => {
          return `
          <tr>
            <td class="text--left">${conjecture.name}</td>
            <td class="text--right"><button data-conjecture-id="${conjecture.id}" data-action="edit-conjecture">Edit</button></td>
          </tr>
          `
        }).join("")}
      </table>
      <div class='model-trainer'>
        <div data-component="display-container" class="capture-container"></div>
        <div data-component="display-container" class="preview-container"></div>
        <div data-component="display-container" class="trainer-container"></div>
        <div id="popup">
          <div class="popup-content">
            <h1>Calibration FAQ</h1>
            <p>
              To capture poses with the pose trainer, ensure that your whole body is in the frame. To remove this warning and record, we suggest the following:
              <ul>
                <li>Stand 4-6 feet away from your computer when capturing poses.</li>
                <li>Adjust the angle of your webcam to place your head at the top of the frame.</li>
              </ul>
            </p>
            <a href="#" class="close-popup">&times;</a>
          </div>
        </div>
      </div>
		`;
  }

}

PoseEditor.tag = 'pose-editor';


export default PoseEditor;
