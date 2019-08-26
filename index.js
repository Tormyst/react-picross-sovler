import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import Puzzle from './Puzzle';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <div>
        <Puzzle />
        <p>
          Future picross solver
        </p>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
