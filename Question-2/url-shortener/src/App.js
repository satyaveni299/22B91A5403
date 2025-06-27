import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShortenerForm from './components/ShortenerForm';
import StatsPage from './components/StatsPage';
import Navbar from './components/Navbar';

class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ShortenerForm />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
