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
      beerResultLimit: 12
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
      beerResultLimit: this.state.beerResultLimit + 12
    })
  }

  render() {
    const { error, isLoaded, beers, cardLoaded, currentCard, availableStores, beerResultLimit } = this.state;
    console.log(beers)
    return (
      <div className="App">
        <h1>Beau's Seasonal</h1>
        <div className="main">
          <div className="left-side">  
              {
                beers.filter( (beer) => {
                  if (beer.id === 517797 || beer.id === 169334) {return false} return true
                })
                .slice(0, beerResultLimit)
                .map((beer) => 
                <div className="beercard" key={beer.id} onClick={() => this.showDetails(beer) }>
                  <img class="beer-img" src={beer.image_thumb_url}/> 
                  <div className="beercard-title">{beer.name}</div>
                </div> 
                )
              }
              <br/>
              <div className={beers.length > beerResultLimit ? "beerloader" : "hidden" } onClick={() => this.loadMore()}>Load More</div>
          </div>
          <div className="right-side">
              {cardLoaded ? 
                <div>
                  <div>{currentCard.name}</div>
                  <div className={availableStores.length > 0 ? "hidden" : ""} onClick={() => this.getProductDetails(currentCard.id)}>Show Available Stores</div>
                  {
                    availableStores.map((store) => 
                      <div key={store.id}>{store.name}</div>
                    )
                  }
                </div>
                
                : <div>apple</div>}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
