import React, { useState } from 'react';
import './App.css';
import Game from './components/Game'


function App() {

  const [backgroundColour, setBackgroundColour] = useState("white")

  return (
    <div className="App" style={{backgroundColor: backgroundColour}}>
      <Game 
        backgroundColour={backgroundColour}
        setBackgroundColour={setBackgroundColour}
      />
    </div>
  );
}

export default App;
