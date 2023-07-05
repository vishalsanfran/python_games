
import './App.css';
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

export default function Board() {
  const rows = 3, cols = 3;
  const [squares, setSquares] = useState(Array(rows).fill(Array(cols).fill(null)));
  const winner = getWinner(squares);
  let player = 'x', opponent = 'o';

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: X";
  }

  function diagWin(values) {
    for(let i=1; i<values.length; i++) {
      if(values[0][0] != values[i][i]) return false;
    }
    return true;
  }

  function gameOver(values) {
    for(let i = 0; i < values.length; i++)
        for(let j = 0; j < values[0].length; j++)
            if (!values[i][j])
                return true;
                  
    return false;
  }

  function antiDiagWin(values) {
    for(let i=1; i<values.length; i++) {
      if(values[0][values.length - 1] != values[i][values.length - 1 - i]) return false;
    }
    return true;
  }

  function getWinner(values) {
    let winner = null, cnt = 0;
    for(let i=0; i<values.length; i++) {
      cnt = 0;
      for(let j=1; j<values[0].length; j++) {
        if(values[i][0] == values[i][j]) cnt++;
      }
      if (cnt == values[0].length) return values[i][0];
    }

    for(let i=0; i<values[0].length; i++) {
      cnt = 0;
      for(let j=1; j<values.length; j++) {
        if(values[0][i] == values[j][i]) cnt++;
      }
      if (cnt == values.length) return values[0][i];
    }

    if(diagWin(values)) return values[0][0];
    if(antiDiagWin(values)) return values[0][values.length - 1];

    return winner;
  }

  function getScore(winner) {
    if(winner == player) return 10;
    else if(winner == opponent) return -10;
    else return 0;
  }

  function minimax(values, depth, max) {
    let score = getScore(getWinner(values));
    if(Math.abs(score )== 10) return score;
    if(gameOver(values)) return 0;

    let val = max ? -1000 : 1000;
    for(let i = 0; i < values.length; i++) {
        for(let j = 0; j < values[0].length; j++) {
              if (!values[i][j]) {
                  values[i][j] = max ? opponent : player;
                  let recVal = minimax(values, depth + 1, !max);
                  val = max ? Math.max(val, recVal): Math.min(val, recVal);
                  values[i][j] = null;
              }
          }
    }
    return val;
  }

  function findMove(values) {
    let val = -1000, row = -1, col = -1;
    for(let i = 0; i < values.length; i++) {
        for(let j = 0; j < values[0].length; j++) {
            if (!values[i][j]) {
                values[i][j] = opponent;
                let moveVal = minimax(values, 0, false);
                console.log("moveVal " + moveVal + "i " + i + " j " + j);
                values[i][j] = null;
                if (val < moveVal) {
                    row = i;
                    col = j;
                    val = moveVal;
                }
            }
        }
    }
    console.log("move " + [row, col]);
    return [row, col];
  }

  function handleClick(row, col) {
    if(squares[row][col] || getWinner(squares)) return;
    const next = squares.map(arr => arr.slice());
    next[row][col] = player;
    const move = findMove(next);
    next[move[0]][move[1]] = opponent;
    setSquares(next);
  }

  function getColumns(row, values) {
    var columns = [];
      for(let i=0; i < values.length; i++) {
        columns.push(<Square value={values[i]} onSquareClick={() => handleClick(row, i)}/>);
      }
      return columns;
  }
  
  function getBoard(values) {
    const rows = [];
    for(let j=0; j < values.length; j++) {
      rows.push(<div className="board-row" >{getColumns(j, values[j])}</div>);
    }
    return rows;
  }

  return (
    <>
    <div className="status">{status}</div>
    {getBoard(squares)}
    </>
  );
  
}
