import React from 'react';

export default class Puzzle extends React.Component {
  constructor(props) {
    super(props);

    let topHints = [[]]
    
    let leftHints = [[]]

    this.state = {
      builder: true,
      topHints: topHints,
      leftHints: leftHints,
      grid: [[null]],
    }
  }

  coord(row, col) {
    return `(${col}, ${row})`;
  }

  updateHintCol(col,hint,value) {
    const hints = this.state.topHints[col];
    if(hint >= hints.length) {
      this.state.topHints[col] = [value].concat(hints);
    } else {
      hints[hint] = value;
    }
    this.setState({
      topHints: this.state.topHints,
    })
  }

  buildTopHint() {
    const maxTop = Math.max(this.state.topHints.reduce((size, hint) => size > hint.length ? size : hint.length, 0), 1) + (this.state.builder ? 1 : 0);
    return(this.state.topHints.map((hints, index) => 
    <div className="hintCol">
      {Array(maxTop - hints.length).fill(<Square editable={this.state.builder} isHint="true" updateText={(value) => this.updateHintCol(index, hints.length, value)}/>)}
      {hints.map((hint, hintID) => <Square editable={this.state.builder} isHint="true" text={hint} updateText={(value) => this.updateHintCol(index, hintID, value)}/>)}
    </div>));
  }

  buildSideHint() {
    const maxTop = Math.max(this.state.leftHints.reduce((size, hint) => size > hint.length ? size : hint.length, 0), 2);
    return(this.state.leftHints.map((hints, index) => 
    <div className="puzzleRow">
      {Array(maxTop - hints.length).fill(<Square editable={this.state.builder} isHint="true" updateText={()=>{}}/>)}
      {hints.map((hint, hintID) => <Square editable={this.state.builder} isHint="true" text={hint} updateText={()=>{}}/>)}
    </div>));
  }

  buildGrid() {
    return(this.state.grid.map((line, row) => 
      <div className="puzzleRow" key={row}>
        {line.map((cell, col) => <Square 
        coord={this.coord(row, col)} 
        fill={cell} 
        clicked={() => {
          if(this.state.builder) return;
          let upgrid = this.state.grid.slice();
          upgrid[row][col] = !upgrid[row][col];
          this.setState({
            grid: upgrid,
          });
        }}
        />)}
      </div>
      )
    );
  }

  render() {
    return(
      <div>
        <h1>
          <div>Picross puzzle builder!</div>
        </h1>
        <div className="fullPuzzle">
          <div className="leftPuzzle">
            {this.buildSideHint()}
          </div>
          <div className="rightPuzzle">
            <div className="topHint">
              {this.buildTopHint()}
            </div>
            <div className="table">
              {this.buildGrid()}
            </div>
          </div>
          <div className="hintCol">
            <Square text="-" clicked={() => {
              this.state.topHints.pop();
              this.state.grid.forEach((a) => a.pop())
              this.setState({
                topHint: this.state.topHint,
                grid: this.state.grid,
              });
            }}/>
            <Square text="+" clicked={() => {
              this.state.topHints.push([]);
              this.state.grid.forEach((a) => a.push(Array(this.state.topHints.length).fill(null)))
              this.setState({
                topHint: this.state.topHint,
                grid: this.state.grid,
              });
            }}/>
          </div>
        </div>
        <div className="puzzleRow">
          <Square text="-" clicked={() => {
            this.state.leftHints.pop();
            this.state.grid.pop();
            this.setState({
              leftHints: this.state.leftHints,
              grid: this.state.grid,
            });
          }}/>
          <Square text="+" clicked={() => {
            this.state.leftHints.push([]);
            this.state.grid.push(Array(this.state.topHints.length).fill(null));
            this.setState({
              leftHints: this.state.leftHints,
              grid: this.state.grid,
            });
          }}/>
        </div>
      </div>
    );
  }
}

class Square extends React.Component {
  render() {
    if(this.props.editable) {
      return this.editableRender()
    }
    const fill = this.props.fill == 1 ? <div className="puzzleFill"/> : null;
    return(
    <button 
      key={this.props.coord} 
      className={"square " + (this.props.isHint ? (this.props.text ? "hintSquare" : "hintBlank") : "puzzleSquare")} 
      onClick={() => {if(this.props.clicked) {this.props.clicked();}}}
      >{fill}{this.props.text}</button>
    );
  }

  editableRender() {
    return(
      <input
        className={"square " + (this.props.text ? "hintSquare" : "hintBlank")}
        value={this.props.text}
        maxSize={2}
        onChange={(value) => this.props.updateText(value.target.value)}
      />
    );
  }
}