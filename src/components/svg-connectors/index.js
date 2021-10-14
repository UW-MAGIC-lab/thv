import { Component } from '../../lib/Component';

class SVGConnectors extends Component {
  constructor() {
    super(...arguments)
    this._allConnections = []
    this.ignoreScrollOffset = true
    this.width = 100
    this.height = 100
    this.observer = new window.MutationObserver(this.updateConnections.bind(this))
  }

  didMount() {
    window.addEventListener("resize", this.redraw.bind(this), true);
    window.addEventListener('scroll', this.redraw.bind(this), true);
    window.addEventListener('collect-samples', this.redraw.bind(this), true);
    return Promise.resolve();
  }

  didUnmount() {
    window.removeEventListener("resize", this.redraw);
    window.removeEventListener("scroll", this.redraw);
    window.removeEventListener("collect-samples", this.redraw);
    this.observer.disconnect();
    return Promise.resolve();
  }

  addConnection(source, target, width = 0, height = 0) {
    this.__svgFullHeight();
    const pathNode = this.__addPath(this.__calculatePath(source, target, width, height));
    this._allConnections.push({
      nodes: [source, target],
      path: pathNode
    })
    this.observer.observe(source.parentElement, { attributes: true, childList: true, subtree: true })
  }

  updateConnections(mutationList, observer) {
    for (const mutation of mutationList) {
      if (mutation.removedNodes[0] && mutation.removedNodes[0].nodeName === "POSE-CAPTURE") {
        this.redraw()
      }
    }
  }

  __calculatePath(source, target, width = 0, height = 0) {
    const sourceDimensions = source.getBoundingClientRect(),
      targetDimensions = target.getBoundingClientRect();
    width > 0 && (sourceDimensions.x -= width, targetDimensions.x -= width), height > 0 && (sourceDimensions.y -= height, targetDimensions.y -= height);
    const a = document.documentElement,
      xOffset = this.ignoreScrollOffset ? 0 : (window.pageXOffset || a.scrollLeft) - (a.clientLeft || 0),
      yOffset = this.ignoreScrollOffset ? 0 : (window.pageYOffset || a.scrollTop) - (a.clientTop || 0);
    sourceDimensions.x += xOffset, targetDimensions.x += xOffset, sourceDimensions.y += yOffset, targetDimensions.y += yOffset;
    const sourceAndTargetDimensions = [{
      x: sourceDimensions.x + sourceDimensions.width / 2,
      y: sourceDimensions.y - 1
    }, {
      x: sourceDimensions.x + sourceDimensions.width / 2,
      y: sourceDimensions.y + sourceDimensions.height + 1
    }, {
      x: sourceDimensions.x - 1,
      y: sourceDimensions.y + sourceDimensions.height / 2
    }, {
      x: sourceDimensions.x + sourceDimensions.width + 1,
      y: sourceDimensions.y + sourceDimensions.height / 2
    }, {
      x: targetDimensions.x + targetDimensions.width / 2,
      y: targetDimensions.y - 1
    }, {
      x: targetDimensions.x + targetDimensions.width / 2,
      y: targetDimensions.y + targetDimensions.height + 1
    }, {
      x: targetDimensions.x - 1,
      y: targetDimensions.y + targetDimensions.height / 2
    }, {
      x: targetDimensions.x + targetDimensions.width + 1,
      y: targetDimensions.y + targetDimensions.height / 2
    }],
      dimensionPairs = {},
      dimensionDifferences = [];
    // in order to draw the lines correctly, we need to match dimensions for starting and finishing the svg drawings.
    // the best lines will minimize the distance between the two elements
    // foreach pair of potential source/target dimensions
    for (let sourceDimensionIndex = 0; sourceDimensionIndex < 4; sourceDimensionIndex++) {
      for (let targetDimensionIndex = 4; targetDimensionIndex < 8; targetDimensionIndex++) {
        // push new source and target pairs when these criteria are met
        const widthDifference = Math.abs(sourceAndTargetDimensions[sourceDimensionIndex].x - sourceAndTargetDimensions[targetDimensionIndex].x),
          heightDifference = Math.abs(sourceAndTargetDimensions[sourceDimensionIndex].y - sourceAndTargetDimensions[targetDimensionIndex].y);
        (sourceDimensionIndex === targetDimensionIndex - 4 ||
          (3 !== sourceDimensionIndex && 6 !== targetDimensionIndex || sourceAndTargetDimensions[sourceDimensionIndex].x < sourceAndTargetDimensions[targetDimensionIndex].x) &&
          (2 !== sourceDimensionIndex && 7 !== targetDimensionIndex || sourceAndTargetDimensions[sourceDimensionIndex].x > sourceAndTargetDimensions[targetDimensionIndex].x) &&
          (0 !== sourceDimensionIndex && 5 !== targetDimensionIndex || sourceAndTargetDimensions[sourceDimensionIndex].y > sourceAndTargetDimensions[targetDimensionIndex].y) &&
          (1 !== sourceDimensionIndex && 4 !== targetDimensionIndex || sourceAndTargetDimensions[sourceDimensionIndex].y < sourceAndTargetDimensions[targetDimensionIndex].y)
        ) &&
          // generate a mapping between total distance and source/target dimensions
          (3 === sourceDimensionIndex && 4 === targetDimensionIndex || 3 === sourceDimensionIndex && 5 === targetDimensionIndex || (
            dimensionDifferences.push(widthDifference + heightDifference), dimensionPairs[dimensionDifferences[dimensionDifferences.length - 1]] = [sourceDimensionIndex, targetDimensionIndex]
          )
          )
      }
    }
    let sourceAndTarget = [];
    //
    sourceAndTarget = 0 === dimensionDifferences.length ? [0, 4] : dimensionPairs[Math.min.apply(Math, dimensionDifferences)];
    const startingX = sourceAndTargetDimensions[sourceAndTarget[0]].x,
      startingY = sourceAndTargetDimensions[sourceAndTarget[0]].y,
      endingX = sourceAndTargetDimensions[sourceAndTarget[1]].x,
      endingY = sourceAndTargetDimensions[sourceAndTarget[1]].y,
      bezierXOffset = Math.max(Math.abs(startingX - endingX) / 2, 10),
      bezierYOffset = Math.max(Math.abs(startingY - endingY) / 2, 10),
      // match control points to source/target dimension pairs
      controlPoint1X = [startingX, startingX, startingX - bezierXOffset, startingX + bezierXOffset][sourceAndTarget[0]].toFixed(3),
      controlPoint1Y = [startingY - bezierYOffset, startingY + bezierYOffset, startingY, startingY][sourceAndTarget[0]].toFixed(3),
      controlPoint2X = [0, 0, 0, 0, endingX, endingX, endingX - bezierXOffset, endingX + bezierXOffset][sourceAndTarget[1]].toFixed(3),
      controlPoint2Y = [0, 0, 0, 0, startingY + bezierYOffset, startingY - bezierYOffset, endingY, endingY][sourceAndTarget[1]].toFixed(3);
    return ["M", startingX.toFixed(3), startingY.toFixed(3), "C", controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, endingX.toFixed(3), endingY.toFixed(3)].join(" ")
  }

  __addPath(path) {
    let root;
    if (this.getElementsByTagName('svg').length === 0) {
      root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.append(root)
    } else {
      root = this.getElementsByTagName('svg')[0]
    }
    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return pathEl.setAttribute("d", path), root.appendChild(pathEl), pathEl
  }

  removePaths() {
    for (const t of this._allConnections) {
      t.path.remove()
    }
    this._allConnections = []
  }
  redraw(width = 0, height = 0) {
    this.__svgFullHeight();
    this._allConnections = this._allConnections.map((connection) => {
      if (document.body.contains(connection.nodes[0])) {
        const pathNode = connection.path,
          path = this.__calculatePath(connection.nodes[0], connection.nodes[1], width, height);
        pathNode.setAttribute("d", path)
        return connection;
      } else {
        return undefined;
      }
    }).filter(path => path);
    this.getElementsByTagName('path').forEach(path => {
      if (!this._allConnections.map(connection => connection.path).includes(path)) {
        path.remove();
      }
    });
  }

  __svgFullHeight() {
    let t = this;
    const {
      width: width,
      height: height,
    } = t.getBoundingClientRect();
    this.width = width, this.height = height;
  }

  render() {
    return ``;
  }
};

SVGConnectors.tag = 'svg-connectors';

export default SVGConnectors;
