import React, { Component } from 'react';
import './css/App.css';
import seasonalBeers from './data/seasonalBeers';

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
    this.SetDirectionUrl = this.SetDirectionUrl.bind(this);
  }
  
  componentDidMount() {
    seasonalBeers.map((item) => {
    fetch(`https://lcboapi.com/products?q=${item.key}`, {
      headers: new Headers({
        'Authorization': 'Token MDphNjBjYWE3Mi1iOTVmLTExZTgtYTI4Ni04YjQzZWRkMTE1NTI6OWhrYUJyQmZhTjZEYmtIN01wR3JUeVNGb1F3V3o2YTJ5UFlT'
      })})
      .then(res => res.json())
      .then(
        (result) => {
          const beerList = [...this.state.beers] 
          beerList.push(result.result[0])
          this.setState({
            beers: beerList
          })
          console.log(this.state.beers)
        },
        (error) => {
          const beerList = [...this.state.beers]
          this.setState({
            beers: beerList
          })
          });
    })
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
        })
      },
      (error) => {
        this.setState({
          availableStores: []
        });
      }
    )
  }

  SetDirectionUrl(address, city) {
    const mapLoc =  `https://www.google.com/maps/dir//+${address}+${city}`
    return (
      mapLoc
    )
  }

  loadMore() {
    this.setState({
      beerResultLimit: this.state.beerResultLimit + 6
    })
  }

  render() {
    const { error, isLoaded, beers, cardLoaded, currentCard, availableStores, beerResultLimit } = this.state;
    return (
      <div className="App">
        <div className="App-header"><div className="App-title">Beau's Seasonal</div></div>
        <div className="main">
        <div className={currentCard.length === 0 ? "hidden" : "left-side" } >
              {cardLoaded ? 
                <div className="preview">
                  <div className="preview-title">{currentCard.name}</div>
                  <img className="preview-img" src={currentCard.image_url} />
                  <div className="preview-entry">{currentCard.style} {currentCard.varietal}</div>
                  <div className="preview-entry">Alcohol Content: {currentCard.alcohol_content / 100}%</div>
                  <br/>
                  <div className="preview-entry">{currentCard.tasting_note}</div>
                  <br/>
                  <div className={availableStores.length > 0 ? "hidden" : "beerloader"} onClick={() => this.getProductDetails(currentCard.id)}>Show Available Stores</div>
                  {
                    availableStores.map((store) => 
                    <a target="_blank" className="store-link" href={this.SetDirectionUrl(store.address_line_1, store.city)}>
                      <div className="store-entry" key={store.id}>
                        <span>{store.name}</span> <span>{store.telephone}</span>
                      </div>
                    </a>
                    )
                  }
                </div>
                
                : <div></div>}
          </div>
          <div className="right-side">  
              {
                beers.map((beer) => 
                <div className={currentCard.id === beer.id ? "beercard -selected": "beercard"} key={beer.id} onClick={() => this.showDetails(beer) }>
                  <img className="beer-img" src={beer.image_thumb_url ? beer.image_thumb_url : "images/error.png"}/> 
                  <div className="beercard-title">{beer.name}</div>
                </div> 
                )
              }
              <br/>
              <div className={beers.length > beerResultLimit ? "beerloader" : "hidden" } onClick={() => this.loadMore()}>See more beers</div>
          </div>
          
        </div>
        <div className="App-footer"></div>
      </div>
    );
  }
}

export default App;
