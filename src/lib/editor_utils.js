const GREEN = "#00FF00";
function drawProximityWarning(context, canvasSpec) {
  let width = canvasSpec.width;
  let height = canvasSpec.height;
  context.font = "3em Calibri";
  context.fillStyle = "White";
  context.textAlign = "center";
  context.fillText(
    "You're too close!",
    canvasSpec.startingX + (width / 2),
    canvasSpec.startingY + (height * .25)
  );
  context.fillText(
    "Please move back!",
    canvasSpec.startingX + (width / 2),
    canvasSpec.startingY + (height * .80)
  );
  context.strokeStyle = 'red';
  context.lineWidth = 15;
  context.strokeRect(canvasSpec.startingX, canvasSpec.startingY, width, height);
}

function selectedPose(context, canvasSpec) {
  let width = canvasSpec.width;
  let height = canvasSpec.height;
  let strokeStyle = context.strokeStyle;
  context.strokeStyle = GREEN;
  context.lineWidth = 7;
  context.strokeRect(canvasSpec.startingX, canvasSpec.startingY, width, height);
  context.strokeStyle = strokeStyle;
}

function bodyTooClose(results) {
  if (results.poseLandmarks) {
    const majorBodyLandmarks = [
      11, 12, // Shoulders
      23, 24, // Hips
      // 25, 26, // Knees
      7, 8    // Middle of head
    ].map((key) => results.poseLandmarks[key].visibility > 0.15)
    const hasInvisibleBodyParts = majorBodyLandmarks.filter((visible) => visible === false).length > 1;
    return hasInvisibleBodyParts;
  }
}


function startCountdown(seconds) {
  let counter = seconds;

  const interval = setInterval(() => {
    console.log(counter);
    counter--;

    if (counter < 0) {
      clearInterval(interval);
      console.log('Ding!');
    }
  }, 1000);
}

class DrawingArea {
  constructor(wireframe, widthPct, heightPct, startingXOffsetPct, startingYOffsetPct) {
    this.width = wireframe.width * widthPct;
    this.height = wireframe.height * heightPct;
    this.startingX = wireframe.width * startingXOffsetPct;
    this.startingY = wireframe.height * startingYOffsetPct;
  }

  offsetWidth() {
    return this.width + this.startingX
  }

  offsetHeight() {
    return this.height + this.startingY
  }
}

function colWiseAverage(landmarkArray) {
  let a = landmarkArray.reduce((acc, current) => {
    if(current) {
      current.forEach((el, i) => {
        if (acc[i]) {
          acc[i].x += el.x
          acc[i].y += el.y
          acc[i].visibility += el.visibility
        } else {
          acc[i] = el
        }
      });
    }
    return acc;
  }, []).map(
    (el) => {
    return {
      x: el.x / landmarkArray.length,
      y: el.y / landmarkArray.length,
      visibility: el.visibility / landmarkArray.length
    }
  });
  return a;
}

export { DrawingArea, startCountdown, bodyTooClose, selectedPose, drawProximityWarning, colWiseAverage}
