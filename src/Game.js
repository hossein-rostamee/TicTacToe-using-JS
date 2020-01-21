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

const machineWillWin = ( squares, lines, j ) => {
    const targetLines = lines.filter( line => {
      const rest = line.filter( cellIndex => cellIndex === j )
      if ( rest.length !== 0 ) return true;
    } )
    //calculate probabilities
    let flag = false;
    targetLines.forEach( line => {
      let sum = 0;
      for ( let i = 0 ; i < 3 ; i++ ){
        if ( squares[ line[ i ] ] === 'O' ) sum++;
      } 
      if ( sum === 2 ) flag = true;
    });
    return flag;
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
  moveMachine( lines, squares, i, j, p, k ){
    if ( k === 9 ) return null;
    i = Math.floor( Math.random() * p.length );
    j = Math.floor( Math.random() * 3 );
    console.log( i, j , "this one \n", p )
    if ( i === NaN || j === NaN ) {
      return null
    }
    while ( squares[ p[ i ].cells[ j ] ] === 'T' ) {
        console.log( '1' )
        i = Math.floor( Math.random() * p.length );
        j = Math.floor( Math.random() * 3 );   
        console.log( i, j , "this two \n", p )   
    }
    let rest
    if (  machineWillWin( squares, lines, p[ i ].cells[ j ] ) ) {
      rest = this.moveMachine( squares, i, j, p, k + 1 )
      if ( !rest ) return null
      else return [ i, j ]
    }
    else return [ i, j ]
  
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
        if ( squares[ line[ i ] ] === 'O' ) sum++;
        // if ( squares[ line[ i ] ] === 'X' ) {
        //   sum = 0;
        //   break;
        // }
      } 
      probabilities.push({
        p : sum / 3,
        cells : line
      });
    });

    let p0 = probabilities.filter( line => line.p === 0 );
    const ans = this.moveMachine( lines, squares, null, null, p0 ,0 );
    if ( !ans ){
      let p1 = probabilities.filter( line => line.p === 1 / 3 );
      const ans = this.moveMachine( lines, squares, null, null, p1, 0 );
      if ( !ans ){
        console.log( 'nothing was found ' );
        return;
      }
      let [ i, j ] = ans;
      squares[ p1[ i ].cells[ j ] ] = 'O';
    }
    let [ i, j ] = ans;
    squares[ p0[ i ].cells[ j ] ] = 'O';

   
    // update state
    this.setState( prevState => ( {
      history: prevState.history.concat([{
        squares: squares 
      }]),
      stepNumber : ++prevState.stepNumber
    } ) )




// try {
//   probabilities.forEach( line => {
//     if ( typeof( line.p ) === undefined ) throw "this is error" 
//   } )
// }
// catch( error ){
//   console.log( error )
// }

    // console.log( probabilities )
    // calculate max probability
    // let index = Math.floor( Math.random() * 9 );
    // let minProb = probabilities[ 0 ];
    // probabilities.forEach( line => {
    //     if ( line.p < minProb.p ) minProb = line;
    // });  
    // console.log( minProb )
    // // calculate equal probabilities
    // const sameProbs = [];
    // probabilities.forEach( line => {
    //   if ( line.p === minProb.p ) sameProbs.push( line ); 
    // });
    // console.log( probabilities )
    // check if center was selected
    // if ( !squares[ 4 ] ){
    //   squares [ 4 ] = 'O';
    //   // update state
    //   this.setState( prevState => ( {
    //     history: prevState.history.concat([{
    //      squares: squares 
    //     }]),
    //     stepNumber : ++prevState.stepNumber
    //   } ) )
    //   return;
    // }
    
    // machine move
    // let i = Math.floor( Math.random() * sameProbs.length );
    // let j = Math.floor( Math.random() * 3 );
    // while ( squares[ sameProbs[ i ].cells[ j ] ] === 'T' || machineWillWin( squares, lines, sameProbs[ i ].cells[ j ] ) ) {
    //     console.log( '1' )
    //     i = Math.floor( Math.random() * sameProbs.length );
    //     j = Math.floor( Math.random() * 3 );      
    // }
    // let rest;
    // if ( machineWillWin( squares, lines, sameProbs[ i ].cells[ j ] ) ) {
    //     rest = probabilities.filter( line => line.p === 1 / 3  )
    //     i = Math.floor( Math.random() * rest.length );
    //     j = Math.floor( Math.random() * 3 );
    //     console.log( '2' )
    //     while ( machineWillWin( squares, lines, squares[ rest[ i ].cells[ j ] ] ) || squares[ rest[ i ].cells[ j ] ] === 'T' || squares[ rest[ i ].cells[ j ] ] === 'O' ){
    //         console.log( '3' )
    //         i = Math.floor( Math.random() * rest.length );
    //         j = Math.floor( Math.random() * 3 );
    //     }
    // }
    // if ( !rest ) 
    // else squares[ rest[ i ].cells[ j ] ] = 'O';

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
    if ( this.state.stepNumber !== 8 ) this.nextMachineMove( squares );
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