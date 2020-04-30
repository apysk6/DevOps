import React, { useState } from 'react';
import './App.css';
import randomNumber from './random';

function App({number}) {
  return (
    <div className="App">
      {randomNumber}
    </div>
  );
}

export default App;
