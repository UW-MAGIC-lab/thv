import { Action } from '../lib/Action';
import { Util } from '@aegis-framework/artemis';

export class HidePoseTrainer extends Action {


	static matchString ([ hide, type ]) {
		return hide === 'hide' && type === 'pose_trainer';
	}

	constructor([hide, poseTrainer, name, separator, ...classes ]) {
		super ();

		this.name = name;

		this.element = document.querySelector(`[data-component="pose-display"][pose-display="${this.name}"]`);

		if (typeof classes !== 'undefined') {
			this.classes = classes;
		} else {
			this.classes = [];
		}
	}

	apply () {
		const { object } = this.element.props;

		return Util.callAsync (object.stop, this.engine, this.element.layers, object.props, object.state, this.element).then (() => {
			this.engine.element ().find (`[data-component="canvas-container"][canvas="${this.name}"]`).remove ();
			return Promise.resolve ();
		});
	}

	didApply () {
		debugger;
		for (let i = this.engine.state ('canvas').length - 1; i >= 0; i--) {
			const last = this.engine.state ('canvas')[i];
			const [show, canvas, name, mode] = last.split (' ');
			if (name === this.name) {
				this.engine.state ('canvas').splice (i, 1);
				break;
			}
		}
		return Promise.resolve ({ advance: true });
	}

	revert () {
		for (let i = this.engine.history ('canvas').length - 1; i >= 0; i--) {
			const last = this.engine.history ('canvas')[i];
			const [show, canvas, name, mode] = last.split (' ');
			if (name === this.name) {
				this.engine.history ('canvas').splice (i, 1);
				return this.engine.run (last, false);

			}
		}
		return Promise.resolve ();
	}

	didRevert () {
		return Promise.resolve ({ advance: true, step: true });
	}
}

HidePoseTrainer.id = 'Hide::PoseTrainer';

export default HidePoseTrainer;
