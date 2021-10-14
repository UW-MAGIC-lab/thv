import { DrawingArea } from "./editor_utils.js";
import { Pose } from "./Pose.js";
export class PoseAnimation {
	constructor(poses, canvas) {
		this.poses = poses;
		this.startPose = poses[0];
		this.endPose = poses[1];
		this.canvas = canvas;
		this.startTime = null;
		this.previousTimeStamp = null;
		this.totalDuration = 3_000;
		this.context = canvas.getContext('2d');
		this.drawingArea = new DrawingArea(canvas, 1, 1, 0, 0);
		this._clearCanvas();
		// this.startPose.drawFullBody(this.context, { color: 'red', lineWidth: 3 }, this.drawingArea);
		// window.requestAnimationFrame(this.play);
	}

	_clearCanvas() {
		this.context.save();
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	_lerp(startPoint, endPoint, change) {
		if (startPoint && endPoint) {
			let landmark = {}
			Object.keys(startPoint).forEach((key) => {
				landmark[key] = startPoint[key] + (endPoint[key] - startPoint[key]) * change;
			})
			return landmark;
		}
	}

	_nextLandmarks(landmarkSet, change) {
		return this.startPose.results[landmarkSet].map((element, index) => {
			if (element) {
				let startPoint = element;
				let endPoint = this.endPose.results[landmarkSet][index];
				return this._lerp(startPoint, endPoint, change);
			}
		})
	}


	play(timestamp) {
		if (typeof timestamp === 'undefined') {
			return window.requestAnimationFrame(this.play.bind(this));
		}
		let newResults = {};
		if (this.startTime === null) {
			this.startTime = timestamp;
		}
		const elapsed = timestamp - this.startTime;
		let change = elapsed / this.totalDuration;

		if (this.previousTimeStamp !== timestamp) {
			newResults["leftHandLandmarks"] = this._nextLandmarks("leftHandLandmarks", change);
			newResults["rightHandLandmarks"] = this._nextLandmarks("rightHandLandmarks", change);
			newResults["poseLandmarks"] = this._nextLandmarks("poseLandmarks", change);
			newResults["faceLandmarks"] = this._nextLandmarks("faceLandmarks", change);
			this._clearCanvas();
			new Pose(newResults).drawFullBody(this.context, { color: 'red', lineWidth: 3 }, this.drawingArea);
		}
		if (elapsed < this.totalDuration) { // Stop the animation after x seconds
			this.previousTimeStamp = timestamp
			window.requestAnimationFrame(this.play.bind(this));
		} else {
			this.startTime = timestamp;
			[this.startPose, this.endPose] = this.getNextPoseSet();
			window.requestAnimationFrame(this.play.bind(this));
		}
	}

	getNextPoseSet() {
		let secondPoseIndex;
		let direction = this.poses.reduce((previousValue, currentValue, currentIndex) => {
			if (this.startPose === this.poses[currentIndex]) {
				return previousValue - currentIndex
			} else if (this.endPose === this.poses[currentIndex]) {
				secondPoseIndex = currentIndex;
				return previousValue + currentIndex
			} else {
				return previousValue
			}
		}, 0)
		// direction is moving from left to right of array
		if (direction > 0) {
			// if second pose is at the end of the array
			if (secondPoseIndex === this.poses.length - 1) {
				return [this.poses[secondPoseIndex], this.poses[secondPoseIndex - 1]];
			} else {
				return [this.poses[secondPoseIndex], this.poses[secondPoseIndex + 1]];
			}
		}
		// direction is moving from right to left of array
		else {
			// if second pose is at the start of the array
			if (secondPoseIndex === 0) {
				return [this.poses[secondPoseIndex], this.poses[secondPoseIndex + 1]];
			} else {
				return [this.poses[secondPoseIndex], this.poses[secondPoseIndex - 1]];
			}
		}
	}
}
