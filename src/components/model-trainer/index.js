import { Component } from '../../lib/Component';
import { neuralNetwork } from 'ml5';

class ModelTrainer extends Component {
  constructor() {
    super()
    this.trainingOptions = { epochs: 50 };
  }

  didMount () {
    let component = this;
    component.getElementsByClassName('train-model-btn')[0].onclick = (event) => {
      if (this.classList.contains("disabled") || component.training) {
        return;
      } else {
        this.dispatchEvent(new Event('startTraining'));
        component.training = true;
        $_('#training-progress').toggleClass("hidden")
        let poseProps = Object.entries(component._props["poses"]);
        component.brain = neuralNetwork({
          inputs: poseProps[0][1][0].getPoseLandmarks().length, //drill down to first pose and get landmark position lengths
          outputs: poseProps.length,
          task: 'classification',
          debug: true
        })
        poseProps.forEach((poseSet) => {
          var [label, poses] = poseSet;
          poses.forEach(pose => {
            let data = pose.getPoseLandmarks();
            if (!data.includes(null)) {
              component.brain.addData(data, [label]);
            }
          })
        })
        component.brain.normalizeData();
        component.brain.train(
          component.trainingOptions,
          (epoch, loss) => {
            $_('#training-progress').collection[0].value = (epoch / this.trainingOptions.epochs).toFixed(2) * 100;
            console.log(`epoch: ${epoch}, loss:${loss}`);
          },
          () => {
            console.log('model trained');
            component.training = false;
            component.showPreviewVideo();
          }
        )
      }
    }
    return Promise.resolve ();
  }

  bind() {
    return Promise.resolve();
  }
  handleClassification(error, result) {
    if (error) {
      console.error(error);
      return;
    }
    debugger;
    console.log(result); // {label: 'red', confidence: 0.8};
    let poseLandmarks = this._props.currentPose.getPoseLandmarks();
    if (!poseLandmarks.includes(null)) {
      this.brain.classify(poseLandmarks, this.handleClassification)
    } else {
      this.handleClassification()
    }
  }

  showPreviewVideo() {
    debugger;
    let previewVideo = this.getElementsByClassName('preview-model')[0];
    if (previewVideo.classList.contains('hidden')) {
      previewVideo.classList.toggle('hidden');
      previewVideo.srcObject =  $_('.input_video').collection[0].srcObject
      previewVideo.play();
    }
    let poseLandmarks = this._props.currentPose.getPoseLandmarks();
    if (!poseLandmarks.includes(null)) {
      this.brain.classify(poseLandmarks, this.handleClassification)
    } else {
      this.handleClassification()
    }

  }

  finished() {
    console.log('model trained');
    debugger;
    this.brain.save();
  }

  render() {
    return `
      <div class="card">
        <div class='train-model-btn button disabled'>Train Model</div>
        <progress value='0' min='0' max='100' class='hidden' id='training-progress'></progress>
        <div class='preview-model hidden'>
          <video class="preview-video" style="width:300px; height: 300px; display: block; margin: 0 auto;"></video>
        </div>
      </div>
    `;
  }
}

ModelTrainer.tag='model-trainer';

export default ModelTrainer;
