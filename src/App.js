import '@ant-design/v5-patch-for-react-19';
import './App.css';
import { createContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import ListSearch from './Components/ListSearch';
import LandingPage from './Components/LandingPage';
import Search from './Components/Search';


export const UserContext = createContext();

function App() {
  const [dynamicURL, setDynamicURL] = useState('')
  const [spentTime, setSpentTime] = useState(0)

  return (
    <div className="App">
      <UserContext.Provider value={{ setDynamicURL, dynamicURL, spentTime, setSpentTime }}>
        <main className='appMain'>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/search' element={<Search />} />
            <Route path='/list' element={<ListSearch />} />
          </Routes>
        </main>
      </UserContext.Provider>

    </div>
  );
}

export default App;