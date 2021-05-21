import { $_ } from '@aegis-framework/artemis';
import { FancyError } from '../lib/FancyError';
import { Action } from '../lib/Action';

export class PoseTrainer extends Action {

  static matchString([show, type]) {
    return show === 'show' && type === 'pose_trainer';
  }

  static shouldProceed() {

    return new Promise((resolve, reject) => {
      // if ($_('pose-display').collection[0]) {
      //   if ($_('pose-display').collection[0].props.switchCount < 1) {
      //     reject('You must finish your training!');
      //   }
      // }

      resolve({ advance: true });
    });
  }

  static onLoad() {
    if (this.engine.state('poseTrainer').length > 0) {
      const promises = [];
      // return to the state of the poseTrainer
      for (const poseTrainer of this.engine.state('poseTrainer')) {
        const action = this.engine.prepareAction(poseTrainer, { cycle: 'Application' });
        const promise = action.willApply().then(() => {
          return action.apply().then(() => {
            return action.didApply({ updateHistory: false, updateState: false });
          });
        });

        promises.push(promise);
      }

      if (promises.length > 0) {
        return Promise.all(promises);
      }
    }

    return Promise.resolve();
  }

  static setup() {
    this.engine.history('poseTrainer');
    this.engine.state({
      poseTrainer: []
    });
    return Promise.resolve();
  }

  // TODO: implement this
  static reset() {
    const promises = [];

    // Go through each canvas element being shown so it can be properly
    // stopped and then removed.
    // this.engine.element().find('[data-component="canvas-container"]').each((canvasContainer) => {
    //   const { object } = canvasContainer.props;

    //   promises.push(Util.callAsync(object.stop, this.engine, canvasContainer.layers, object.props, object.state, canvasContainer).then(() => {
    //     canvasContainer.remove();
    //   }));
    // });

    this.engine.history({
      poseTrainer: []
    });

    this.engine.state({
      poseTrainer: []
    });

    return Promise.all(promises);
  }

  // TODO: implement this
  static bind() {
    // window.addEventListener('resize', () => {
      // this.engine.element().find('[data-component="canvas-container"][mode="background"], [data-component="canvas-container"][mode="immersive"]').each((canvasContainer) => {
      //   const { object } = canvasContainer.props;
      //   if (typeof object.resize === 'function') {
      //     Util.callAsync(object.resize, this.engine, canvasContainer.layers, object.props, object.state, canvasContainer);
      //   }
      // });
    // });
    return Promise.resolve();
  }

  /**
   * Creates an instance of a PoseTrainer Action
   *
   * @param {string[]} parameters - List of parameters received from the script statement.
   * @param {string} parameters.action - In this case, action will always be 'poseTrainer'
   * @param {string} parameters.mode
   */

  constructor([show, poseTrainer, name, mode, separator, ...classes]) {
    super();

    this.name = name;
    this.mode = mode;
    this.conjecture = this.engine.storage().conjectures.filter(
      (conjecture) => conjecture.displayId === this.name
    );

    if (typeof classes !== 'undefined') {
      this.classes = ['animated', ...classes.filter((c) => c !== 'with')];
    } else {
      this.classes = [];
    }
  }

  willApply() {

    // this.object = Canvas.objects(this.name);
    if (this.conjecture.length === 0) {
      FancyError.show(
        `The conjecture with displayId of "${this.name}" was not found or is invalid`,
        `Monogatari attempted to retrieve an object named "${this.name}" but it didn't exist in the saved conjectures.`,
        {
          'Conjecture': this.name,
          'You may have meant': this.engine.storage().conjectures.map((c) => c.displayId),
          'Label': this.engine.state('label'),
          'Step': this.engine.state('step'),
          'Help': {
            '_': `
              Check the conjecture\'s displayId name is correct and that you have defined it previously.
              A canvas object is defined as follows:
            `,
            '_1': `
							<pre>
								<code class='language-javascript'>
									monogatari.storage ({
                    conjectures: [
                      {
                        id: 1,
                        displayId: 'aaa',
                        name: "Angle Angle Angle",
                        poseOne: {
                          results: {
                            leftHandLandmarks: [{ x: 0.7292803525924683, y: 0.39912840723991394  ..., { x: 0.7286646962165833, y: 0.2106991410255432 }],
                            rightHandLandmarks: [{ x: 0.5922070741653442, y: 0.4865525960922241 }, ..., { x: 0.669626772403717, y: 0.41053521633148193 }],
                            faceLandmarks: [{ x: 0.5694752335548401, y: 0.1751568615436554 }, ..., { x: 0.669626772403717, y: 0.41053521633148193 }],
                            poseLandmarks: [null, ..., { x: 0.48310595750808716, y: 1.76513671875, visibility: 0.00004400118632474914 }]
                          }
                        },
                        poseTwo: {
                          results: {
                            leftHandLandmarks: [{ x: 0.7292803525924683, y: 0.39912840723991394  ..., { x: 0.7286646962165833, y: 0.2106991410255432 }],
                            rightHandLandmarks: [{ x: 0.5922070741653442, y: 0.4865525960922241 }, ..., { x: 0.669626772403717, y: 0.41053521633148193 }],
                            faceLandmarks: [{ x: 0.5694752335548401, y: 0.1751568615436554 }, ..., { x: 0.669626772403717, y: 0.41053521633148193 }],
                            poseLandmarks: [null, ..., { x: 0.48310595750808716, y: 1.76513671875, visibility: 0.00004400118632474914 }]
                          }
                        }
                      }
                    ]
                  })
								</code>
							</pre>
						`
          }
        }
      );
      return Promise.reject('Canvas object did not exist or is invalid');
    }
    this.element = document.createElement('pose-display');

    this.containerSelector = `[data-component="pose-display"][pose-display="${this.name}"][mode="${this.mode}"]`;

    return Promise.resolve();
  }

  apply() {
    // const defaultFunction = () => Promise.resolve();
    this.element.setProps({
      desiredPose: {
        poseOne: this.conjecture[0].poseOne,
        poseTwo: this.conjecture[0].poseTwo
      },
      classes: [],
      comparisonPose: "PoseOne",
      switchCount: 0
    });
    this.element.addEventListener('poseSwitch', (e) => {
      let poseToSwitch = this.element.props.comparisonPose === "PoseOne" ? "PoseTwo" : "PoseOne";
      let switchCount = this.element.props.switchCount + 1;
      this.element.setProps({
        comparisonPose: poseToSwitch,
        switchCount: switchCount
      });
      // TODO: remove
      this.engine.proceed({ userInitiated: true, skip: false, autoPlay: false });
      // this.engine.proceed({ userInitiated: false, skip: false, autoPlay: false });
    })
    const gameScreen = this.engine.element().find('[data-screen="game"]');
    gameScreen.find('[data-ui="background"]').append(this.element);
    document.addEventListener('keydown', function(e) {
      if (e.code === "KeyN") {
        debugger;
        this.engine.proceed({ userInitiated: true, skip: false, autoPlay: false });
      }
    }.bind(this))
    this.engine.element().find('[data-component="text-box"]').hide()
    return Promise.resolve();
  }

  didApply({ updateHistory = true, updateState = true } = {}) {
    if (updateHistory === true) {
      this.engine.history('poseTrainer').push(this._statement);
    }

    if (updateState === true) {
      this.engine.state('poseTrainer').push(this._statement);
    }

    if (this.mode === 'background' || this.mode === 'character' || this.mode === 'displayable') {
      return Promise.resolve({ advance: true });
    }

    return Promise.resolve({ advance: false });
  }

  willRevert() {
    this.engine.element().find('[data-character]').remove();
    this.engine.element().find('[data-image]').remove();
    return Promise.resolve();
  }

  revert() {
    return this.engine.revert(this._statement.replace('show scene', 'show background'), false, false).then(() => {
      // this.engine.history ('scene').pop ();
      const restoreSceneItems = () => {
        if (this.engine.history('sceneElements').length > 0) {
          const scene_elements = this.engine.history('sceneElements').pop();

          if (typeof scene_elements === 'object') {
            for (const element of scene_elements) {
              this.engine.element().find('[data-screen="game"]').append(element);
            }
          }
        }

        if (this.engine.history('sceneState').length > 0) {
          const scene_state = this.engine.history('sceneState').pop();

          if (typeof scene_state === 'object') {
            // const state = { ...scene_state };
            // const textBox = this.engine.element().find('[data-component="text-box"]').get(0);

            // textBox.setProps({ mode: state.textBoxMode });

            // if (state.textBoxMode === 'nvl') {
            //   this.engine.global('_should_restore_nvl', true);
            // }

            // delete state.textBoxMode;
            // this.engine.state(scene_state);
          }
        }
      };

      // Check if the scene history still has elements left, if it doesn't then we need to roll back
      // to the initial background defined in the CSS and not in the script.
      if (this.engine.history('scene').length > 0) {
        this.engine.global('_scene_history_cleared_by_background', false);
        const last = this.engine.history('scene')[this.engine.history('scene').length - 1];

        this.engine.state({
          scene: last
        });

        this.engine.history('scene').pop();

        restoreSceneItems();
        return this.engine.action('Dialog').reset();
      }

      // If the scene history was empty, we just need to check if it was the background
      // action who cleared it. If that was the case, we still need to restore the other
      // items that we save for each scene apart from the background.
      if (this.engine.global('_scene_history_cleared_by_background') === true) {
        this.engine.global('_scene_history_cleared_by_background', false);
        restoreSceneItems();
        return this.engine.action('Dialog').reset();
      }
    });
  }

  didRevert() {
    return Promise.resolve({ advance: true, step: true });
  }
}

PoseTrainer.id = 'PoseTrainer';

export default PoseTrainer;
