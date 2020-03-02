import React from 'react';
import PropTypes from 'prop-types';

const tau = 2 * Math.PI;
let canvas, ctx, center, radius, initialAngle,
  colors, lineThickness, handleRadius;

let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
  down: false
};

function distance(x1, y1, x2, y2) {
  let xDiff = x2 - x1;
  let yDiff = y2 - y1;
  let d = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
  return d;
};

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  let max = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

class PieChartInput extends React.Component {

  constructor(props) {
    super(props);

    let valid = this.props.percents.reduce((a, b) => a + b, 0) === 1;
    if (!valid) console.error('pie chart input: percent array must sum to 1');

    this.state = {
      percents: this.props.percents || [.3, .4, .3],
      angles: [],
      mouseOver: [],
      grab: [],
      globGrab: false,
    };

    this.canvasRef = React.createRef();

    this.update = this.update.bind(this);
    this.animate = this.animate.bind(this);
    this.getPosFromAngle = this.getPosFromAngle.bind(this);
    this.getMouseAngle = this.getMouseAngle.bind(this);
  }

  render() {
    return (
      <div className="pie-chart-input-container">
        <canvas className="pie-input-canvas" ref={this.canvasRef} />
      </div>
    )
  }

  componentDidMount() {
    canvas = this.canvasRef.current;
    ctx = canvas.getContext('2d');
    canvas.width = canvas.height = this.props.size || 300;
    center = canvas.width / 2;
    radius = center - 10;
    initialAngle = this.props.initialAngle || 0;
    colors = this.props.colors || new Array(this.state.percents.length).fill('white');
    lineThickness = this.props.lineThickness || 2;
    handleRadius = this.props.handleRadius || .04 * radius;

    this.setState({
      mouseOver: new Array(this.state.percents.length).fill(false),
      grab: new Array(this.state.percents.length).fill(false),
      globGrab: false,
    });

    // calculate angles from state.percents
    let newAngles = [];
    let oldAngle = initialAngle;
    for (let i = 0; i < this.state.percents.length; i++) {
      let angle = (this.state.percents[i] * tau) + oldAngle;
      newAngles.push(angle);
      oldAngle = angle;
    }
    this.setState({ angles: newAngles })

    // mouse event listeners
    window.addEventListener('mousemove',
      function (event) {
        let rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
      });

    window.addEventListener('mousedown',
      function () {
        mouse.down = true;
      });

    window.addEventListener('mouseup',
      function () {
        mouse.down = false;
      });

    this.animate();
  }

  // calculate xy position from a given angle in radians
  getPosFromAngle(angle) {
    let xPos = center + radius * Math.cos(angle);
    let yPos = center - radius * Math.sin(angle);
    return ({ x: xPos, y: yPos });
  }

  // gets the angle of the mouse's position relative to center
  // used for setting new angles when dragging
  getMouseAngle() {
    let r = distance(mouse.x, mouse.y, center, center);
    let relativeMouseX = (mouse.x - center) / r;
    let relativeMouseY = (-mouse.y + center) / r;
    let mouseAngle = Math.atan2(relativeMouseY, relativeMouseX);
    if (mouseAngle < 0) mouseAngle += tau;
    // round to nearest percent
    mouseAngle = (tau / 100) * Math.round(mouseAngle / (tau / 100));
    return (mouseAngle);
  }

  // calculate percents array from an array of angles
  getPercentsFromAngles(angles) {
    let newPercents = [];
    // push n-1 percents from angles array
    for (let i = 0; i < angles.length - 1; i++) {
      let newA = (angles[i + 1] - angles[i]);
      if (newA < 0) newA += tau;
      newPercents.push(newA / tau);
    }

    // calculate last percent by subtracting the total from 1
    // this ensures that the percents always sum to 1
    let sum = newPercents.reduce((a, b) => a + b, 0);
    newPercents.push(1 - sum);
    newPercents = newPercents.map(x => Math.round(x * 100) / 100);

    // do not return if any percent is negative
    // this prevents pie sections from overlapping
    let valid = true;
    newPercents.forEach(x => x < 0 ? valid = false : null);
    if (valid) {
      return newPercents;
    }
  }

  update() {
    // release all on mouseup
    if (!mouse.down) {
      this.setState({
        grab: new Array(this.state.percents.length).fill(false)
      });
    }

    // draw colors
    // separate loop ensures colors are drawn underneath everything else
    for (let i = 0; i < this.state.angles.length; i++) {
      let currAngle = (-this.state.angles[i]) % tau;
      let nextAngle = (-this.state.angles[i + 1]) % tau || (-this.state.angles[0]) % tau;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, currAngle, nextAngle, true);
      ctx.moveTo(center, center);
      ctx.fillStyle = colors[i];
      ctx.fill();

      // edge case handling for all angles being equal
      if (this.state.percents[i] === 1) {
        ctx.arc(center, center, radius, 0, tau);
        ctx.fillStyle = colors[i];
        ctx.fill();
      }
    }

    for (let i = 0; i < this.state.angles.length; i++) {
      // draw radial line for each percent
      ctx.beginPath();
      ctx.moveTo(center, center);
      let linePos = this.getPosFromAngle(this.state.angles[i]);
      ctx.lineTo(linePos.x, linePos.y);
      ctx.lineWidth = lineThickness;
      ctx.stroke();

      // draw handle
      ctx.beginPath();
      ctx.arc(linePos.x, linePos.y, handleRadius, 0, tau);
      ctx.fillStyle = 'black';
      ctx.fill();

      // check for mouse over the handle
      let d = distance(mouse.x, mouse.y, linePos.x, linePos.y);
      if (d < handleRadius) {
        let newMouseOver = this.state.mouseOver.slice();
        newMouseOver[i] = true;
        this.setState({ mouseOver: newMouseOver });
      } else {
        let newMouseOver = this.state.mouseOver.slice();
        newMouseOver[i] = false;
        this.setState({ mouseOver: newMouseOver });
      }

      // check for mouse down if hover
      if (this.state.mouseOver[i]) {
        if (mouse.down) {
          if (!this.state.globGrab) {
            let newGrab = this.state.grab.slice();
            newGrab[i] = true;
            this.setState({
              grab: newGrab,
              globGrab: true
            });
          }
        } else {
          let newGrab = this.state.grab.slice();
          newGrab[i] = false;
          this.setState({
            grab: newGrab,
            globGrab: false
          });
        }
      }

      // grab and move line, recalculate angles and percents
      if (this.state.grab[i]) {
        let newAngles = this.state.angles.slice();
        newAngles[i] = this.getMouseAngle();

        // weird visual errors occur with angles of exactly 0 or exactly tau
        // fudge it by adding a tiny amount to any angle of exactly 0
        if (newAngles[i] === 0) newAngles[i] = tau + .0001;

        let oldPercents = this.state.percents;
        let newPercents = this.getPercentsFromAngles(newAngles);

        if (newPercents) {

          // edge case handling for all angles being equal
          if (newPercents.some((x) => x === 1)) {
            newPercents = new Array(newPercents.length).fill(0);
            let index = indexOfMax(oldPercents);
            newPercents[index] = 1;
          }

          this.setState({
            angles: newAngles,
            percents: newPercents
          });
        }
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // update and check for changes
    let oldAngles = this.state.angles.slice();
    this.update();
    let newAngles = this.state.angles.slice();
    let changed = JSON.stringify(oldAngles) !== JSON.stringify(newAngles);
    if (changed) {
      if (typeof (this.props.callback) === "function") {
        this.props.callback(this.state.percents);
      }
    }

    // draw outline circle
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, tau);
    ctx.stroke();

    // draw center circle
    // this avoids visual errors with thicker lines
    ctx.beginPath()
    ctx.arc(center, center, lineThickness / 2, 0, tau);
    ctx.fillStyle = 'black';
    ctx.fill();
  }
}

PieChartInput.propTypes = {
  size: PropTypes.string,
  percents: PropTypes.arrayOf(PropTypes.number),
  initialAngle: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
  lineThickness: PropTypes.number,
  handleRadius: PropTypes.number,
  callback: PropTypes.func
}

export default PieChartInput;