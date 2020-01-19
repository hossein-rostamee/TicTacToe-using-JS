import React from 'react';
import Board from './Board';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
} 

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0
    };
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
    });
  }
  nextMachineMove(squares){
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    const probabilities = [];
  
    //calculate probabilities
    lines.forEach( line => {
      let sum = 0;
      for ( let i = 0 ; i < line.length ; i++ ){
        if ( squares[ line[ i ] ] === 'T' ) sum++;
        if ( squares[ line[ i ] ] === 'O' ) {
          sum = 0;
          break;
        }
      } 
      probabilities.push({
        p : sum / 3,
        cells : line
      });
    });
    
    // calculate max probability
    let maxProb = probabilities[ 0 ];
    probabilities.forEach( line => {
        if ( line.p > maxProb.p ) maxProb = line;
    });  
    
    if ( maxProb.p === 1 ) return;

    // calculate equal probabilities
    const sameProbs = [];
    probabilities.forEach( line => {
      if ( line.p === maxProb.p ) sameProbs.push( line ); 
    });
  
    // machine move
    let i = Math.floor( Math.random() * sameProbs.length );
    let j = Math.floor( Math.random() * 3 );
    while ( squares[ sameProbs[ i ].cells[ j ] ] === 'T'  ) {
        i = Math.floor( Math.random() * sameProbs.length );
        j = Math.floor( Math.random() * 3 );
    }
    squares[ sameProbs[ i ].cells[ j ] ] = 'O';
    
    // update state
    this.setState( prevState => ( {
      history: prevState.history.concat([{
        squares: squares 
      }]),
      stepNumber : ++prevState.stepNumber
    } ) )

  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = 'T';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
    });
    this.nextMachineMove( squares );
    console.log( 'I am In' );
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if(winner){
      status = 'برنده: ' + winner;
    }else 
      if ( this.state.stepNumber === 10 ) 
        status = "مساوی"
    const moves = history.map((step, move) => {
      const desc = move || move === 10 ? move + "حرکت شماره" : 'شروع بازی';
      return (
        <li key={move}>
          <a>{desc}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i)=>this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <div>{ moves }</div>
        </div>
      </div>
    );
  }
}
export default Game;