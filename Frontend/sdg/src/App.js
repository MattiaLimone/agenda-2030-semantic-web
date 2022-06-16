import * as React from 'react';
import './css/App.css';
import Home from './view/homepage';
import Indicatori from './view/indicatori';
import Goal from './view/goal';
import CorrConcept from './view/corrConcept';
import Search from './view/search';
import Navbar from './components/Navbar';
import Target from './view/target';
import AllIndicators from './view/allIndicators';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/indicatori' element={<Indicatori />} />
          <Route path='/goal' element={<Goal />} />
          <Route path='/search' element={<Search />} />
          <Route path='/corrConcept' element={<CorrConcept />} />
          <Route path='/indicators' element={<Indicatori />} />
          <Route path='/target' element={<Target />} />
          <Route path='/allIndicators' element={<AllIndicators />} />
        </Routes>
      </Router>
    </>
  );

}

export default App;
