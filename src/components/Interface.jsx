import React, { Component } from 'react';
//import {hot} from 'react-hot-loader';
import img from '../img/GIFtlogo1.0@3x.png';
import navImg from '../img/GIFtlogo1.0.svg';
import poweredBy from '../img/PoweredBy_200px-White_HorizLogo.png';


function MenuButton(props) {
  return(
    <button 
      id={props.id} 
      className={props.className} 
      onClick={props.onClick}
    >
      <i className={props.iconClass}></i>{props.desc}
    </button>
  );
}

function Logo(props) {
  return(
    <div className='container mb-3 col-sm-6 offset-sm-3 col-md-4 offset-md-4'>
      <div className='container-fluid col-6 text-center col-sm-6 col-md-6 offset-md-3 '>
        <img id='logo' src={props.src} alt={props.alt}/>          
      </div>
    </div>
  );
}

function SearchForm(props) {
  return(
    <div>
      <form id='search_form' onSubmit={props.submitSearch}>
        <div className='form-row'>
          <div className=' col-12 col-md-6 offset-md-3 col-sm-6 offset-sm-3'>
            <input type='search' className='form-control' placeholder='Search for GIFs' id='search_bar' value={props.value} onChange={props.handleChange}/>
          </div>
        </div>
        <div className='form-row justify-content-center col-12 col-sm-12 col-md-12 col-lg-12  '>
          <MenuButton desc='Search' onClick={props.submitSearch} id='search_button' className='btn btn-success' iconClass='fas fa-search'/>
          <MenuButton desc='Random' onClick={props.submitRandom} id='random_button' className='btn btn-primary' iconClass='fas fa-random'/>
          <MenuButton desc='Trending' onClick={props.submitTrending} id='trending_button' className='btn btn-warning' iconClass='fas fa-chart-line'/> 
        </div>
      </form>
    </div>
  );
}

function Navbar(props) {
  return(
    <div id={props.id} className='container-fluid centerer sticky'>
      <div className='row' id='navBarRow'>
        <div className='col-lg-1 col-md-1 col-sm-4 col-4'>
          <img id='navlogo' src={navImg} alt='nav gift logo'/>
        </div>
        <form id='nav_search_form' className='col-6'onSubmit={props.submitSearch}>
          <input type='search' className='form-control' placeholder='Search for GIFs' id='nav_search_bar' value={props.value} onChange={props.handleChange}></input>
        </form>
        <div className='col-lg-4 col-md-4 col-sm-12'>
          <MenuButton desc='Search' onClick={props.submitSearch} id='nav_search_button' className='btn btn-success btn-sm navbtn' iconClass='fas fa-search'/>
          <MenuButton desc='Random' onClick={props.submitRandom} id='nav_random_button' className='btn btn-primary btn-sm navbtn' iconClass='fas fa-random'/>
          <MenuButton desc='Trending' onClick={props.submitTrending} id='nav_trending_button' className='btn btn-warning btn-sm navbtn' iconClass='fas fa-chart-line'/>
        </div>
      </div>
    </div>
  );
}

function Footer(props) {
  return(
    <footer className="footer fixed-bottom">
      <div className="row container-fluid justify-content-center">
        <div className="col-3 col-sm-2 col-md-2 col-lg-1">
          <img id="giphy" src={poweredBy} alt="Giphy logo"/>
        </div>
          <div className="copyright text-dark bold">
            <p>© 2019 - Present</p>
          </div>
        </div>
    </footer>
  )
}

class ResultImage extends Component {

  componentDidMount() {
    const height = document.getElementById(this.props.id).height;
    this.props.updateHeight(height, this.props.columnIndex);
  };
  
  render() {
    return(
      <img src={this.props.image.src} id={this.props.imgKey} key={this.props.imgKey} alt='result'/>
    );
  };
}

class ResultColumn extends Component {

  constructor(props){
    super(props);
    this.state = {
      columnId: 'column-' + this.props.columnId,
      columnWidth: 'col-md-' + this.props.columnWidth + ' result-column',
    }
  };

  render() {
    return(
      <div key={this.props.columnId} id={this.state.columnId} className={'col-md-' + this.props.columnWidth + ' result-column'}>
        {this.props.images.map((image, index) => {
          const imgKey = this.props.columnId + '-' + index;
          return(
            <ResultImage image={image} id={imgKey} key={imgKey} imgKey={imgKey} alt='result' updateHeight={this.props.updateHeight} columnIndex={this.props.columnId} columnId={this.state.columnId}/>
          )
        })}
      </div>
    );
  };
}

class Results extends Component {

  constructor(props){
    super(props);
    this.state = {
      value: null,
    }
  }

  render() {
    return(
      <div id="results_row" className="row container-fluid offset-0 mt-1">
        {this.props.columnWidths.map((column, index) => {
          return(
            <ResultColumn 
              key={index} 
              columnId={index} 
              columnWidth={this.props.columnWidths[index]} 
              images={this.props.columnImages[index]} 
              updateHeight={this.props.updateHeight}
            />
          );
        })}
      </div>
    ); 
  };
}

class Interface extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      isNavBarVisible: false,
      columnWidths: [2,3,2,3,2],
      columnHeights: [0,0,-1,0,0],
      columnImages: [[],[],[],[],[]],
      shortestColumn: 0,
      batchNumber: 0,
      giphyUrl: 'https://api.giphy.com/v1/gifs/',
      apiKey: 'api_key=GxP3rAWWiabibTsL3i2Fj2R2g2u8DFQV', //technically you should never have this in git. 
    }
    this.handleChange = this.handleChange.bind(this);
    this.navBarVisible = this.navBarVisible.bind(this);
    this.submitRandom = this.submitRandom.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.submitTrending = this.submitTrending.bind(this);
    this.getShortestColumn = this.getShortestColumn.bind(this);
    this.addImage = this.addImage.bind(this);
    this.loadImage = this.loadImage.bind(this);
    this.fetchJson = this.fetchJson.bind(this);
    this.fetchRandom = this.fetchRandom.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ?
      this.navBarVisible(true) : this.navBarVisible(false)
  }

  handleChange(event) {
    this.setState({searchValue: event.target.value});
  };

  navBarVisible(isVisible) {
    this.setState({isNavBarVisible: isVisible});
  };

  getShortestColumn() {
    const heights = this.state.columnHeights;
    const index = heights.reduce((lowest, columnHeight, currentIndex) => {
      if (columnHeight < heights[lowest]) {
        return currentIndex;
      }
      return lowest;
    }, 0);
  
    this.setState({shortestColumn: index});
  };

  updateHeight(height, columnId) {
    const newHeight = this.state.columnHeights[columnId] + height;
    const newColumnHeights = this.state.columnHeights.slice();
    newColumnHeights.splice(columnId, 1, newHeight);
    this.setState({
      columnHeights: newColumnHeights,
    });
  };

  addImage(image, batchNumber) {
    if (this.state.batchNumber !== batchNumber){
      console.log('old batch')
      return;
    }
    const columnId = this.state.shortestColumn;
    const newColumnImages = this.state.columnImages.slice();
    const newColumn = newColumnImages[columnId];
    newColumn.push(image);
    newColumnImages.splice(columnId, 1, newColumn);
    
    this.setState({
      columnImages: newColumnImages,
    });
    this.getShortestColumn();
  };
  
  loadImage(url, batchNumber) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve({
            image: image,
            batchNumber: batchNumber,
          });
      };
  
      image.onerror = () => {
        const message = 'Could not load image at ' + url;
        reject(message);
      };
      image.src = url;
    });
  };
  
  fetchJson(url) {
    fetch(url)
      .then(response => response.json())
      .then((imageResult) => {
        imageResult.data.forEach((result) => {
          const resultUrl = String(result.images.fixed_width.url);
            this.loadImage(resultUrl, this.state.batchNumber)
              .then((resolvedImage) => {

                this.addImage(resolvedImage.image, resolvedImage.batchNumber);
              })
        });
      });
  };

  fetchRandom(url) {
    fetch(url)
      .then(response => response.json())
      .then((imageResult) => {
        const resultUrl = String(imageResult.data.images.fixed_width.url);
        this.loadImage(resultUrl, this.state.batchNumber)
          .then((resolvedImage) => {
            console.log(resolvedImage)
            this.addImage(resolvedImage.image, resolvedImage.batchNumber);
          });
      });
  };

  

  submitSearch(event) {
    event.preventDefault();
    const url = (this.state.giphyUrl + 'search?' + this.state.apiKey + '&q=' + this.state.searchValue + '&limit=50&offset=0&rating=R&lang=en');
    this.setState({
      columnImages: [[],[],[],[],[]],
      columnWidths: [2, 3, 2, 3, 2],
      columnHeights:[0, 0, -1, 0, 0],
      batchNumber: this.state.batchNumber + 1,
    }, this.fetchJson(url));
  };
  submitRandom() {
    const url = (this.state.giphyUrl  + 'random?' + this.state.apiKey + '&offset=0&rating=R&lang=en');
    console.log(url)
    this.setState({
      columnImages: [[],[],[],[],[]],
      columnWidths: [2, 1, 6, 1, 2],
      columnHeights:[0, 0, -1, 0, 0],
      shortestColumn: 2,
      batchNumber: this.state.batchNumber + 1,
    }, this.fetchRandom(url));

  };
  
  submitTrending() {
    const url = (this.state.giphyUrl  + 'trending?' + this.state.apiKey + '&limit=50&offset=0&rating=R&lang=en');
    this.setState({
      columnImages: [[],[],[],[],[]],
      columnWidths: [2, 3, 2, 3, 2],
      columnHeights:[0, 0, -1, 0, 0],
    }, this.fetchJson(url));
    
  };

  render() {
    return(
      <div className='Interface'>
        <Navbar 
          id={this.state.isNavBarVisible ? 'gift-navbar' : 'gift-navbar-hidden'}
          value={this.state.searchValue}
          handleChange={this.handleChange}
          submitRandom={this.submitRandom}
          submitSearch={this.submitSearch}
          submitTrending={this.submitTrending}
          onSubmit={this.submitSearch}
        />
        <Logo src={img} alt='App Logo'></Logo>
        <SearchForm 
          value={this.state.searchValue}
          handleChange={this.handleChange}
          submitRandom={this.submitRandom}
          submitSearch={this.submitSearch}
          submitTrending={this.submitTrending}
          onSubmit={this.submitSearch}
        />
        <Results 
          columnWidths={this.state.columnWidths}
          columnImages={this.state.columnImages}
          updateHeight={this.updateHeight}
        />
        <Footer> 
          
        </Footer>
      </div>
    );
  };
}

export default Interface;
