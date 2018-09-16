import React, { Component } from 'react';
import './css/App.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      beers: [],
      cardLoaded: false,
      currentCard: '',
      availableStores: [],
      limit: 10
    };
    this.showDetails = this.showDetails.bind(this);
    this.getProductDetails = this.getProductDetails.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }
  
  componentDidMount() {
    // get all beer call 
    fetch("https://lcboapi.com/products?q=beer&per_page=100", {
      headers: new Headers({
        'Authorization': 'Token MDphNjBjYWE3Mi1iOTVmLTExZTgtYTI4Ni04YjQzZWRkMTE1NTI6OWhrYUJyQmZhTjZEYmtIN01wR3JUeVNGb1F3V3o2YTJ5UFlT'
      })})
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            beers: result.result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  showDetails = (beer) => {
    this.setState({ 
      cardLoaded: true, 
      currentCard: beer,
      availableStores: []
    });
  }

  getProductDetails(productId) {
    fetch(`https://lcboapi.com/stores?product_id=${productId}`, {
      headers: new Headers({
        'Authorization': 'Token MDphNjBjYWE3Mi1iOTVmLTExZTgtYTI4Ni04YjQzZWRkMTE1NTI6OWhrYUJyQmZhTjZEYmtIN01wR3JUeVNGb1F3V3o2YTJ5UFlT'  
    })})
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          availableStores: result.result
        });
      },
      (error) => {
        this.setState({
          availableStores: []
        });
      }
    )
  }

  loadMore() {
    this.setState({
      limit: this.state.limit + 10
    })
  }

  render() {
    const { error, isLoaded, beers, cardLoaded, currentCard, availableStores, limit } = this.state;
    console.log(beers)
    return (
      <div className="App">
      <h1>Beau's Seasonal</h1>
        {
          beers.filter( (beer) => {
            if (beer.id === 517797 || beer.id === 169334) {return false} return true
          })
          .slice(0, limit)
          .map((beer) => 
          <div key={beer.id} onClick={() => this.showDetails(beer) }>
            {beer.name}
          </div> 
          )
        }
        <div className={beers.length > limit ? "" : "hidden" } onClick={() => this.loadMore()}>Load More</div>
        <br />
        {cardLoaded ? 
          <div>
            <div>{currentCard.name}</div>
            <div onClick={() => this.getProductDetails(currentCard.id)}>Show Available Stores</div>
            {
              availableStores.map((store) => 
                <div key={store.id}>{store.name}</div>
              )
            }
          </div>
           
          : <div>apple</div>}
      </div>
    );
  }
}

export default App;
