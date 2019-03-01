import React, { Component } from 'react';
import { Route } from 'react-router-dom'

import './App.css';

import { EletronicPoint, Ticket } from './scenes/index'
import { Header } from './components/index'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Route component={EletronicPoint} path="/" exact />
        <Route component={Ticket} path="/ticket" />
      </div>
    );
  }
}

export default App;
