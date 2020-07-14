import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Stock from './Stocks.png';
class Home extends React.Component {
  render() {
    return (
      <div> <img src={Stock} alt="StockImage" height="120" width='100%;'></img>
        <Jumbotron fluid>
          <Container>
            <h1 className="purple-text">Stock Prices </h1>
            <p></p>
            <p>Welcome to the Stock Market Page. </p>
            <p>You may click on 'Stocks' to view various stocks.</p>
            <p>Search by symbol, industry, or both so you may view their latest 100 days of activity.</p>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Home