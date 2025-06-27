import React, { Component } from 'react';
import './index.css';

class ShortenerForm extends Component {
  state = {
    url: '',
    validity: '',
    shortcode: '',
    response: null,
    error: null,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: null, response: null });
  };

  handleSubmit=async (e) => {
    e.preventDefault();
    const { url, validity, shortcode } = this.state;

    try {
      const res=await fetch('http://localhost:5000/shorturls', {
        method:'POST',
        headers:{ 
          'Content-Type':'application/json' 
        },
        body: JSON.stringify({url,validity,shortcode}),
      });

      const data=await res.json();
      if (!res.ok) throw new Error(data.message);

      this.setState({response:data,error:null });
    } catch (err) {
      this.setState({error:err.message});
    }
  };

  render() {
    const { url,validity,shortcode,response,error} =this.state;

    return (
      <div className="form-container">
        <h2> URL Shortener</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="url" value={url} placeholder="Enter long URL" onChange={this.handleChange} required />
          <input type="text" name="shortcode" value={shortcode} placeholder="Custom shortcode (optional)" onChange={this.handleChange} />
          <input type="number" name="validity" value={validity} placeholder="Valid for (mins)" onChange={this.handleChange} />

          <button type="submit">Shorten</button>
        </form>

        {response && (
          <div className="result">
            <p>Shortened URL: <a href={response.shortLink} target="_blank" rel="noopener noreferrer">{response.shortLink}</a></p>
            <p>Expires At: {new Date(response.expiry).toLocaleString()}</p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    );
  }
}

export default ShortenerForm;
