import React from 'react';
import './App.css';
import Chart from './map/MyChart'

function App() {
  return (
    <div className="App">
      <Chart width={1000} height={500} />
    </div>
  );
}

export default App;
