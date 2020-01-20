import React, { useState } from 'react'
import { GameBoard } from './GameBoard'

const [ state, setState ] = useState(
    { 
        squares: Array(9).fill( null ),
        stepNumber : 0
    } 
)


const calculateWinner = squares => {
    const lines = [
        [ 0, 1, 2 ],
        [ 3, 4 ,5 ],
        [ 6, 7 ,8 ],
        [ 0, 4, 8 ],
        [ 2, 4, 6 ],
        [ 0, 3, 6 ],
        [ 1, 4, 7 ],
        [ 2, 5, 8 ]
    ]

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
    console.log( "i am in ", j );
    console.log( targetLines );
    //calculate probabilities
    let flag = false;
    targetLines.forEach( line => {
      let sum = 0;
      for ( let i = 0 ; i < 3 ; i++ ){
        if ( squares[ line[ i ] ] === 'O' ) sum++;
      } 
      console.log( sum );
      if ( sum === 2 ) flag = true;
    });
    console.log( " continue" )
    return flag;
}

const nextMachineMove = squares => {
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
    
    // check if center was selected
    if ( !squares[ 4 ] ){
      squares [ 4 ] = 'O';
      // update state
      this.setState( prevState => ( {
        history: prevState.history.concat([{
         squares: squares 
        }]),
        stepNumber : ++prevState.stepNumber
      } ) )
      return;
    }
    
    // machine move
    let i = Math.floor( Math.random() * sameProbs.length );
    let j = Math.floor( Math.random() * 3 );
    while ( squares[ sameProbs[ i ].cells[ j ] ] === 'T' || machineWillWin( squares, lines, sameProbs[ i ].cells[ j ] ) ) {
        i = Math.floor( Math.random() * sameProbs.length );
        j = Math.floor( Math.random() * 3 );      
    }
    squares[ sameProbs[ i ].cells[ j ] ] = 'O';
    
    // update state
    setState( {
      squares : squares,
      stepNumber : ++state.stepNumber
    } )

  }

const handleClick = i => {
    const squares = state.squares
    squares[ i ] = 'T'
    setState( 
        {
            squares : squares,
            stepNumber : ++state.stepNumber
        } 
    )
    nextMachineMove( squares )
}

const Game = () => {
    
    let status
    const winner = calculateWinner( state.squares )
    if ( winner ) status = winner + "won"
    else status = ""

    return (
        <GameBoard>
            <Board squares={state.squares} handleClick = { handleClick } ></Board>
            <div className="status">status</div>
        </GameBoard>
}