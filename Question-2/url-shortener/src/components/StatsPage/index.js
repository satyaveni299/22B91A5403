import React, { Component } from 'react';
import './index.css';

class StatsPage extends Component {
  state = {
    shortcode: '',
    data: null,
    error: null,
  };

  handleChange = (e) => {
    this.setState({ shortcode: e.target.value, error: null, data: null });
  };

  handleFetch = async (e) => {
    e.preventDefault();
    const { shortcode } = this.state;

    try {
      const res = await fetch(`http://localhost:5000/shorturls/${shortcode}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      this.setState({ data, error: null });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  render() {
    const { shortcode, data, error } = this.state;

    return (
      <div className="stats-container">
        <h2> URL Statistics</h2>
        <form onSubmit={this.handleFetch}>
          <input
            type="text"
            name="shortcode"
            value={shortcode}
            placeholder="Enter shortcode"
            onChange={this.handleChange}
            required
          />
          <button type="submit">Get Stats of url</button>
        </form>

        {error && <p className="error"> Errorrr: {error}</p>}

        {data && (
          <div className="analytics">
            <p>Original url: <a href={data.originalURL} target="_blank" rel="noreferrer">{data.originalURL}</a></p>
            <p>Created at: {new Date(data.createdAt).toLocaleString()}</p>
            <p> Expires At: {new Date(data.expiry).toLocaleString()}</p>
            <p>Total Clicks: {data.totalClicks}</p>

            <h4>Clicked Details:</h4>
            <ul>
              {data.clickData.map((click, index) => (
                <li key={index}>
                  [{new Date(click.timestamp).toLocaleString()}]  
                   Refer Link: {click.referrer || 'Direct'} | Location: {click.location}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default StatsPage;
