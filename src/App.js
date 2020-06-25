import React from 'react';
import './App.css';

const initialPosition = [
  window.innerWidth / 2,
  0
]

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shipPosition: initialPosition,
      shipOrientation: Math.PI / 2,
      rotationSpeed: 0,
      thrusting: false,
      turningLeft: false,
      turningRight: false,
      velocity: [0, 0]
    }
  }

  turnShip(side) {
    if (side === "left" && this.state.shipPosition.y !== 0) {
      this.setState({rotationSpeed: this.state.rotationSpeed - (Math.PI * 0.0001)})
    } else if (side === "right" && this.state.shipPosition.y !== 0) {
      this.setState({rotationSpeed: this.state.rotationSpeed + (Math.PI * 0.0001)})
    }
  }

  thrust() {
    this.setState({
      velocity: [
        this.state.velocity[0] - (Math.cos(this.state.shipOrientation) * 0.02),
        this.state.velocity[1] + (Math.sin(this.state.shipOrientation) * 0.02)
      ]
    })
  }

  gravity() {
    if (this.state.shipPosition[1] >= 0) {
      if (this.state.shipPosition[1] > 0) {
        this.setState({
          velocity: [
            this.state.velocity[0],
            this.state.velocity[1] - 0.01
          ]
        })
      }
    } else {
      this.setState({
        velocity: [
          0,
          0
        ],
        shipPosition: [this.state.shipPosition[0], 0],
        rotationSpeed: 0
      })
    }
  }

  handleKeyDown = (e) => {
    switch( e.keyCode ) {
      case 37: // Left Arrow
        this.setState({turningLeft: true})
        break;
      case 39: // Right Arrow
        this.setState({turningRight: true})
        break;
      case 32: // Space
        console.log("Thrust On")
        this.setState({thrusting: true})
        break;
      default: 
        break;
    }
  }

  handleKeyUp = (e) => {
    switch( e.keyCode ) {
      case 37: // Left Arrow
        this.setState({turningLeft: false})
        break;
      case 39: // Right Arrow
        this.setState({turningRight: false})
        break;
      case 32: // Space
        console.log("Thrust Off")
        this.setState({thrusting: false})
        break;
      default: 
        break;
    }
  }

  moveShip() {
    const {thrusting, turningLeft, turningRight} = this.state
    if (thrusting) {
      this.thrust()
    }
    if (turningLeft && !turningRight) {
      this.turnShip('left')
    } else if (turningRight && !turningLeft) {
      this.turnShip('right')
    }
    this.gravity()

    this.setState({
      shipPosition: [
        this.state.shipPosition[0] + this.state.velocity[0],
        this.state.shipPosition[1] + this.state.velocity[1]
      ],
      shipOrientation: this.state.shipOrientation + this.state.rotationSpeed
    })
  }

  resetShip = () => {
    this.setState({
      shipOrientation: Math.PI / 2,
      shipPosition: initialPosition,
      velocity: [0, 0],
      rotationSpeed: 0
    })
  }

  componentDidMount(){
    this.ticker = setInterval(
      () => this.moveShip(),
      10
    );
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp)
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp)
  }

  render() {
    const [x, y] = this.state.shipPosition
    const {thrusting} = this.state
    return (
      <div className="App">
        <div className="legend">
          <div>
            Vertical Speed: {Number(this.state.velocity[1] * 10).toFixed(2)}
          </div>
          <div>
            Horizontal Speed: {Number(this.state.velocity[0] * 10).toFixed(2)}
          </div>
          <div>
            Rotational Speed: {Number(this.state.rotationSpeed * 10).toFixed(2)}
          </div>
          <button onClick={this.resetShip}>
            Reset
          </button>
        </div>
        <div 
          className="ship"
          style={{
            bottom: y,
            left: x,
            transform: `rotateZ(${this.state.shipOrientation - (Math.PI / 2)}rad)`
            }}
        >
          {
            thrusting && (
              <div className="fumes"></div>
            )
          }
        </div>
      </div>
    );
  }
}

export default App;
