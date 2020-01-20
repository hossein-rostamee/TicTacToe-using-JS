import React, { Component } from 'react';
import './TicTacToe.css';
import Game from './Game.js';

class App extends Component {
  render() {
    return (
      <div>
          <Game></Game>
      </div>
    );
  }
}

export default App;
