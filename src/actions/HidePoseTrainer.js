import { Action } from '../lib/Action';
import { Util } from '@aegis-framework/artemis';

export class HidePoseTrainer extends Action {


	static matchString ([ hide, type ]) {
		return hide === 'hide' && type === 'pose_trainer';
	}

	constructor([hide, poseTrainer, separator, ...classes ]) {
		super ();


		this.element = document.querySelector(`[data-component="pose-display"]`);

		if (typeof classes !== 'undefined') {
			this.classes = classes;
		} else {
			this.classes = [];
		}
	}

	apply () {
		this.element.remove ();
		return Promise.resolve ();
	}

	didApply () {
		// for (let i = this.engine.state ('canvas').length - 1; i >= 0; i--) {
		// 	const last = this.engine.state ('canvas')[i];
		// 	const [show, canvas, name, mode] = last.split (' ');
		// 	if (name === this.name) {
		// 		this.engine.state ('canvas').splice (i, 1);
		// 		break;
		// 	}
		// }
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
