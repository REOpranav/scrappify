import { createContext, useEffect, useState } from 'react';
import './App.css';
import Search from './Components/Search';

function App() {

  return (
    <div className="App">
      <main>
        <Search />
      </main>
    </div>
  );
}

export default App;