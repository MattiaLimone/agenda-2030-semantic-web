import * as React from 'react';
import './css/App.css';
import Home from './view/homepage';
import Indicatori from './view/IndicatorsTier';
import Goal from './view/goal';
import Navbar from './components/Navbar';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/indicatori'  element={<Indicatori/>} />
          <Route path='/goal' element={<Goal/>}/>
        </Routes> 
      </Router>
    </>
  );

}

export default App;
