import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar">
        <h3 className="logo">ShortURL</h3>
        <ul className="nav-links">
          <li><Link to="/">Shorten URL</Link></li>
          <li><Link to="/stats">View Stats</Link></li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
