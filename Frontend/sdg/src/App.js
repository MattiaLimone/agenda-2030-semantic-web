import * as React from 'react';
import logo from './logo.svg';
import './css/App.css';
import Home from './view/homepage';
import Indicatori from './view/IndicatorsTier';
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
        </Routes>
      </Router>
    </>
  );

}

export default App;
