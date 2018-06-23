import 'bulma/css/bulma.css';
import './App.css';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTytes from 'prop-types';
import CityInput from './CityInput';
import WeatherCard from './WeatherCard';
import WeatherStore from './WeatherStore';
import MyGeoButton from './MyGeoButton';

@observer(['store'])
class App extends Component {
  async componentDidMount () {
    const isFirstRun = window.localStorage.getItem('firstRun');
    window.localStorage.setItem('firstRun', 'false');
    if (isFirstRun === null) {
      try {
        const coords = await this.props.store.getMyLocation();
        await this.props.store.addCityByCoords(coords);
      } catch (err) {
        console.error(err);
      }
    }
  }

  render () {
    const {store} = this.props;
    return (
      <div className="container">
        <div className="navbar has-text-centered">
          <div className="navbar-item">
            <CityInput/>
          </div>
          <div className="navbar-item">
            <MyGeoButton/>
          </div>
        </div>
        <div className="section weather">
          {store.citiesList.map(city => <WeatherCard key={city.id} city={city}/>)}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  store: PropTytes.instanceOf(WeatherStore)
};

export default App;
